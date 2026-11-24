import {
  IMPACT_LABELS,
  PROBABILITY_LABELS,
  TestPlanData,
  WizardStepId,
  getRiskScore,
  getRiskSeverity,
} from '../types/testPlan';

export type DocumentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'keyValue'; rows: Array<{ label: string; value: string }> }
  | {
      type: 'table';
      headers: string[];
      rows: string[][];
      numericColumns?: number[];
    };

export interface StructuredSection {
  id: string;
  number: string;
  title: string;
  blocks: DocumentBlock[];
}

export interface StructuredDocument {
  standardLabel: string;
  standardShort: string;
  documentId: string;
  title: string;
  projectName: string;
  version: string;
  status: string;
  author: string;
  approver: string;
  date: string;
  sections: StructuredSection[];
}

export interface StepCompleteness {
  stepId: WizardStepId;
  completed: number;
  total: number;
  missingFields: string[];
}

const emptyText = (val: string, fallback = 'Pendiente de definición.'): string =>
  val.trim().length > 0 ? val.trim() : fallback;

function buildRiskTableRows(plan: TestPlanData): string[][] {
  return [...plan.risks]
    .sort((a, b) => getRiskScore(b.probability, b.impact) - getRiskScore(a.probability, a.impact))
    .map((risk) => {
      const score = getRiskScore(risk.probability, risk.impact);
      const severity = getRiskSeverity(score);
      return [
        risk.code || 'RSK',
        risk.title || 'Sin descripción',
        risk.category,
        `${risk.probability} (${PROBABILITY_LABELS[risk.probability] ?? ''})`,
        `${risk.impact} (${IMPACT_LABELS[risk.impact] ?? ''})`,
        `${score} — ${severity}`,
        risk.mitigation || 'Sin mitigación',
      ];
    });
}

