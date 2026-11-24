import { Check } from 'lucide-react';
import { WIZARD_STEPS } from '../data/templates';
import { TestPlanData, TestPlanStandard, WizardStepId } from '../types/testPlan';
import { StepCompleteness } from '../utils/documentGenerator';

interface WizardSidebarProps {
  plan: TestPlanData;
  activeStep: WizardStepId;
  completeness: Record<WizardStepId, StepCompleteness>;
  lastSavedAt: string;
  onSelectStep: (step: WizardStepId) => void;
  onChangeStandard: (standard: TestPlanStandard) => void;
}

export function WizardSidebar({
  plan,
  activeStep,
  completeness,
  lastSavedAt,
  onSelectStep,
  onChangeStandard,
}: WizardSidebarProps) {
  const overall = completeness.review;
  const overallPercent =
    overall.total > 0 ? Math.round((overall.completed / overall.total) * 100) : 0;

  return (
    <aside className="no-print w-full lg:w-[264px] shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-[#E2E8F0] flex flex-col">
      {/* Standard Switcher */}
      <div className="p-4 border-b border-[#E2E8F0]">
        <p className="text-[12px] font-medium text-[#64748B] mb-2">Estándar de salida</p>
        <div
          role="radiogroup"
          aria-label="Seleccionar estándar normativo"
          className="grid grid-cols-2 gap-1 p-1 bg-[#F1F5F9] rounded-md"
        >
          <button
            type="button"
            role="radio"
            aria-checked={plan.standard === 'ISO_29119'}
            onClick={() => onChangeStandard('ISO_29119')}
            className={`px-2.5 py-1.5 text-[12px] font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              plan.standard === 'ISO_29119'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            ISO 29119-3
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={plan.standard === 'IEEE_829'}
            onClick={() => onChangeStandard('IEEE_829')}
            className={`px-2.5 py-1.5 text-[12px] font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              plan.standard === 'IEEE_829'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            IEEE 829
          </button>
        </div>
      </div>

      {/* Numbered Steps Rail */}
      <nav aria-label="Pasos del asistente" className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
        {WIZARD_STEPS.map((step) => {
          const isActive = activeStep === step.id;
          const stats = completeness[step.id];
          const isDone = step.id !== 'review' && stats.completed === stats.total;
          const clause = plan.standard === 'ISO_29119' ? step.isoClause : step.ieeeClause;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep(step.id)}
              aria-current={isActive ? 'step' : undefined}
              className={`group flex items-start justify-between gap-2.5 px-3 py-2.5 rounded-md text-left transition-colors shrink-0 lg:shrink cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D4ED8] ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#0F172A]'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[12px] tabular-nums ${
                      isActive ? 'text-[#1D4ED8] font-semibold' : 'text-[#64748B]'
                    }`}
                  >
                    {step.number}.
                  </span>
                  <span
                    className={`text-[13.5px] truncate ${
                      isActive ? 'font-semibold text-[#0F172A]' : 'font-medium'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                <p className="hidden lg:block pl-7 mt-0.5 text-[11.5px] text-[#64748B] truncate">
                  {clause}
                </p>
              </div>

              {step.id !== 'review' && (
                <span className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums text-[#64748B]">
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 text-[#15803D]" aria-label="Paso completo" />
                  ) : (
                    `${stats.completed}/${stats.total}`
                  )}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quiet Plan Progress Summary */}
      <div className="hidden lg:block mt-auto p-4 border-t border-[#E2E8F0] space-y-2.5 text-[12px]">
        <div className="flex items-center justify-between text-[#475569]">
          <span>Completitud del plan</span>
          <span className="font-mono font-medium text-[#0F172A] tabular-nums">
            {overallPercent}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1D4ED8] transition-[width] duration-200"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <div className="pt-1 text-[11.5px] text-[#64748B] font-mono tabular-nums truncate">
          {plan.documentId || 'Sin ID'} · {plan.risks.length} riesgos · Guardado {lastSavedAt}
        </div>
      </div>
    </aside>
  );
}
