import { PriorityLevel, RiskCategory, TestPlanData } from '../types/testPlan';

export type AIFieldKey =
  | 'summary'
  | 'objectives'
  | 'testBasis'
  | 'constraints'
  | 'approachSummary'
  | 'qualityMetrics'
  | 'testDataRequirements'
  | 'remainingTasks'
  | 'riskMitigation'
  | 'riskContingency';

export interface DraftFieldParams {
  fieldKey: AIFieldKey;
  fieldLabel: string;
  currentValue: string;
  planContext: TestPlanData;
  extraContext?: string;
}

export interface SuggestedScopeFeature {
  name: string;
  module: string;
  priority: PriorityLevel;
  testLevel: string;
}

export interface SuggestedRiskItem {
  title: string;
  category: RiskCategory;
  probability: number;
  impact: number;
  mitigation: string;
  contingency: string;
}

async function postJson<T>(endpoint: string, payload: unknown): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as { error?: string } & T;

  if (!response.ok) {
    throw new Error(
      data.error || `Error al comunicarse con el servicio de IA (HTTP ${response.status}).`
    );
  }

  return data;
}

/**
 * Solicita al backend un borrador profesional para un campo complejo del Plan de Pruebas,
 * utilizando el contexto actual del formulario y la variable de entorno GEMINI_API_KEY en el servidor.
 */
export async function generateFieldDraft(params: DraftFieldParams): Promise<string> {
  const data = await postJson<{ text: string }>('/api/ai/draft', params);
  return data.text;
}

/**
 * Sugiere funcionalidades en alcance basadas en el contexto actual del proyecto.
 */
export async function suggestScopeFeatures(
  planContext: TestPlanData
): Promise<SuggestedScopeFeature[]> {
  const data = await postJson<{ items: SuggestedScopeFeature[] }>('/api/ai/suggest-scope', {
    planContext,
  });

  return (data.items ?? []).map((item) => ({
    name: String(item.name || '').trim(),
    module: String(item.module || 'General').trim(),
    priority:
      item.priority === 'Alta' || item.priority === 'Media' || item.priority === 'Baja'
        ? item.priority
        : 'Media',
    testLevel: String(item.testLevel || 'Sistema').trim(),
  }));
}

/**
 * Sugiere riesgos técnicos y de proyecto con puntuación 1–5, mitigación y contingencia.
 */
export async function suggestRiskItems(planContext: TestPlanData): Promise<SuggestedRiskItem[]> {
  const data = await postJson<{ items: SuggestedRiskItem[] }>('/api/ai/suggest-risks', {
    planContext,
  });

  const clamp = (n: unknown) => {
    const num = Number(n);
    if (!Number.isFinite(num)) return 3;
    return Math.min(5, Math.max(1, Math.round(num)));
  };

  return (data.items ?? []).map((item) => ({
    title: String(item.title || '').trim(),
    category: item.category === 'Proyecto' ? 'Proyecto' : 'Producto',
    probability: clamp(item.probability),
    impact: clamp(item.impact),
    mitigation: String(item.mitigation || '').trim(),
    contingency: String(item.contingency || '').trim(),
  }));
}