function buildIso29119Sections(plan: TestPlanData): StructuredSection[] {
  const sections: StructuredSection[] = [
    {
      id: 'iso-1',
      number: '1',
      title: 'Contexto de las Pruebas',
      blocks: [
        { type: 'subheading', text: '1.1 Resumen Ejecutivo y Proyecto' },
        { type: 'paragraph', text: emptyText(plan.summary) },
        { type: 'subheading', text: '1.2 Objetivos de las Pruebas' },
        { type: 'paragraph', text: emptyText(plan.objectives) },
        { type: 'subheading', text: '1.3 Base de Pruebas (Test Basis)' },
        { type: 'paragraph', text: emptyText(plan.testBasis) },
        { type: 'subheading', text: '1.4 Referencias Documentales' },
        plan.references.length > 0
          ? { type: 'list', items: plan.references }
          : { type: 'paragraph', text: 'No se registraron documentos de referencia.' },
      ],
    },
    {
      id: 'iso-2',
      number: '2',
      title: 'Alcance y Elementos Bajo Prueba',
      blocks: [
        { type: 'subheading', text: '2.1 Elementos de Prueba (Test Items)' },
        plan.testItems.length > 0
          ? {
              type: 'table',
              headers: ['Elemento', 'Versión', 'Tipo', 'Referencia'],
              rows: plan.testItems.map((item) => [
                item.name || 'Sin nombre',
                item.version || '—',
                item.type || '—',
                item.reference || '—',
              ]),
            }
          : { type: 'paragraph', text: 'No se declararon elementos de prueba.' },
        { type: 'subheading', text: '2.2 Funcionalidades en Alcance' },
        plan.inScopeFeatures.length > 0
          ? {
              type: 'table',
              headers: ['Funcionalidad', 'Módulo', 'Prioridad', 'Nivel de Prueba'],
              rows: plan.inScopeFeatures.map((f) => [
                f.name || 'Sin especificar',
                f.module || 'General',
                f.priority,
                f.testLevel || 'Sistema',
              ]),
            }
          : { type: 'paragraph', text: 'No se definieron funcionalidades en alcance.' },
        { type: 'subheading', text: '2.3 Exclusiones (Fuera de Alcance)' },
        plan.outOfScopeFeatures.length > 0
          ? {
              type: 'table',
              headers: ['Elemento Excluido', 'Justificación'],
              rows: plan.outOfScopeFeatures.map((ex) => [
                ex.name || 'Sin especificar',
                ex.reason || 'Sin justificación',
              ]),
            }
          : { type: 'paragraph', text: 'No se registraron exclusiones explícitas.' },
        { type: 'subheading', text: '2.4 Restricciones y Supuestos' },
        { type: 'paragraph', text: emptyText(plan.constraints, 'Sin restricciones registradas.') },
      ],
    },
    {
      id: 'iso-3',
      number: '3',
      title: 'Registro y Evaluación de Riesgos',
      blocks: [
        plan.risks.length > 0
          ? {
              type: 'table',
              headers: [
                'Código',
                'Riesgo',
                'Tipo',
                'Prob.',
                'Impacto',
                'Exposición',
                'Plan de Mitigación',
              ],
              rows: buildRiskTableRows(plan),
              numericColumns: [5],
            }
          : { type: 'paragraph', text: 'No se identificaron riesgos en el registro.' },
        ...(plan.risks.length > 0
          ? [
              { type: 'subheading', text: '3.1 Planes de Contingencia' } as DocumentBlock,
              {
                type: 'list',
                items: plan.risks.map(
                  (r) =>
                    `${r.code} (${r.title || 'Riesgo'}): ${emptyText(
                      r.contingency,
                      'Sin contingencia definida.'
                    )}`
                ),
              } as DocumentBlock,
            ]
          : []),
      ],
    },
    {
      id: 'iso-4',
      number: '4',
      title: 'Estrategia de Pruebas',
      blocks: [
        { type: 'subheading', text: '4.1 Enfoque General' },
        { type: 'paragraph', text: emptyText(plan.approachSummary) },
        {
          type: 'keyValue',
          rows: [
            {
              label: 'Niveles de prueba',
              value: plan.testLevels.length > 0 ? plan.testLevels.join(' · ') : 'No definidos',
            },
            {
              label: 'Tipos de prueba',
              value: plan.testTypes.length > 0 ? plan.testTypes.join(' · ') : 'No definidos',
            },
            {
              label: 'Técnicas de diseño',
              value:
                plan.testTechniques.length > 0 ? plan.testTechniques.join(' · ') : 'No definidas',
            },
            {
              label: 'Métricas de calidad',
              value: emptyText(plan.qualityMetrics, 'No especificadas.'),
            },
          ],
        },
      ],
    },
    {
      id: 'iso-5',
      number: '5',
      title: 'Criterios de Control, Aceptación y Suspensión',
      blocks: [
        { type: 'subheading', text: '5.1 Criterios de Entrada' },
        plan.entryCriteria.length > 0
          ? { type: 'list', items: plan.entryCriteria }
          : { type: 'paragraph', text: 'Sin criterios de entrada definidos.' },
        { type: 'subheading', text: '5.2 Criterios de Salida y Aprobación (Pass/Fail)' },
        plan.exitCriteria.length > 0
          ? { type: 'list', items: plan.exitCriteria }
          : { type: 'paragraph', text: 'Sin criterios de salida definidos.' },
        { type: 'subheading', text: '5.3 Criterios de Suspensión' },
        plan.suspensionCriteria.length > 0
          ? { type: 'list', items: plan.suspensionCriteria }
          : { type: 'paragraph', text: 'Sin criterios de suspensión definidos.' },
        { type: 'subheading', text: '5.4 Requisitos de Reanudación' },
        plan.resumptionRequirements.length > 0
          ? { type: 'list', items: plan.resumptionRequirements }
          : { type: 'paragraph', text: 'Sin requisitos de reanudación definidos.' },
      ],
    },
    {
      id: 'iso-6',
      number: '6',
      title: 'Entornos, Datos de Prueba y Entregables',
      blocks: [
        { type: 'subheading', text: '6.1 Entornos y Herramientas' },
        plan.environments.length > 0
          ? {
              type: 'table',
              headers: ['Entorno', 'Configuración', 'Herramientas', 'Disponibilidad'],
              rows: plan.environments.map((env) => [
                env.name || 'Sin nombre',
                env.configuration || '—',
                env.tools || '—',
                env.availability || '—',
              ]),
            }
          : { type: 'paragraph', text: 'No se especificaron entornos de prueba.' },
        { type: 'subheading', text: '6.2 Requerimientos de Datos de Prueba' },
        { type: 'paragraph', text: emptyText(plan.testDataRequirements) },
        { type: 'subheading', text: '6.3 Entregables de Prueba' },
        plan.deliverables.length > 0
          ? { type: 'list', items: plan.deliverables }
          : { type: 'paragraph', text: 'No se listaron entregables.' },
      ],
    },
    {
      id: 'iso-7',
      number: '7',
      title: 'Personal, Roles y Cronograma',
      blocks: [
        { type: 'subheading', text: '7.1 Equipo, Responsabilidades y Capacitación' },
        plan.staffing.length > 0
          ? {
              type: 'table',
              headers: ['Rol', 'Cant.', 'Responsabilidades', 'Necesidades de Capacitación'],
              rows: plan.staffing.map((s) => [
                s.role || 'Sin especificar',
                String(s.quantity),
                s.responsibilities || '—',
                s.trainingNeeds || 'Ninguna',
              ]),
              numericColumns: [1],
            }
          : { type: 'paragraph', text: 'No se definió la estructura de personal.' },
        { type: 'subheading', text: '7.2 Actividades y Cronograma' },
        plan.schedule.length > 0
          ? {
              type: 'table',
              headers: ['Fase / Actividad', 'Inicio', 'Fin', 'Entregable Asociado'],
              rows: plan.schedule.map((m) => [
                m.phase || 'Sin fase',
                m.startDate || '—',
                m.endDate || '—',
                m.deliverable || '—',
              ]),
              numericColumns: [1, 2],
            }
          : { type: 'paragraph', text: 'No se registraron hitos en el cronograma.' },
        { type: 'subheading', text: '7.3 Tareas Previas Pendientes' },
        {
          type: 'paragraph',
          text: emptyText(plan.remainingTasks, 'Sin tareas pendientes registradas.'),
        },
      ],
    },
    {
      id: 'iso-8',
      number: '8',
      title: 'Aprobaciones y Control de Documento',
      blocks: [
        {
          type: 'table',
          headers: ['Función', 'Responsable', 'Estado', 'Fecha'],
          rows: [
            ['Elaboración', plan.author || 'Pendiente', plan.status, plan.date || '—'],
            ['Aprobación', plan.approver || 'Pendiente', 'Firma pendiente', '—'],
          ],
          numericColumns: [3],
        },
      ],
    },
  ];

  return sections;
}

