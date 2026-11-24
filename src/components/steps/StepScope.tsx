import { AlertCircle, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { suggestScopeFeatures } from '../../services/aiService';
import {
  ExcludedFeature,
  PriorityLevel,
  ScopeFeature,
  TestItem,
  TestPlanData,
} from '../../types/testPlan';
import { AITextArea } from '../AITextArea';

interface StepScopeProps {
  plan: TestPlanData;
  onUpdateField: <K extends keyof TestPlanData>(field: K, value: TestPlanData[K]) => void;
}

const CELL_INPUT =
  'w-full px-2.5 py-1.5 text-[13px] bg-white border border-[#CBD5E1] rounded text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15';

export function StepScope({ plan, onUpdateField }: StepScopeProps) {
  const [isSuggestingScope, setIsSuggestingScope] = useState(false);
  const [scopeError, setScopeError] = useState<string | null>(null);

  const handleSuggestScope = async () => {
    if (isSuggestingScope) return;
    setIsSuggestingScope(true);
    setScopeError(null);
    try {
      const suggestions = await suggestScopeFeatures(plan);
      const created: ScopeFeature[] = suggestions
        .filter((s) => s.name.length > 0)
        .map((s, idx) => ({
          id: `sf-ai-${Date.now()}-${idx}`,
          name: s.name,
          module: s.module,
          priority: s.priority,
          testLevel: s.testLevel,
        }));
      if (created.length > 0) {
        onUpdateField('inScopeFeatures', [...plan.inScopeFeatures, ...created]);
      }
    } catch (err) {
      setScopeError(
        err instanceof Error ? err.message : 'No se pudieron sugerir funcionalidades con IA.'
      );
    } finally {
      setIsSuggestingScope(false);
    }
  };

  // Test Items CRUD
  const addTestItem = () => {
    const next: TestItem = {
      id: `ti-${Date.now()}`,
      name: '',
      version: 'v1.0.0',
      type: 'Servicio / Módulo',
      reference: '',
    };
    onUpdateField('testItems', [...plan.testItems, next]);
  };

  const updateTestItem = (id: string, patch: Partial<TestItem>) => {
    onUpdateField(
      'testItems',
      plan.testItems.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeTestItem = (id: string) => {
    onUpdateField(
      'testItems',
      plan.testItems.filter((item) => item.id !== id)
    );
  };

  // In-Scope Features CRUD
  const addInScopeFeature = () => {
    const next: ScopeFeature = {
      id: `sf-${Date.now()}`,
      name: '',
      module: '',
      priority: 'Alta',
      testLevel: 'Sistema',
    };
    onUpdateField('inScopeFeatures', [...plan.inScopeFeatures, next]);
  };

  const updateInScopeFeature = (id: string, patch: Partial<ScopeFeature>) => {
    onUpdateField(
      'inScopeFeatures',
      plan.inScopeFeatures.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeInScopeFeature = (id: string) => {
    onUpdateField(
      'inScopeFeatures',
      plan.inScopeFeatures.filter((item) => item.id !== id)
    );
  };

  // Out-of-Scope Features CRUD
  const addOutOfScope = () => {
    const next: ExcludedFeature = {
      id: `osf-${Date.now()}`,
      name: '',
      reason: '',
    };
    onUpdateField('outOfScopeFeatures', [...plan.outOfScopeFeatures, next]);
  };

  const updateOutOfScope = (id: string, patch: Partial<ExcludedFeature>) => {
    onUpdateField(
      'outOfScopeFeatures',
      plan.outOfScopeFeatures.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeOutOfScope = (id: string) => {
    onUpdateField(
      'outOfScopeFeatures',
      plan.outOfScopeFeatures.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="space-y-8">
      {/* Test Items */}
      <section className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[15px] font-semibold text-[#0F172A]">
              Elementos bajo prueba (Test Items)
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Aplicaciones, microservicios, APIs o compilaciones exactas que serán evaluadas.
            </p>
          </div>
          <button
            type="button"
            onClick={addTestItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar ítem
          </button>
        </div>

        {plan.testItems.length === 0 ? (
          <div className="p-5 border border-dashed border-[#CBD5E1] rounded-md text-center space-y-2">
            <p className="text-[13px] text-[#64748B]">
              No hay elementos bajo prueba declarados todavía.
            </p>
            <button
              type="button"
              onClick={addTestItem}
              className="text-[13px] font-medium text-[#1D4ED8] hover:underline cursor-pointer"
            >
              + Agregar primer ítem de prueba
            </button>
          </div>
        ) : (
          <div className="border border-[#E2E8F0] rounded-md bg-white divide-y divide-[#E2E8F0]">
            {plan.testItems.map((item) => (
              <div
                key={item.id}
                className="p-3 grid grid-cols-1 sm:grid-cols-[1.5fr_0.8fr_1fr_1.1fr_auto] gap-2.5 items-center"
              >
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateTestItem(item.id, { name: e.target.value })}
                  placeholder="Nombre del componente"
                  aria-label="Nombre del componente"
                  className={CELL_INPUT}
                />
                <input
                  type="text"
                  value={item.version}
                  onChange={(e) => updateTestItem(item.id, { version: e.target.value })}
                  placeholder="Versión"
                  aria-label="Versión"
                  className={`${CELL_INPUT} font-mono tabular-nums`}
                />
                <input
                  type="text"
                  value={item.type}
                  onChange={(e) => updateTestItem(item.id, { type: e.target.value })}
                  placeholder="Tipo (Web, API, App)"
                  aria-label="Tipo"
                  className={CELL_INPUT}
                />
                <input
                  type="text"
                  value={item.reference}
                  onChange={(e) => updateTestItem(item.id, { reference: e.target.value })}
                  placeholder="Repo / Spec"
                  aria-label="Referencia"
                  className={`${CELL_INPUT} font-mono`}
                />
                <button
                  type="button"
                  onClick={() => removeTestItem(item.id)}
                  aria-label="Eliminar ítem"
                  className="p-1.5 text-[#64748B] hover:text-[#B91C1C] transition-colors cursor-pointer justify-self-end"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* In-Scope Features */}
      <section className="space-y-3 pt-6 border-t border-[#E2E8F0]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-[#0F172A]">Funcionalidades en alcance</h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Características, flujos críticos o requisitos que sí serán validados durante el ciclo.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSuggestScope}
              disabled={isSuggestingScope}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium rounded-md border transition-colors whitespace-nowrap ${
                isSuggestingScope
                  ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8] cursor-wait'
                  : 'bg-white border-[#CBD5E1] text-[#1E3A8A] hover:bg-[#EFF6FF] hover:border-[#93C5FD] cursor-pointer'
              }`}
            >
              {isSuggestingScope ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Redactar con IA</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={addInScopeFeature}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar funcionalidad
            </button>
          </div>
        </div>

        {scopeError && (
          <div role="alert" className="flex items-start gap-1.5 text-[12px] text-[#B91C1C]">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>{scopeError}</span>
          </div>
        )}

        {plan.inScopeFeatures.length === 0 ? (
          <div className="p-5 border border-dashed border-[#CBD5E1] rounded-md text-center space-y-2">
            <p className="text-[13px] text-[#64748B]">
              Definí qué funcionalidades forman parte de la cobertura de este plan.
            </p>
            <button
              type="button"
              onClick={addInScopeFeature}
              className="text-[13px] font-medium text-[#1D4ED8] hover:underline cursor-pointer"
            >
              + Agregar primera funcionalidad
            </button>
          </div>
        ) : (
          <div className="border border-[#E2E8F0] rounded-md bg-white divide-y divide-[#E2E8F0]">
            {plan.inScopeFeatures.map((feature) => (
              <div
                key={feature.id}
                className="p-3 grid grid-cols-1 sm:grid-cols-[2fr_1fr_0.75fr_1fr_auto] gap-2.5 items-center"
              >
                <input
                  type="text"
                  value={feature.name}
                  onChange={(e) => updateInScopeFeature(feature.id, { name: e.target.value })}
                  placeholder="Descripción de la funcionalidad"
                  aria-label="Funcionalidad"
                  className={CELL_INPUT}
                />
                <input
                  type="text"
                  value={feature.module}
                  onChange={(e) => updateInScopeFeature(feature.id, { module: e.target.value })}
                  placeholder="Módulo"
                  aria-label="Módulo"
                  className={CELL_INPUT}
                />
                <select
                  value={feature.priority}
                  onChange={(e) =>
                    updateInScopeFeature(feature.id, { priority: e.target.value as PriorityLevel })
                  }
                  aria-label="Prioridad"
                  className={CELL_INPUT}
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
                <input
                  type="text"
                  value={feature.testLevel}
                  onChange={(e) => updateInScopeFeature(feature.id, { testLevel: e.target.value })}
                  placeholder="Nivel (ej. E2E)"
                  aria-label="Nivel de prueba"
                  className={CELL_INPUT}
                />
                <button
                  type="button"
                  onClick={() => removeInScopeFeature(feature.id)}
                  aria-label="Eliminar funcionalidad"
                  className="p-1.5 text-[#64748B] hover:text-[#B91C1C] transition-colors cursor-pointer justify-self-end"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Out of Scope */}
      <section className="space-y-3 pt-6 border-t border-[#E2E8F0]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[15px] font-semibold text-[#0F172A]">
              Exclusiones (Fuera de alcance)
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Documentar lo que NO se prueba y su justificación evita ambigüedades contractuales o de release.
            </p>
          </div>
          <button
            type="button"
            onClick={addOutOfScope}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar exclusión
          </button>
        </div>

        {plan.outOfScopeFeatures.length === 0 ? (
          <div className="p-5 border border-dashed border-[#CBD5E1] rounded-md text-center space-y-2">
            <p className="text-[13px] text-[#64748B]">
              Sin exclusiones declaradas. Agregá los módulos o escenarios que quedan fuera de este ciclo.
            </p>
            <button
              type="button"
              onClick={addOutOfScope}
              className="text-[13px] font-medium text-[#1D4ED8] hover:underline cursor-pointer"
            >
              + Registrar exclusión
            </button>
          </div>
        ) : (
          <div className="border border-[#E2E8F0] rounded-md bg-white divide-y divide-[#E2E8F0]">
            {plan.outOfScopeFeatures.map((item) => (
              <div
                key={item.id}
                className="p-3 grid grid-cols-1 sm:grid-cols-[1.2fr_1.8fr_auto] gap-2.5 items-center"
              >
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateOutOfScope(item.id, { name: e.target.value })}
                  placeholder="Funcionalidad o componente excluido"
                  aria-label="Elemento excluido"
                  className={CELL_INPUT}
                />
                <input
                  type="text"
                  value={item.reason}
                  onChange={(e) => updateOutOfScope(item.id, { reason: e.target.value })}
                  placeholder="Justificación de la exclusión"
                  aria-label="Justificación"
                  className={CELL_INPUT}
                />
                <button
                  type="button"
                  onClick={() => removeOutOfScope(item.id)}
                  aria-label="Eliminar exclusión"
                  className="p-1.5 text-[#64748B] hover:text-[#B91C1C] transition-colors cursor-pointer justify-self-end"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Constraints */}
      <section className="pt-6 border-t border-[#E2E8F0]">
        <AITextArea
          id="plan-constraints"
          label="Restricciones y supuestos del alcance"
          description="Ventanas de despliegue, límites de sandboxes externos, regulaciones de privacidad o dependencias."
          fieldKey="constraints"
          rows={3}
          value={plan.constraints}
          onChange={(val) => onUpdateField('constraints', val)}
          planContext={plan}
          placeholder="Ej. Congelamiento de código 48 h antes de producción; límite de 60 req/min en sandbox de pagos."
        />
      </section>
    </div>
  );
}
