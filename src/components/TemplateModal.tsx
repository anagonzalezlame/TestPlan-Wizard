import { X } from 'lucide-react';
import { useEffect } from 'react';
import { TEMPLATE_PRESETS } from '../data/templates';

interface TemplateModalProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateModal({ open, onClose, onSelectTemplate }: TemplateModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-modal-title"
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
          <div>
            <h2 id="template-modal-title" className="text-[17px] font-semibold text-[#0F172A]">
              Plantillas de Plan de Pruebas
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Seleccioná una base realista para acelerar la carga. Reemplazará el borrador actual.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar selector de plantillas"
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[75vh] overflow-y-auto">
          {TEMPLATE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                onSelectTemplate(preset.id);
                onClose();
              }}
              className="p-4 text-left bg-white border border-[#E2E8F0] hover:border-[#1D4ED8] hover:bg-[#EFF6FF]/35 rounded-md transition-colors flex flex-col justify-between gap-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D4ED8]"
            >
              <div>
                <p className="text-[12px] text-[#64748B]">{preset.domain}</p>
                <h3 className="mt-1 text-[15px] font-semibold text-[#0F172A]">{preset.name}</h3>
                <p className="mt-1.5 text-[13px] text-[#475569] leading-relaxed">
                  {preset.description}
                </p>
              </div>
              <p className="pt-2.5 border-t border-[#E2E8F0] text-[12px] font-mono text-[#1D4ED8]">
                {preset.highlights}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
