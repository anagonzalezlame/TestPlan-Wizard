import 'dotenv/config';
import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

function createGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error(
      'Falta configurar GEMINI_API_KEY en el entorno del servidor (.env o panel de Secrets).'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function buildPlanContextSummary(context: Record<string, unknown>): string {
  const lines: string[] = [];
  const add = (label: string, val: unknown) => {
    if (typeof val === 'string' && val.trim()) {
      lines.push(`- ${label}: ${val.trim()}`);
    } else if (Array.isArray(val) && val.length > 0) {
      const formatted = val
        .slice(0, 8)
        .map((item) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object' && 'name' in item) {
            return String((item as { name: unknown }).name);
          }
          if (item && typeof item === 'object' && 'title' in item) {
            return String((item as { title: unknown }).title);
          }
          return '';
        })
        .filter(Boolean)
        .join('; ');
      if (formatted) lines.push(`- ${label}: ${formatted}`);
    }
  };

  add('Estándar normativo', context.standard === 'IEEE_829' ? 'IEEE 829-2008' : 'ISO/IEC/IEEE 29119-3');
  add('Título del plan', context.title);
  add('Proyecto', context.projectName);
  add('Resumen ejecutivo', context.summary);
  add('Objetivos', context.objectives);
  add('Base de pruebas', context.testBasis);
  add('Ítems bajo prueba', context.testItems);
  add('Funcionalidades en alcance', context.inScopeFeatures);
  add('Exclusiones', context.outOfScopeFeatures);
  add('Restricciones', context.constraints);
  add('Niveles de prueba', context.testLevels);
  add('Tipos de prueba', context.testTypes);
  add('Técnicas de prueba', context.testTechniques);
  add('Enfoque técnico', context.approachSummary);
  add('Riesgos identificados', context.risks);

  return lines.length > 0
    ? lines.join('\n')
    : '- Plan de pruebas de software general (sin contexto previo completado todavía).';
}

const FIELD_INSTRUCTIONS: Record<string, string> = {
  summary:
    'Redactá un resumen ejecutivo conciso (1 párrafo de 3 a 4 oraciones) que presente el propósito del Plan de Pruebas, el sistema bajo evaluación y el valor para la liberación.',
  objectives:
    'Redactá los objetivos clave de las pruebas (1 párrafo preciso y medible de 3 a 4 oraciones) indicando atributos de calidad, metas verificables y criterios de confianza antes de salir a producción.',
  testBasis:
    'Redactá la Base de Pruebas (Test Basis) en 1 párrafo breve mencionando especificaciones funcionales, contratos API/UX, normas de accesibilidad, seguridad o requisitos regulatorios pertinentes al proyecto.',
  constraints:
    'Redactá las restricciones y supuestos operativos del alcance (1 párrafo de 2 a 4 oraciones) cubriendo ventanas de despliegue, dependencias externas, límites de entornos o políticas de datos.',
  approachSummary:
    'Redactá la descripción del enfoque técnico de pruebas (Approach) en 1 párrafo sólido (3 a 4 oraciones) integrando los niveles, tipos y técnicas seleccionados con equilibrio entre automatización y pruebas exploratorias.',
  qualityMetrics:
    'Redactá las métricas de calidad y umbrales objetivo en una línea o párrafo breve con indicadores concretos (tasa de ejecución, aprobación, densidad de defectos críticos, tiempos de respuesta o cobertura).',
  testDataRequirements:
    'Redactá los requerimientos de datos de prueba en 1 párrafo concreto (usuarios sintéticos, anonimización, casos borde, estados de negocio y limpieza de datos).',
  remainingTasks:
    'Redactá 2 a 3 tareas preparatorias pendientes realistas previas a la ejecución (accesos, credenciales sandbox, sincronización con equipos dependientes).',
  riskMitigation:
    'Redactá un plan de mitigación preventivo concreto y accionable de QA (1 a 2 oraciones) para reducir la probabilidad o detectar temprano el riesgo descrito.',
  riskContingency:
    'Redactá un plan de contingencia operativo (1 a 2 oraciones) que defina cómo responder o mitigar el impacto (rollback, feature flag, plan B) si el riesgo ocurre.',
};