function buildIeee829Sections(plan: TestPlanData): StructuredSection[] {
  const productRisks = plan.risks.filter((r) => r.category === 'Producto');
  const projectRisks = plan.risks.filter((r) => r.category === 'Proyecto');

  return [
    {
      id: 'ieee-1',
      number: '1',
      title: 'Identificador del Plan de Pruebas',
      blocks: [
        {
          type: 'keyValue',
          rows: [
            { label: 'Identificador único', value: emptyText(plan.documentId, 'TP-001') },
            { label: 'Proyecto / Sistema', value: emptyText(plan.projectName) },
            { label: 'Versión y Estado', value: `v${plan.version || '1.0'} · ${plan.status}` },
            { label: 'Fecha de emisión', value: plan.date || '—' },
          ],
        },
      ],
    },
    {
      id: 'ieee-2',
      number: '2',
      title: 'Referencias',
      blocks: [
        plan.references.length > 0
          ? { type: 'list', items: plan.references }
          : { type: 'paragraph', text: 'No se incluyeron documentos de referencia.' },
        { type: 'subheading', text: 'Base de Pruebas' },
        { type: 'paragraph', text: emptyText(plan.testBasis) },
      ],
    },
    {
      id: 'ieee-3',
      number: '3',
      title: 'Introducción',
      blocks: [
        { type: 'paragraph', text: emptyText(plan.summary) },
        { type: 'subheading', text: 'Objetivos' },
        { type: 'paragraph', text: emptyText(plan.objectives) },
        { type: 'subheading', text: 'Restricciones' },
        { type: 'paragraph', text: emptyText(plan.constraints, 'Sin restricciones registradas.') },
      ],
    },
    {
      id: 'ieee-4',
      number: '4',
      title: 'Ítems de Prueba',
      blocks: [
        plan.testItems.length > 0
          ? {
              type: 'table',
              headers: ['Ítem de Prueba', 'Versión', 'Tipo', 'Referencia'],
              rows: plan.testItems.map((item) => [
                item.name || 'Sin nombre',
                item.version || '—',
                item.type || '—',
                item.reference || '—',
              ]),
            }
          : { type: 'paragraph', text: 'No se declararon ítems de prueba.' },
      ],
    },
    {
      id: 'ieee-5',
      number: '5',
      title: 'Riesgos de Software (Producto)',
      blocks: [
        productRisks.length > 0
          ? {
              type: 'table',
              headers: ['Código', 'Riesgo de Software', 'Prob.', 'Impacto', 'Exposición', 'Mitigación'],
              rows: productRisks.map((r) => {
                const score = getRiskScore(r.probability, r.impact);
                return [
                  r.code,
                  r.title,
                  String(r.probability),
                  String(r.impact),
                  `${score} — ${getRiskSeverity(score)}`,
                  r.mitigation || '—',
                ];
              }),
              numericColumns: [2, 3, 4],
            }
          : { type: 'paragraph', text: 'No se registraron riesgos de software (categoría Producto).' },
      ],
    },
    {
      id: 'ieee-6',
      number: '6',
      title: 'Funcionalidades a Probar',
      blocks: [
        plan.inScopeFeatures.length > 0
          ? {
              type: 'table',
              headers: ['Funcionalidad', 'Módulo', 'Prioridad', 'Nivel de Prueba'],
              rows: plan.inScopeFeatures.map((f) => [
                f.name || 'Sin especificar',
                f.module || 'General',
                f.priority,
                f.testLevel || 'Sistema',
              ]),
            }
          : { type: 'paragraph', text: 'No se especificaron funcionalidades a probar.' },
      ],
    },
    {
      id: 'ieee-7',
      number: '7',
      title: 'Funcionalidades No Probadas',
      blocks: [
        plan.outOfScopeFeatures.length > 0
          ? {
              type: 'table',
              headers: ['Funcionalidad Excluida', 'Justificación'],
              rows: plan.outOfScopeFeatures.map((ex) => [
                ex.name || 'Sin especificar',
                ex.reason || 'Sin justificación',
              ]),
            }
          : { type: 'paragraph', text: 'No se registraron exclusiones de alcance.' },
      ],
    },
    {
      id: 'ieee-8',
      number: '8',
      title: 'Enfoque (Approach)',
      blocks: [
        { type: 'paragraph', text: emptyText(plan.approachSummary) },
        {
          type: 'keyValue',
          rows: [
            { label: 'Niveles', value: plan.testLevels.join(' · ') || 'No definidos' },
            { label: 'Tipos', value: plan.testTypes.join(' · ') || 'No definidos' },
            { label: 'Técnicas', value: plan.testTechniques.join(' · ') || 'No definidas' },
            { label: 'Métricas objetivo', value: emptyText(plan.qualityMetrics, 'No definidas.') },
          ],
        },
      ],
    },
    {
      id: 'ieee-9',
      number: '9',
      title: 'Criterios de Aceptación / Fallo del Ítem',
      blocks: [
        { type: 'subheading', text: 'Criterios de Entrada' },
        plan.entryCriteria.length > 0
          ? { type: 'list', items: plan.entryCriteria }
          : { type: 'paragraph', text: 'Sin criterios de entrada.' },
        { type: 'subheading', text: 'Criterios de Aceptación / Salida' },
        plan.exitCriteria.length > 0
          ? { type: 'list', items: plan.exitCriteria }
          : { type: 'paragraph', text: 'Sin criterios de aceptación definidos.' },
      ],
    },
    {
      id: 'ieee-10',
      number: '10',
      title: 'Criterios de Suspensión y Requisitos de Reanudación',
      blocks: [
        { type: 'subheading', text: 'Criterios de Suspensión' },
        plan.suspensionCriteria.length > 0
          ? { type: 'list', items: plan.suspensionCriteria }
          : { type: 'paragraph', text: 'Sin criterios de suspensión.' },
        { type: 'subheading', text: 'Requisitos de Reanudación' },
        plan.resumptionRequirements.length > 0
          ? { type: 'list', items: plan.resumptionRequirements }
          : { type: 'paragraph', text: 'Sin requisitos de reanudación.' },
      ],
    },
    {
      id: 'ieee-11',
      number: '11',
      title: 'Entregables de Prueba',
      blocks: [
        plan.deliverables.length > 0
          ? { type: 'list', items: plan.deliverables }
          : { type: 'paragraph', text: 'No se declararon entregables.' },
      ],
    },
    {
      id: 'ieee-12',
      number: '12',
      title: 'Tareas de Prueba Restantes',
      blocks: [
        {
          type: 'paragraph',
          text: emptyText(plan.remainingTasks, 'Sin tareas pendientes registradas.'),
        },
      ],
    },
    {
      id: 'ieee-13',
      number: '13',
      title: 'Necesidades del Entorno',
      blocks: [
        plan.environments.length > 0
          ? {
              type: 'table',
              headers: ['Entorno', 'Configuración', 'Herramientas', 'Disponibilidad'],
              rows: plan.environments.map((env) => [
                env.name || 'Sin nombre',
                env.configuration || '—',
                env.tools || '—',
                env.availability || '—',
              ]),
            }
          : { type: 'paragraph', text: 'No se especificaron entornos.' },
        { type: 'subheading', text: 'Datos de Prueba' },
        { type: 'paragraph', text: emptyText(plan.testDataRequirements) },
      ],
    },
    {
      id: 'ieee-14',
      number: '14',
      title: 'Necesidades de Personal y Capacitación',
      blocks: [
        plan.staffing.length > 0
          ? {
              type: 'table',
              headers: ['Rol', 'Cantidad', 'Necesidades de Capacitación'],
              rows: plan.staffing.map((s) => [
                s.role || 'Sin especificar',
                String(s.quantity),
                s.trainingNeeds || 'Ninguna',
              ]),
              numericColumns: [1],
            }
          : { type: 'paragraph', text: 'No se definieron roles ni necesidades de capacitación.' },
      ],
    },
    {
      id: 'ieee-15',
      number: '15',
      title: 'Responsabilidades',
      blocks: [
        plan.staffing.length > 0
          ? {
              type: 'list',
              items: plan.staffing.map(
                (s) => `${s.role || 'Rol'} (×${s.quantity}): ${s.responsibilities || 'Por definir'}`
              ),
            }
          : { type: 'paragraph', text: 'No se asignaron responsabilidades.' },
      ],
    },
    {
      id: 'ieee-16',
      number: '16',
      title: 'Cronograma',
      blocks: [
        plan.schedule.length > 0
          ? {
              type: 'table',
              headers: ['Fase', 'Inicio', 'Fin', 'Entregable'],
              rows: plan.schedule.map((m) => [
                m.phase || 'Sin fase',
                m.startDate || '—',
                m.endDate || '—',
                m.deliverable || '—',
              ]),
              numericColumns: [1, 2],
            }
          : { type: 'paragraph', text: 'No se definieron fechas ni hitos.' },
      ],
    },
    {
      id: 'ieee-17',
      number: '17',
      title: 'Riesgos de Planificación y Contingencias',
      blocks: [
        projectRisks.length > 0
          ? {
              type: 'table',
              headers: ['Código', 'Riesgo de Proyecto', 'Exposición', 'Mitigación', 'Contingencia'],
              rows: projectRisks.map((r) => {
                const score = getRiskScore(r.probability, r.impact);
                return [
                  r.code,
                  r.title,
                  `${score} — ${getRiskSeverity(score)}`,
                  r.mitigation || '—',
                  r.contingency || '—',
                ];
              }),
              numericColumns: [2],
            }
          : { type: 'paragraph', text: 'No se registraron riesgos de planificación (categoría Proyecto).' },
        ...(productRisks.length > 0
          ? [
              { type: 'subheading', text: 'Planes de Contingencia (Riesgos de Software)' } as DocumentBlock,
              {
                type: 'list',
                items: productRisks.map(
                  (r) => `${r.code} — ${r.title}: ${emptyText(r.contingency, 'Sin contingencia.')}`
                ),
              } as DocumentBlock,
            ]
          : []),
      ],
    },
    {
      id: 'ieee-18',
      number: '18',
      title: 'Aprobaciones',
      blocks: [
        {
          type: 'table',
          headers: ['Rol', 'Nombre', 'Estado', 'Fecha'],
          rows: [
            ['Autor del Plan', plan.author || 'Pendiente', plan.status, plan.date || '—'],
            ['Aprobador', plan.approver || 'Pendiente', 'Firma pendiente', '—'],
          ],
          numericColumns: [3],
        },
      ],
    },
  ];
}

