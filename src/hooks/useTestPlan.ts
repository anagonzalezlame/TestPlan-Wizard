import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_TEST_PLAN, TEMPLATE_PRESETS } from '../data/templates';
import { TestPlanData, TestPlanStandard } from '../types/testPlan';

const STORAGE_KEY = 'specplan_qa_draft_v1';

function loadInitialPlan(): TestPlanData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TEST_PLAN;
    const parsed = JSON.parse(raw) as Partial<TestPlanData>;
    if (!parsed || typeof parsed !== 'object') return DEFAULT_TEST_PLAN;
    return {
      ...DEFAULT_TEST_PLAN,
      ...parsed,
      references: Array.isArray(parsed.references) ? parsed.references : DEFAULT_TEST_PLAN.references,
      testItems: Array.isArray(parsed.testItems) ? parsed.testItems : DEFAULT_TEST_PLAN.testItems,
      inScopeFeatures: Array.isArray(parsed.inScopeFeatures)
        ? parsed.inScopeFeatures
        : DEFAULT_TEST_PLAN.inScopeFeatures,
      outOfScopeFeatures: Array.isArray(parsed.outOfScopeFeatures)
        ? parsed.outOfScopeFeatures
        : DEFAULT_TEST_PLAN.outOfScopeFeatures,
      testLevels: Array.isArray(parsed.testLevels) ? parsed.testLevels : DEFAULT_TEST_PLAN.testLevels,
      testTypes: Array.isArray(parsed.testTypes) ? parsed.testTypes : DEFAULT_TEST_PLAN.testTypes,
      testTechniques: Array.isArray(parsed.testTechniques)
        ? parsed.testTechniques
        : DEFAULT_TEST_PLAN.testTechniques,
      entryCriteria: Array.isArray(parsed.entryCriteria)
        ? parsed.entryCriteria
        : DEFAULT_TEST_PLAN.entryCriteria,
      exitCriteria: Array.isArray(parsed.exitCriteria)
        ? parsed.exitCriteria
        : DEFAULT_TEST_PLAN.exitCriteria,
      suspensionCriteria: Array.isArray(parsed.suspensionCriteria)
        ? parsed.suspensionCriteria
        : DEFAULT_TEST_PLAN.suspensionCriteria,
      resumptionRequirements: Array.isArray(parsed.resumptionRequirements)
        ? parsed.resumptionRequirements
        : DEFAULT_TEST_PLAN.resumptionRequirements,
      environments: Array.isArray(parsed.environments)
        ? parsed.environments
        : DEFAULT_TEST_PLAN.environments,
      staffing: Array.isArray(parsed.staffing) ? parsed.staffing : DEFAULT_TEST_PLAN.staffing,
      schedule: Array.isArray(parsed.schedule) ? parsed.schedule : DEFAULT_TEST_PLAN.schedule,
      deliverables: Array.isArray(parsed.deliverables)
        ? parsed.deliverables
        : DEFAULT_TEST_PLAN.deliverables,
      risks: Array.isArray(parsed.risks) ? parsed.risks : DEFAULT_TEST_PLAN.risks,
    };
  } catch {
    return DEFAULT_TEST_PLAN;
  }
}

export function useTestPlan() {
  const [plan, setPlan] = useState<TestPlanData>(loadInitialPlan);
  const [lastSavedAt, setLastSavedAt] = useState<string>(() =>
    new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      setLastSavedAt(
        new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
      );
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [plan]);

  const updateField = useCallback(
    <K extends keyof TestPlanData>(field: K, value: TestPlanData[K]) => {
      setPlan((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const setStandard = useCallback((standard: TestPlanStandard) => {
    setPlan((prev) => ({
      ...prev,
      standard,
    }));
  }, []);

  const applyTemplate = useCallback((templateId: string) => {
    const preset = TEMPLATE_PRESETS.find((t) => t.id === templateId);
    if (!preset) return null;
    const cloned = JSON.parse(JSON.stringify(preset.data)) as TestPlanData;
    setPlan(cloned);
    return preset;
  }, []);

  const resetToBlank = useCallback(() => {
    const blank = TEMPLATE_PRESETS.find((t) => t.id === 'blank');
    if (blank) {
      setPlan(JSON.parse(JSON.stringify(blank.data)) as TestPlanData);
    }
  }, []);

  return {
    plan,
    lastSavedAt,
    updateField,
    setStandard,
    applyTemplate,
    resetToBlank,
  };
}
