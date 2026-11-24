import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useMemo, useState } from 'react';
import { DocumentRenderer } from './components/DocumentRenderer';
import { LivePreviewPanel } from './components/LivePreviewPanel';
import { StandardsGuideModal } from './components/StandardsGuideModal';
import { TemplateModal } from './components/TemplateModal';
import { TopBar } from './components/TopBar';
import { WizardSidebar } from './components/WizardSidebar';
import { StepContext } from './components/steps/StepContext';
import { StepResources } from './components/steps/StepResources';
import { StepReviewExport } from './components/steps/StepReviewExport';
import { StepRisks } from './components/steps/StepRisks';
import { StepScope } from './components/steps/StepScope';
import { StepStrategy } from './components/steps/StepStrategy';
import { WIZARD_STEPS } from './data/templates';
import { useTestPlan } from './hooks/useTestPlan';
import { TestPlanStandard, WizardStepId } from './types/testPlan';
import {
  calculatePlanCompleteness,
  downloadMarkdownFile,
  generateMarkdown,
} from './utils/documentGenerator';

export default function App() {
  const { plan, lastSavedAt, updateField, setStandard, applyTemplate, resetToBlank } =
    useTestPlan();

  const [activeStep, setActiveStep] = useState<WizardStepId>('context');
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [templatesOpen, setTemplatesOpen] = useState<boolean>(false);
  const [guideOpen, setGuideOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2800);
  }, []);

  const completeness = useMemo(() => calculatePlanCompleteness(plan), [plan]);

  const currentStepIndex = WIZARD_STEPS.findIndex((s) => s.id === activeStep);
  const currentStepMeta = WIZARD_STEPS[currentStepIndex] ?? WIZARD_STEPS[0];

  const handleSelectStep = useCallback((step: WizardStepId) => {
    setActiveStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      handleSelectStep(WIZARD_STEPS[currentStepIndex - 1].id);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      handleSelectStep(WIZARD_STEPS[currentStepIndex + 1].id);
    }
  };

  const handleChangeStandard = useCallback(
    (standard: TestPlanStandard) => {
      setStandard(standard);
      showToast(
        standard === 'ISO_29119'
          ? 'Documento adaptado a ISO/IEC/IEEE 29119-3.'
          : 'Documento adaptado a IEEE 829-2008.'
      );
    },
    [setStandard, showToast]
  );

  const handleSelectTemplate = useCallback(
    (templateId: string) => {
      const applied = applyTemplate(templateId);
      if (applied) {
        setActiveStep('context');
        showToast(`Plantilla cargada: ${applied.name}.`);
      }
    },
    [applyTemplate, showToast]
  );

  const handleResetBlank = useCallback(() => {
    resetToBlank();
    setActiveStep('context');
    showToast('Se inició un plan de pruebas en blanco.');
  }, [resetToBlank, showToast]);

  const handleDownloadMarkdown = useCallback(() => {
    const filename = downloadMarkdownFile(plan);
    showToast(`Archivo descargado: ${filename}`);
  }, [plan, showToast]);

  const handleCopyMarkdown = useCallback(async () => {
    const md = generateMarkdown(plan);
    try {
      await navigator.clipboard.writeText(md);
      showToast('Markdown copiado al portapapeles.');
    } catch {
      showToast('No se pudo acceder al portapapeles en este navegador.');
    }
  }, [plan, showToast]);

  const handlePrintPdf = useCallback(() => {
    window.print();
  }, []);

  const isLivePreviewVisible = showPreview && activeStep !== 'review';

  return (
    <div id="top" className="min-h-screen bg-[#F8F9FB] text-[#0F172A] flex flex-col">
      {/* Main Interactive Workspace (hidden when printing PDF) */}
      <div className="no-print flex flex-col min-h-screen">
        <TopBar
          showPreview={showPreview}
          onTogglePreview={() => {
            if (activeStep === 'review') {
              handleSelectStep('context');
              setShowPreview(true);
            } else {
              setShowPreview((prev) => !prev);
            }
          }}
          onOpenTemplates={() => setTemplatesOpen(true)}
          onOpenGuide={() => setGuideOpen(true)}
          onResetBlank={handleResetBlank}
          onGoToExport={() => handleSelectStep('review')}
        />

        {/* Mobile Secondary Controls (non-sticky to keep mobile viewport unobstructed) */}
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 py-2 flex items-center gap-4 overflow-x-auto text-[13px] font-medium text-[#475569]">
          <button
            type="button"
            onClick={() => setTemplatesOpen(true)}
            className="whitespace-nowrap shrink-0 hover:text-[#0F172A] cursor-pointer"
          >
            Plantillas
          </button>
          <button
            type="button"
            onClick={() => setShowPreview((p) => !p)}
            className="whitespace-nowrap shrink-0 hover:text-[#0F172A] cursor-pointer"
          >
            {showPreview ? 'Ocultar vista previa' : 'Vista previa'}
          </button>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="whitespace-nowrap shrink-0 hover:text-[#0F172A] cursor-pointer"
          >
            Guía normativa
          </button>
          <button
            type="button"
            onClick={handleResetBlank}
            className="whitespace-nowrap shrink-0 hover:text-[#0F172A] cursor-pointer"
          >
            Plan en blanco
          </button>
        </div>

        {/* Workspace Shell: Left Rail + Center Form + Right Live Preview */}
        <div className="flex-1 flex flex-col lg:flex-row min-w-0">
          <WizardSidebar
            plan={plan}
            activeStep={activeStep}
            completeness={completeness}
            lastSavedAt={lastSavedAt}
            onSelectStep={handleSelectStep}
            onChangeStandard={handleChangeStandard}
          />

          <div className="flex-1 flex flex-col xl:flex-row min-w-0">
            <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-8">
              <div className={activeStep === 'review' ? 'max-w-4xl mx-auto' : 'max-w-3xl mx-auto'}>
                {/* Editorial Step Heading */}
                <header className="pb-6 mb-7 border-b border-[#E2E8F0]">
                  <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[#64748B] font-mono tabular-nums">
                    <span>Paso {currentStepMeta.number} de 06</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {plan.standard === 'ISO_29119'
                        ? `ISO/IEC/IEEE 29119-3 (${currentStepMeta.isoClause})`
                        : `IEEE 829-2008 (${currentStepMeta.ieeeClause})`}
                    </span>
                  </div>
                  <h1 className="mt-2 text-2xl sm:text-[28px] font-bold tracking-tight text-[#0F172A]">
                    {currentStepMeta.number}. {currentStepMeta.label}
                  </h1>
                  <p className="mt-1.5 text-[14.5px] text-[#475569] leading-relaxed">
                    {currentStepMeta.subtitle}
                  </p>
                </header>

                {/* Active Step Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {activeStep === 'context' && (
                      <StepContext
                        plan={plan}
                        onUpdateField={updateField}
                        onChangeStandard={handleChangeStandard}
                        onOpenTemplates={() => setTemplatesOpen(true)}
                      />
                    )}
                    {activeStep === 'scope' && (
                      <StepScope plan={plan} onUpdateField={updateField} />
                    )}
                    {activeStep === 'strategy' && (
                      <StepStrategy plan={plan} onUpdateField={updateField} />
                    )}
                    {activeStep === 'resources' && (
                      <StepResources plan={plan} onUpdateField={updateField} />
                    )}
                    {activeStep === 'risks' && (
                      <StepRisks plan={plan} onUpdateField={updateField} />
                    )}
                    {activeStep === 'review' && (
                      <StepReviewExport
                        plan={plan}
                        completeness={completeness}
                        onChangeStandard={handleChangeStandard}
                        onJumpToStep={handleSelectStep}
                        onDownloadMarkdown={handleDownloadMarkdown}
                        onPrintPdf={handlePrintPdf}
                        onCopyMarkdown={handleCopyMarkdown}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Step Footer Navigation */}
                <footer className="mt-10 pt-6 border-t border-[#E2E8F0] flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={currentStepIndex === 0}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-[13.5px] font-medium rounded-md border transition-colors whitespace-nowrap ${
                      currentStepIndex === 0
                        ? 'border-[#E2E8F0] text-[#94A3B8] bg-transparent cursor-not-allowed'
                        : 'border-[#CBD5E1] text-[#0F172A] bg-white hover:bg-[#F8FAFC] cursor-pointer'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Anterior
                  </button>

                  <span className="hidden sm:inline font-mono text-[12px] text-[#64748B] tabular-nums">
                    {currentStepIndex + 1} / {WIZARD_STEPS.length}
                  </span>

                  {currentStepIndex < WIZARD_STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-2 px-4 py-2 text-[13.5px] font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-md transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Siguiente
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleDownloadMarkdown}
                      className="inline-flex items-center gap-2 px-4 py-2 text-[13.5px] font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-md transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Descargar .md
                    </button>
                  )}
                </footer>
              </div>
            </main>

            {isLivePreviewVisible && (
              <LivePreviewPanel
                plan={plan}
                onClose={() => setShowPreview(false)}
                onDownloadMarkdown={handleDownloadMarkdown}
                onPrintPdf={handlePrintPdf}
                onCopyMarkdown={handleCopyMarkdown}
              />
            )}
          </div>
        </div>
      </div>

      {/* Dedicated Editorial Print Layer (Used exclusively during PDF Export / window.print) */}
      <div className="print-only-document">
        <DocumentRenderer plan={plan} />
      </div>

      {/* Modals */}
      <TemplateModal
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
      <StandardsGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />

      {/* Subtle Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="no-print fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-[#0F172A] text-white text-[13px] font-medium rounded-md shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-[#60A5FA] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
