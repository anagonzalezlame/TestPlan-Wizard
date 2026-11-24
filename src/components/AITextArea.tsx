import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { AIFieldKey, generateFieldDraft } from '../services/aiService';
import { TestPlanData } from '../types/testPlan';

interface AITextAreaProps {
  id: string;
  label: string;
  description?: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  rows?: number;
  fieldKey: AIFieldKey;
  planContext: TestPlanData;
  extraContext?: string;
  compact?: boolean;
}

export function AITextArea({
  id,
  label,
  description,
  value,
  onChange,
  placeholder,
  rows = 3,
  fieldKey,
  planContext,
  extraContext,
  compact = false,
}: AITextAreaProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const draft = await generateFieldDraft({
        fieldKey,
        fieldLabel: label,
        currentValue: value,
        planContext,
        extraContext,
      });
      onChange(draft);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'No se pudo generar el texto con IA.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <label
            htmlFor={id}
            className={`block font-medium ${
              compact ? 'text-[12px] text-[#64748B]' : 'text-[13px] text-[#334155]'
            }`}
          >
            {label}
          </label>
          {description && (
            <p className="text-[12.5px] text-[#64748B] mt-0.5">{description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
            compact ? 'px-2.5 py-1 text-[11.5px]' : 'px-3 py-1.5 text-[12px]'
          } ${
            isGenerating
              ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8] cursor-wait'
              : 'bg-white border-[#CBD5E1] text-[#1E3A8A] hover:bg-[#EFF6FF] hover:border-[#93C5FD] cursor-pointer'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              <span>Generando...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Redactar con IA</span>
            </>
          )}
        </button>
      </div>

      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (errorMessage) setErrorMessage(null);
        }}
        placeholder={placeholder}
        aria-busy={isGenerating}
        className={`w-full bg-white border rounded-md text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15 transition-colors ${
          compact ? 'px-2.5 py-1.5 text-[13px]' : 'px-3 py-2 text-[14px]'
        } ${
          isGenerating
            ? 'border-[#93C5FD] bg-[#F8FAFC]'
            : errorMessage
              ? 'border-[#FCA5A5]'
              : 'border-[#CBD5E1]'
        }`}
      />

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-1.5 text-[12px] text-[#B91C1C]"
        >
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
