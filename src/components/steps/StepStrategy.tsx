import { Check, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  TEST_LEVEL_OPTIONS,
  TEST_TECHNIQUE_OPTIONS,
  TEST_TYPE_OPTIONS,
} from '../../data/templates';
import { TestPlanData } from '../../types/testPlan';
import { AITextArea } from '../AITextArea';

interface StepStrategyProps {
  plan: TestPlanData;
  onUpdateField: <K extends keyof TestPlanData>(field: K, value: TestPlanData[K]) => void;
}

const INPUT_CLASS =
  'w-full px-3 py-2 text-[13.5px] bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15';

interface CriteriaListEditorProps {
  title: string;
  description: string;
  placeholder: string;
  items: string[];
  onChange: (next: string[]) => void;
}

function CriteriaListEditor({
  title,
  description,
  placeholder,
  items,
  onChange,
}: CriteriaListEditorProps) {
  const [draft, setDraft] = useState('');

  const handleAdd = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft('');
  };

  return (
    <div className="space-y-2.5">
      <div>
        <h3 className="text-[14px] font-semibold text-[#0F172A]">{title}</h3>
        <p className="text-[12.5px] text-[#64748B]">{description}</p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className={INPUT_CLASS}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-medium text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-[12.5px] text-[#64748B] py-2.5 px-3 border border-dashed border-[#CBD5E1] rounded-md">
          Sin criterios cargados todavía.
        </p>
      ) : (
        <ul className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-md bg-white">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start justify-between gap-3 px-3 py-2 text-[13px] text-[#1E293B]"
            >
              <span className="leading-relaxed">{item}</span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                aria-label={`Eliminar criterio ${idx + 1}`}
                className="p-1 text-[#64748B] hover:text-[#B91C1C] transition-colors shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ToggleOptionGrid({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-[14px] font-semibold text-[#0F172A]">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              aria-pressed={isSelected}
              className={`flex items-center justify-between gap-2 px-3 py-2 text-left text-[13px] rounded-md border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#EFF6FF] border-[#1D4ED8] text-[#0F172A] font-medium'
                  : 'bg-white border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1] hover:text-[#0F172A]'
              }`}
            >
              <span className="truncate">{opt}</span>
              <span
                className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white'
                    : 'border-[#CBD5E1] bg-white'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StepStrategy({ plan, onUpdateField }: StepStrategyProps) {
  const toggleFromArray = (
    field: 'testLevels' | 'testTypes' | 'testTechniques',
    option: string
  ) => {
    const current = plan[field];
    if (current.includes(option)) {
      onUpdateField(
        field,
        current.filter((item) => item !== option)
      );
    } else {
      onUpdateField(field, [...current, option]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Levels, Types, Techniques */}
      <section className="space-y-6">
        <ToggleOptionGrid
          title="Niveles de prueba aplicables"
          options={TEST_LEVEL_OPTIONS}
          selected={plan.testLevels}
          onToggle={(opt) => toggleFromArray('testLevels', opt)}
        />

        <ToggleOptionGrid
          title="Tipos de prueba"
          options={TEST_TYPE_OPTIONS}
          selected={plan.testTypes}
          onToggle={(opt) => toggleFromArray('testTypes', opt)}
        />

        <ToggleOptionGrid
          title="Técnicas de diseño de casos"
          options={TEST_TECHNIQUE_OPTIONS}
          selected={plan.testTechniques}
          onToggle={(opt) => toggleFromArray('testTechniques', opt)}
        />
      </section>

      {/* General Approach & Quality Metrics */}
      <section className="space-y-5 pt-6 border-t border-[#E2E8F0]">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          Enfoque técnico y métricas objetivo
        </h2>

        <AITextArea
          id="approach-summary"
          label="Descripción del enfoque (Approach)"
          fieldKey="approachSummary"
          rows={3}
          value={plan.approachSummary}
          onChange={(val) => onUpdateField('approachSummary', val)}
          planContext={plan}
          placeholder="Explicá la pirámide de automatización, balance manual/exploratorio y estrategia de regresión."
        />

        <AITextArea
          id="quality-metrics"
          label="Métricas de calidad y umbrales"
          fieldKey="qualityMetrics"
          rows={2}
          value={plan.qualityMetrics}
          onChange={(val) => onUpdateField('qualityMetrics', val)}
          planContext={plan}
          placeholder="Ej. Cobertura >= 85%, tasa de aprobación >= 95%, latencia P95 < 1.5 s."
        />
      </section>

      {/* Formal Gate Criteria */}
      <section className="space-y-6 pt-6 border-t border-[#E2E8F0]">
        <div>
          <h2 className="text-[15px] font-semibold text-[#0F172A]">
            Criterios formales de control (Entry / Exit / Suspension)
          </h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Reglas objetivas exigidas tanto por ISO/IEC/IEEE 29119-3 como por las secciones 9 y 10 de IEEE 829.
          </p>
        </div>

        <CriteriaListEditor
          title="Criterios de entrada"
          description="Condiciones obligatorias antes de iniciar la ejecución de pruebas."
          placeholder="Ej. Build estable desplegado en Staging con suite unitaria en verde."
          items={plan.entryCriteria}
          onChange={(next) => onUpdateField('entryCriteria', next)}
        />

        <CriteriaListEditor
          title="Criterios de salida y aprobación (Pass / Fail)"
          description="Condiciones verificables para considerar aprobado el ciclo y autorizar liberación."
          placeholder="Ej. Cero defectos Críticos o Bloqueantes abiertos; 100% de casos Alta ejecutados."
          items={plan.exitCriteria}
          onChange={(next) => onUpdateField('exitCriteria', next)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CriteriaListEditor
            title="Criterios de suspensión"
            description="Eventos que obligan a pausar temporalmente la ejecución."
            placeholder="Ej. Caída del entorno QA > 4 horas o fallo en pruebas Smoke."
            items={plan.suspensionCriteria}
            onChange={(next) => onUpdateField('suspensionCriteria', next)}
          />

          <CriteriaListEditor
            title="Requisitos de reanudación"
            description="Evidencia necesaria para retomar las pruebas tras una suspensión."
            placeholder="Ej. Parche desplegado y suite Smoke 100% aprobada."
            items={plan.resumptionRequirements}
            onChange={(next) => onUpdateField('resumptionRequirements', next)}
          />
        </div>
      </section>
    </div>
  );
}
