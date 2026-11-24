export type TestPlanStandard = 'ISO_29119' | 'IEEE_829';

export type DocumentStatus = 'Borrador' | 'En revisión' | 'Aprobado';

export type PriorityLevel = 'Alta' | 'Media' | 'Baja';

export type RiskCategory = 'Producto' | 'Proyecto';

export type RiskSeverity = 'Bajo' | 'Medio' | 'Alto' | 'Crítico';

export type WizardStepId =
  | 'context'
  | 'scope'
  | 'strategy'
  | 'resources'
  | 'risks'
  | 'review';

export interface TestItem {
  id: string;
  name: string;
  version: string;
  type: string;
  reference: string;
}

export interface ScopeFeature {
  id: string;
  name: string;
  module: string;
  priority: PriorityLevel;
  testLevel: string;
}

export interface ExcludedFeature {
  id: string;
  name: string;
  reason: string;
}

export interface EnvironmentNeed {
  id: string;
  name: string;
  configuration: string;
  tools: string;
  availability: string;
}

export interface StaffRole {
  id: string;
  role: string;
  responsibilities: string;
  quantity: number;
  trainingNeeds: string;
}

export interface ScheduleMilestone {
  id: string;
  phase: string;
  startDate: string;
  endDate: string;
  deliverable: string;
}

export interface RiskItem {
  id: string;
  code: string;
  title: string;
  category: RiskCategory;
  probability: number; // 1 (Muy baja) to 5 (Muy alta)
  impact: number; // 1 (Insignificante) to 5 (Catastrófico)
  mitigation: string;
  contingency: string;
}

export interface TestPlanData {
  standard: TestPlanStandard;
  documentId: string;
  title: string;
  projectName: string;
  version: string;
  status: DocumentStatus;
  author: string;
  approver: string;
  date: string;
  summary: string;
  objectives: string;
  testBasis: string;
  references: string[];

  testItems: TestItem[];
  inScopeFeatures: ScopeFeature[];
  outOfScopeFeatures: ExcludedFeature[];
  constraints: string;

  testLevels: string[];
  testTypes: string[];
  testTechniques: string[];
  approachSummary: string;
  entryCriteria: string[];
  exitCriteria: string[];
  suspensionCriteria: string[];
  resumptionRequirements: string[];
  qualityMetrics: string;

  environments: EnvironmentNeed[];
  testDataRequirements: string;
  staffing: StaffRole[];
  schedule: ScheduleMilestone[];
  deliverables: string[];
  remainingTasks: string;

  risks: RiskItem[];
}

export interface TemplatePreset {
  id: string;
  name: string;
  domain: string;
  description: string;
  highlights: string;
  data: TestPlanData;
}

export interface WizardStepMeta {
  id: WizardStepId;
  number: string;
  label: string;
  shortLabel: string;
  subtitle: string;
  isoClause: string;
  ieeeClause: string;
}

export function getRiskScore(probability: number, impact: number): number {
  return probability * impact;
}

export function getRiskSeverity(score: number): RiskSeverity {
  if (score >= 15) return 'Crítico';
  if (score >= 10) return 'Alto';
  if (score >= 5) return 'Medio';
  return 'Bajo';
}

export const PROBABILITY_LABELS: Record<number, string> = {
  1: 'Muy baja',
  2: 'Baja',
  3: 'Media',
  4: 'Alta',
  5: 'Muy alta',
};

export const IMPACT_LABELS: Record<number, string> = {
  1: 'Mínimo',
  2: 'Menor',
  3: 'Moderado',
  4: 'Mayor',
  5: 'Crítico',
};