function mapUpstreamError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('GEMINI_API_KEY')) {
    return { status: 500, message: raw };
  }
  if (raw.includes('403') || raw.includes('PERMISSION_DENIED') || raw.includes('API_KEY_INVALID')) {
    return {
      status: 403,
      message:
        'La clave de API de Gemini no es válida o no tiene permisos. Verificá GEMINI_API_KEY en Settings > Secrets o en tu archivo .env.',
    };
  }
  if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      message: 'Se alcanzó temporalmente el límite de cuota de la API de IA. Intentá nuevamente en unos segundos.',
    };
  }
  return {
    status: 502,
    message: `No se pudo generar el borrador con IA: ${raw}`,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Endpoint 1: Draft a single complex text field
  app.post('/api/ai/draft', async (req: Request, res: Response) => {
    try {
      const { fieldKey, fieldLabel, currentValue, planContext, extraContext } = req.body ?? {};

      if (typeof fieldKey !== 'string' || !fieldKey.trim()) {
        res.status(400).json({ error: 'Se requiere el parámetro fieldKey.' });
        return;
      }

      const ai = createGeminiClient();
      const contextSummary = buildPlanContextSummary(
        planContext && typeof planContext === 'object' ? planContext : {}
      );
      const taskInstruction =
        FIELD_INSTRUCTIONS[fieldKey] ??
        `Redactá contenido técnico profesional y conciso para el campo "${String(fieldLabel || fieldKey)}" de un Plan de Pruebas.`;

      const extraBlock =
        typeof extraContext === 'string' && extraContext.trim()
          ? `\nContexto específico del elemento:\n${extraContext.trim()}\n`
          : '';

      const existingBlock =
        typeof currentValue === 'string' && currentValue.trim()
          ? `\nBorrador actual del usuario (mejoralo y profesionalizalo manteniendo la intención):\n${currentValue.trim()}\n`
          : '';

      const prompt = `Contexto del Plan de Pruebas:\n${contextSummary}${extraBlock}${existingBlock}\nTarea:\n${taskInstruction}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction:
            'Sos un Arquitecto de QA Senior especialista en las normas ISO/IEC/IEEE 29119-3 e IEEE 829. Respondé exclusivamente en español profesional, claro y técnico. Devolvé únicamente el texto listo para insertar directamente en el campo del formulario: sin saludos, sin comillas envolventes, sin encabezados Markdown ni explicaciones adicionales.',
        },
      });

      const text = (response.text ?? '').trim();
      if (!text) {
        res.status(502).json({ error: 'La API devolvió una respuesta vacía.' });
        return;
      }

      res.json({ text });
    } catch (err) {
      const mapped = mapUpstreamError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  // Endpoint 2: Suggest structured scope features based on project context
  app.post('/api/ai/suggest-scope', async (req: Request, res: Response) => {
    try {
      const { planContext } = req.body ?? {};
      const ai = createGeminiClient();
      const contextSummary = buildPlanContextSummary(
        planContext && typeof planContext === 'object' ? planContext : {}
      );

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Contexto del Plan de Pruebas:\n${contextSummary}\n\nGenerá 3 funcionalidades concretas y realistas en alcance que complementen (sin repetir) las ya existentes.`,
        config: {
          systemInstruction:
            'Sos un Arquitecto de QA Senior experto en ISO/IEC/IEEE 29119-3 e IEEE 829. Respondé en español técnico y preciso.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: 'Descripción clara de la funcionalidad a probar' },
                module: { type: Type.STRING, description: 'Nombre breve del módulo o subsistema' },
                priority: { type: Type.STRING, description: 'Alta, Media o Baja' },
                testLevel: { type: Type.STRING, description: 'Nivel de prueba recomendado, ej. Integración / Sistema' },
              },
              required: ['name', 'module', 'priority', 'testLevel'],
            },
          },
        },
      });

      const rawJson = (response.text ?? '[]').trim();
      const parsed = JSON.parse(rawJson);
      res.json({ items: Array.isArray(parsed) ? parsed : [] });
    } catch (err) {
      const mapped = mapUpstreamError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  // Endpoint 3: Suggest structured risks for the 5x5 matrix
  app.post('/api/ai/suggest-risks', async (req: Request, res: Response) => {
    try {
      const { planContext } = req.body ?? {};
      const ai = createGeminiClient();
      const contextSummary = buildPlanContextSummary(
        planContext && typeof planContext === 'object' ? planContext : {}
      );

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Contexto del Plan de Pruebas:\n${contextSummary}\n\nIdentificá 3 riesgos relevantes (combinando Producto y Proyecto) que no estén duplicados, con probabilidad (1-5), impacto (1-5), plan de mitigación y plan de contingencia.`,
        config: {
          systemInstruction:
            'Sos un Arquitecto de QA Senior experto en gestión de riesgos bajo ISO/IEC/IEEE 29119-3 e IEEE 829. Respondé en español técnico y preciso.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Título conciso del riesgo' },
                category: { type: Type.STRING, description: 'Producto o Proyecto' },
                probability: { type: Type.INTEGER, description: 'Entero de 1 a 5' },
                impact: { type: Type.INTEGER, description: 'Entero de 1 a 5' },
                mitigation: { type: Type.STRING, description: 'Plan de mitigación preventivo concreto' },
                contingency: { type: Type.STRING, description: 'Plan de contingencia operativo si ocurre' },
              },
              required: ['title', 'category', 'probability', 'impact', 'mitigation', 'contingency'],
            },
          },
        },
      });

      const rawJson = (response.text ?? '[]').trim();
      const parsed = JSON.parse(rawJson);
      res.json({ items: Array.isArray(parsed) ? parsed : [] });
    } catch (err) {
      const mapped = mapUpstreamError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SpecPlan QA server listening on http://localhost:${PORT}`);
  });
}

startServer();
