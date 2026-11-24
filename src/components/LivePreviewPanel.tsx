import { Check, Copy, Download, FileCode2, FileText, Printer, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { TestPlanData } from '../types/testPlan';
import { generateMarkdown } from '../utils/documentGenerator';
import { DocumentRenderer } from './DocumentRenderer';

interface LivePreviewPanelProps {
  plan: TestPlanData;
  onClose: () => void;
  onDownloadMarkdown: () => void;
  onPrintPdf: () => void;
  onCopyMarkdown: () => Promise<void>;
}

export function LivePreviewPanel({
  plan,
  onClose,
  onDownloadMarkdown,
  onPrintPdf,
  onCopyMarkdown,
}: LivePreviewPanelProps) {
  const [mode, setMode] = useState<'rendered' | 'markdown'>('rendered');
  const [copied, setCopied] = useState(false);

  const markdown = useMemo(() => generateMarkdown(plan), [plan]);

  const handleCopy = async () => {
    await onCopyMarkdown();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <aside
      aria-label="Vista previa en vivo del documento"
      className="no-print w-full xl:w-[460px] 2xl:w-[520px] shrink-0 bg-[#F1F5F9] border-t xl:border-t-0 xl:border-l border-[#E2E8F0] flex flex-col xl:h-[calc(100vh-3.5rem)] xl:sticky xl:top-14"
    >
      {/* Preview Toolbar */}
      <div className="px-4 py-2.5 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-0.5 bg-[#F1F5F9] rounded-md">
          <button
            type="button"
            onClick={() => setMode('rendered')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded transition-colors cursor-pointer ${
              mode === 'rendered'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Vista previa
          </button>
          <button
            type="button"
            onClick={() => setMode('markdown')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded transition-colors cursor-pointer ${
              mode === 'markdown'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            .md
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            title="Copiar Markdown"
            aria-label="Copiar Markdown"
            className="p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#15803D]" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onDownloadMarkdown}
            title="Descargar archivo .md"
            aria-label="Descargar archivo .md"
            className="p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onPrintPdf}
            title="Exportar a PDF"
            aria-label="Exportar a PDF"
            className="p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Ocultar panel de vista previa"
            aria-label="Ocultar vista previa"
            className="p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Document Sheet */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="border border-[#E2E8F0] rounded-md bg-white overflow-hidden">
          {mode === 'rendered' ? (
            <DocumentRenderer plan={plan} compact />
          ) : (
            <pre className="p-4 text-[12px] leading-relaxed font-mono text-[#1E293B] whitespace-pre-wrap break-words">
              {markdown}
            </pre>
          )}
        </div>
      </div>
    </aside>
  );
}