export function buildStructuredDocument(plan: TestPlanData): StructuredDocument {
  const isIso = plan.standard === 'ISO_29119';
  return {
    standardLabel: isIso ? 'ISO/IEC/IEEE 29119-3' : 'IEEE 829-2008',
    standardShort: isIso ? 'ISO 29119-3' : 'IEEE 829',
    documentId: plan.documentId || 'TP-SIN-ID',
    title: plan.title || 'Plan de Pruebas de Software (Sin título)',
    projectName: plan.projectName || 'Proyecto sin especificar',
    version: plan.version || '1.0',
    status: plan.status,
    author: plan.author || 'Sin autor asignado',
    approver: plan.approver || 'Pendiente de asignación',
    date: plan.date || '—',
    sections: isIso ? buildIso29119Sections(plan) : buildIeee829Sections(plan),
  };
}

function escapeMdCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

export function generateMarkdown(plan: TestPlanData): string {
  const doc = buildStructuredDocument(plan);
  const lines: string[] = [];

  lines.push(`# ${doc.title}`);
  lines.push('');
  lines.push(`> **Estándar normativo:** ${doc.standardLabel}  `);
  lines.push(`> **Identificador:** \`${doc.documentId}\` | **Versión:** \`${doc.version}\` | **Estado:** ${doc.status}`);
  lines.push('');
  lines.push('| Campo | Valor |');
  lines.push('| :--- | :--- |');
  lines.push(`| **Proyecto** | ${escapeMdCell(doc.projectName)} |`);
  lines.push(`| **Autor** | ${escapeMdCell(doc.author)} |`);
  lines.push(`| **Aprobador** | ${escapeMdCell(doc.approver)} |`);
  lines.push(`| **Fecha** | ${escapeMdCell(doc.date)} |`);
  lines.push(`| **Norma aplicada** | ${escapeMdCell(doc.standardLabel)} |`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const section of doc.sections) {
    lines.push(`## ${section.number}. ${section.title}`);
    lines.push('');

    for (const block of section.blocks) {
      if (block.type === 'subheading') {
        lines.push(`### ${block.text}`);
        lines.push('');
      } else if (block.type === 'paragraph') {
        lines.push(block.text);
        lines.push('');
      } else if (block.type === 'list') {
        for (const item of block.items) {
          lines.push(`- ${item}`);
        }
        lines.push('');
      } else if (block.type === 'keyValue') {
        lines.push('| Parámetro | Definición |');
        lines.push('| :--- | :--- |');
        for (const row of block.rows) {
          lines.push(`| **${escapeMdCell(row.label)}** | ${escapeMdCell(row.value)} |`);
        }
        lines.push('');
      } else if (block.type === 'table') {
        lines.push(`| ${block.headers.map(escapeMdCell).join(' | ')} |`);
        lines.push(`| ${block.headers.map(() => ':---').join(' | ')} |`);
        for (const row of block.rows) {
          lines.push(`| ${row.map(escapeMdCell).join(' | ')} |`);
        }
        lines.push('');
      }
    }
  }

  return lines.join('\n').trim() + '\n';
}

