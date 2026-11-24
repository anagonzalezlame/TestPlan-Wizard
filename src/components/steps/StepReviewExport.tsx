import { AlertCircle, Check, Copy, Download, FileCode2, FileText, Printer } from 'lucide-react';
import { useMemo, useState } from 'react';
import { WIZARD_STEPS } from '../../data/templates';
import { TestPlanData, TestPlanStandard, WizardStepId } from '../../types/testPlan';
import { StepCompleteness, generateMarkdown } from '../../utils/documentGenerator';
import { DocumentRenderer } from '../DocumentRenderer';

interface StepReviewExportProps {
  plan: TestPlanData;
  completeness: Record<WizardStepId, StepCompleteness>;
  onChangeStandard: (standard: TestPlanStandard) => void;
  onJumpToStep: (step: WizardStepId) => void;
  onDownloadMarkdown: () => void;
  onPrintPdf: () => void;
  onCopyMarkdown: () => Promise<void>;
}

export function StepReviewExport({
  plan,
  completeness,
  onChangeStandard,
  onJumpToStep,
  onDownloadMarkdown,
  onPrintPdf,
  onCopyMarkdown,
}: StepReviewExportProps) {
  const [viewMode, setViewMode] = useState<'rendered' | 'markdown'>('rendered');
  const [copied, setCopied] = useState(false);

  const markdown = useMemo(() => generateMarkdown(plan), [plan]);

  const handleCopy = async () => {
    await onCopyMarkdown();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const incompleteSteps = WIZARD_STEPS.filter(
    (s) => s.id !== 'review' && completeness[s.id].missingFields.length > 0
  );

  return (
    <div className="space-y-6">
      {/* Export Action Bar */}
      <section className="bg-white border border-[#E2E8F0] rounded-md p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#0F172A]">
              Documento listo para exportar
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5 font-mono tabular-nums">
              {plan.standard === 'ISO_29119' ? 'ISO/IEC/IEEE 29119-3 (8 cláusulas)' : 'IEEE 829-2008 (18 secciones)'}{' '}
              · {completeness.review.completed}/{completeness.review.total} controles completos
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label="Estándar de exportación"
            className="inline-flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-md self-start"
          >
            <button
              type="button"
              role="radio"
              aria-checked={plan.standard === 'ISO_29119'}
              onClick={() => onChangeStandard('ISO_29119')}
              className={`px-3 py-1.5 text-[12.5px] font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                plan.standard === 'ISO_29119'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              ISO/IEC/IEEE 29119-3
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={plan.standard === 'IEEE_829'}
              onClick={() => onChangeStandard('IEEE_829')}
              className={`px-3 py-1.5 text-[12.5px] font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                plan.standard === 'IEEE_829'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              IEEE 829-2008
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onDownloadMarkdown}
            className="inline-flex items-center gap-2 px-4 py-2 text-[13.5px] font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Descargar Markdown (.md)
          </button>

          <button
            type="button"
            onClick={onPrintPdf}
            className="inline-flex items-center gap-2 px-4 py-2 text-[13.5px] font-medium text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Exportar PDF
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 text-[13.5px] font-medium text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#15803D]" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado al portapapeles' : 'Copiar Markdown'}
          </button>
        </div>
      </section>

      {/* Optional Readiness Audit (Only shown if fields are missing) */}
      {incompleteSteps.length > 0 && (
        <section className="bg-white border border-[#E2E8F0] rounded-md p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-[13.5px] font-semibold text-[#B45309]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Campos recomendados pendientes antes de aprobar</span>
          </div>
          <ul className="divide-y divide-[#E2E8F0]">
            {incompleteSteps.map((step) => (
              <li
                key={step.id}
                className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px]"
              >
                <div className="text-[#334155]">
                  <span className="font-mono text-[#64748B] mr-1.5">{step.number}.</span>
                  <span className="font-medium text-[#0F172A]">{step.label}:</span>{' '}
                  <span className="text-[#64748B]">
                    {completeness[step.id].missingFields.join(' · ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onJumpToStep(step.id)}
                  className="text-[12.5px] font-medium text-[#1D4ED8] hover:underline whitespace-nowrap self-start sm:self-center cursor-pointer"
                >
                  Completar paso
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Full Document Inspector */}
      <section className="border border-[#E2E8F0] rounded-md bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3">
          <span className="text-[13px] font-semibold text-[#0F172A]">
            Inspección final del documento
          </span>

          <div className="flex items-center gap-1 p-0.5 bg-[#E2E8F0]/70 rounded-md">
            <button
              type="button"
              onClick={() => setViewMode('rendered')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded transition-colors cursor-pointer ${
                viewMode === 'rendered'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Documento
            </button>
            <button
              type="button"
              onClick={() => setViewMode('markdown')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded transition-colors cursor-pointer ${
                viewMode === 'markdown'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              Markdown
            </button>
          </div>
        </div>

        {viewMode === 'rendered' ? (
          <DocumentRenderer plan={plan} />
        ) : (
          <pre className="p-6 text-[12.5px] leading-relaxed font-mono text-[#1E293B] bg-[#F8FAFC] overflow-x-auto whitespace-pre-wrap">
            {markdown}
          </pre>
        )}
      </section>
    </div>
  );
}
