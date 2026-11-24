interface TopBarProps {
  showPreview: boolean;
  onTogglePreview: () => void;
  onOpenTemplates: () => void;
  onOpenGuide: () => void;
  onResetBlank: () => void;
  onGoToExport: () => void;
}

export function TopBar({
  showPreview,
  onTogglePreview,
  onOpenTemplates,
  onOpenGuide,
  onResetBlank,
  onGoToExport,
}: TopBarProps) {
  return (
    <header className="no-print sticky top-0 z-30 h-14 bg-white border-b border-[#E2E8F0] px-4 lg:px-6 flex items-center justify-between gap-8">
      {/* Zone 1: Single-line Brand Wordmark */}
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="font-display text-[17px] font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0"
      >
        SpecPlan QA
      </a>

      {/* Zone 2: Concise Single-Line Navigation Links */}
      <nav
        aria-label="Herramientas del documento"
        className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-[#475569]"
      >
        <button
          type="button"
          onClick={onOpenTemplates}
          className="py-1 hover:text-[#0F172A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Plantillas
        </button>
        <button
          type="button"
          onClick={onTogglePreview}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:underline underline-offset-4 ${
            showPreview ? 'text-[#1D4ED8] font-semibold' : 'hover:text-[#0F172A]'
          }`}
        >
          {showPreview ? 'Ocultar vista previa' : 'Vista previa'}
        </button>
        <button
          type="button"
          onClick={onOpenGuide}
          className="py-1 hover:text-[#0F172A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Guía normativa
        </button>
        <button
          type="button"
          onClick={onResetBlank}
          className="py-1 hover:text-[#0F172A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Plan en blanco
        </button>
      </nav>

      {/* Zone 3: Single Primary Action */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onGoToExport}
          className="px-4 py-2 text-[13px] font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          Exportar plan
        </button>
      </div>
    </header>
  );
}