export function downloadMarkdownFile(plan: TestPlanData): string {
  const markdown = generateMarkdown(plan);
  const safeId = (plan.documentId || 'plan-de-pruebas')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const stdSuffix = plan.standard === 'ISO_29119' ? 'iso-29119-3' : 'ieee-829';
  const filename = `${safeId || 'plan-de-pruebas'}-${stdSuffix}.md`;

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  return filename;
}

export function calculatePlanCompleteness(plan: TestPlanData): Record<WizardStepId, StepCompleteness> {
  const contextChecks: Array<[boolean, string]> = [
    [plan.documentId.trim().length > 0, 'Identificador del documento'],
    [plan.title.trim().length > 0, 'Título del plan'],
    [plan.projectName.trim().length > 0, 'Nombre del proyecto'],
    [plan.author.trim().length > 0, 'Autor responsable'],
    [plan.objectives.trim().length > 0, 'Objetivos de prueba'],
  ];

  const scopeChecks: Array<[boolean, string]> = [
    [plan.testItems.length > 0, 'Al menos un ítem bajo prueba'],
    [plan.inScopeFeatures.length > 0, 'Al menos una funcionalidad en alcance'],
    [plan.outOfScopeFeatures.length > 0, 'Exclusiones documentadas'],
  ];

  const strategyChecks: Array<[boolean, string]> = [
    [plan.testLevels.length > 0, 'Niveles de prueba seleccionados'],
    [plan.testTypes.length > 0, 'Tipos de prueba seleccionados'],
    [plan.approachSummary.trim().length > 0, 'Resumen del enfoque técnico'],
    [plan.entryCriteria.length > 0, 'Criterios de entrada'],
    [plan.exitCriteria.length > 0, 'Criterios de aprobación / salida'],
  ];

  const resourcesChecks: Array<[boolean, string]> = [
    [plan.environments.length > 0, 'Entornos de prueba'],
    [plan.staffing.length > 0, 'Roles y equipo'],
    [plan.schedule.length > 0, 'Hitos del cronograma'],
    [plan.deliverables.length > 0, 'Entregables de QA'],
  ];

  const risksChecks: Array<[boolean, string]> = [
    [plan.risks.length > 0, 'Al menos un riesgo identificado'],
    [
      plan.risks.length > 0 && plan.risks.every((r) => r.mitigation.trim().length > 0),
      'Mitigación definida para todos los riesgos',
    ],
  ];

  const summarize = (stepId: WizardStepId, checks: Array<[boolean, string]>): StepCompleteness => {
    const completed = checks.filter(([ok]) => ok).length;
    const missingFields = checks.filter(([ok]) => !ok).map(([, label]) => label);
    return { stepId, completed, total: checks.length, missingFields };
  };

  const context = summarize('context', contextChecks);
  const scope = summarize('scope', scopeChecks);
  const strategy = summarize('strategy', strategyChecks);
  const resources = summarize('resources', resourcesChecks);
  const risks = summarize('risks', risksChecks);

  const totalDone =
    context.completed +
    scope.completed +
    strategy.completed +
    resources.completed +
    risks.completed;
  const totalPossible =
    context.total + scope.total + strategy.total + resources.total + risks.total;

  return {
    context,
    scope,
    strategy,
    resources,
    risks,
    review: {
      stepId: 'review',
      completed: totalDone,
      total: totalPossible,
      missingFields: [
        ...context.missingFields,
        ...scope.missingFields,
        ...strategy.missingFields,
        ...resources.missingFields,
        ...risks.missingFields,
      ],
    },
  };
}
