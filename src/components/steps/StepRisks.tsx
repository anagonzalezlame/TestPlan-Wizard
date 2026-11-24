import { AlertCircle, Loader2, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { suggestRiskItems } from '../../services/aiService';
import {
  IMPACT_LABELS,
  PROBABILITY_LABELS,
  RiskCategory,
  RiskItem,
  RiskSeverity,
  TestPlanData,
  getRiskScore,
  getRiskSeverity,
} from '../../types/testPlan';
import { AITextArea } from '../AITextArea';

interface StepRisksProps {
  plan: TestPlanData;
  onUpdateField: <K extends keyof TestPlanData>(field: K, value: TestPlanData[K]) => void;
}

const INPUT_CLASS =
  'w-full px-2.5 py-1.5 text-[13px] bg-white border border-[#CBD5E1] rounded text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15';

function getCellSurfaceClass(score: number, isSelected: boolean): string {
  const base = isSelected ? 'ring-2 ring-[#0F172A] ring-offset-1 z-10' : '';
  if (score >= 15) return `bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] border-[#FCA5A5] ${base}`;
  if (score >= 10) return `bg-[#FFEDD5] hover:bg-[#FED7AA] text-[#9A3412] border-[#FDBA74] ${base}`;
  if (score >= 5) return `bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border-[#FCD34D] ${base}`;
  return `bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] border-[#86EFAC] ${base}`;
}

function getSeverityTextColor(severity: RiskSeverity): string {
  switch (severity) {
    case 'Crítico':
      return 'text-[#B91C1C]';
    case 'Alto':
      return 'text-[#C2410C]';
    case 'Medio':
      return 'text-[#B45309]';
    case 'Bajo':
      return 'text-[#15803D]';
  }
}

export function StepRisks({ plan, onUpdateField }: StepRisksProps) {
  const [selectedCell, setSelectedCell] = useState<{ probability: number; impact: number } | null>(
    null
  );
  const [categoryFilter, setCategoryFilter] = useState<'Todos' | RiskCategory>('Todos');
  const [isSuggestingRisks, setIsSuggestingRisks] = useState(false);
  const [risksError, setRisksError] = useState<string | null>(null);

  const handleSuggestRisks = async () => {
    if (isSuggestingRisks) return;
    setIsSuggestingRisks(true);
    setRisksError(null);
    try {
      const suggestions = await suggestRiskItems(plan);
      const baseIndex = plan.risks.length;
      const created: RiskItem[] = suggestions
        .filter((r) => r.title.length > 0)
        .map((r, idx) => ({
          id: `rk-ai-${Date.now()}-${idx}`,
          code: `RSK-${String(baseIndex + idx + 1).padStart(2, '0')}`,
          title: r.title,
          category: r.category,
          probability: r.probability,
          impact: r.impact,
          mitigation: r.mitigation,
          contingency: r.contingency,
        }));
      if (created.length > 0) {
        setSelectedCell(null);
        onUpdateField('risks', [...created, ...plan.risks]);
      }
    } catch (err) {
      setRisksError(
        err instanceof Error ? err.message : 'No se pudieron sugerir riesgos con IA.'
      );
    } finally {
      setIsSuggestingRisks(false);
    }
  };

  const severityCounts = useMemo(() => {
    const counts: Record<RiskSeverity, number> = {
      Crítico: 0,
      Alto: 0,
      Medio: 0,
      Bajo: 0,
    };
    for (const risk of plan.risks) {
      const sev = getRiskSeverity(getRiskScore(risk.probability, risk.impact));
      counts[sev] += 1;
    }
    return counts;
  }, [plan.risks]);

  const filteredRisks = useMemo(() => {
    return plan.risks.filter((risk) => {
      if (categoryFilter !== 'Todos' && risk.category !== categoryFilter) return false;
      if (
        selectedCell &&
        (risk.probability !== selectedCell.probability || risk.impact !== selectedCell.impact)
      ) {
        return false;
      }
      return true;
    });
  }, [plan.risks, categoryFilter, selectedCell]);

  const addRisk = (presetProb?: number, presetImpact?: number) => {
    const nextNumber = plan.risks.length + 1;
    const nextCode = `RSK-${String(nextNumber).padStart(2, '0')}`;
    const next: RiskItem = {
      id: `rk-${Date.now()}`,
      code: nextCode,
      title: '',
      category: 'Producto',
      probability: presetProb ?? selectedCell?.probability ?? 3,
      impact: presetImpact ?? selectedCell?.impact ?? 3,
      mitigation: '',
      contingency: '',
    };
    onUpdateField('risks', [next, ...plan.risks]);
  };

  const updateRisk = (id: string, patch: Partial<RiskItem>) => {
    onUpdateField(
      'risks',
      plan.risks.map((risk) => (risk.id === id ? { ...risk, ...patch } : risk))
    );
  };

  const removeRisk = (id: string) => {
    onUpdateField(
      'risks',
      plan.risks.filter((risk) => risk.id !== id)
    );
  };

  const handleCellClick = (probability: number, impact: number) => {
    if (
      selectedCell &&
      selectedCell.probability === probability &&
      selectedCell.impact === impact
    ) {
      setSelectedCell(null);
    } else {
      setSelectedCell({ probability, impact });
    }
  };

  return (
    <div className="space-y-8">
      {/* Interactive 5x5 Risk Matrix */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-[#0F172A]">
              Matriz interactiva Probabilidad × Impacto (5×5)
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Hacé clic en cualquier celda para filtrar los riesgos en esa coordenada o crear uno nuevo en ese nivel.
            </p>
          </div>

          {/* Unboxed Editorial Summary Strip */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] font-mono tabular-nums">
            <span className="text-[#B91C1C] font-medium">Crítico: {severityCounts.Crítico}</span>
            <span className="text-[#CBD5E1]" aria-hidden="true">
              ·
            </span>
            <span className="text-[#C2410C] font-medium">Alto: {severityCounts.Alto}</span>
            <span className="text-[#CBD5E1]" aria-hidden="true">
              ·
            </span>
            <span className="text-[#B45309] font-medium">Medio: {severityCounts.Medio}</span>
            <span className="text-[#CBD5E1]" aria-hidden="true">
              ·
            </span>
            <span className="text-[#15803D] font-medium">Bajo: {severityCounts.Bajo}</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-md p-4 overflow-x-auto">
          <div className="min-w-[460px]">
            <div className="grid grid-cols-[110px_repeat(5,minmax(64px,1fr))] gap-1.5 items-center">
              {/* Top-left axis header */}
              <div className="text-[11.5px] font-medium text-[#64748B] pr-2 text-right">
                Probabilidad ↓
              </div>
              {[1, 2, 3, 4, 5].map((impact) => (
                <div
                  key={`head-${impact}`}
                  className="text-center pb-1 text-[11.5px] text-[#475569]"
                >
                  <div className="font-mono font-semibold text-[#0F172A] tabular-nums">
                    {impact}
                  </div>
                  <div className="truncate">{IMPACT_LABELS[impact]}</div>
                </div>
              ))}

              {/* Rows: Probability 5 down to 1 */}
              {[5, 4, 3, 2, 1].map((probability) => (
                <div key={`row-${probability}`} className="contents">
                  <div className="pr-2 text-right text-[11.5px] text-[#475569]">
                    <span className="font-mono font-semibold text-[#0F172A] tabular-nums mr-1">
                      {probability}
                    </span>
                    <span>{PROBABILITY_LABELS[probability]}</span>
                  </div>

                  {[1, 2, 3, 4, 5].map((impact) => {
                    const score = getRiskScore(probability, impact);
                    const cellRisks = plan.risks.filter(
                      (r) => r.probability === probability && r.impact === impact
                    );
                    const isSelected =
                      selectedCell?.probability === probability && selectedCell?.impact === impact;

                    return (
                      <button
                        key={`cell-${probability}-${impact}`}
                        type="button"
                        onClick={() => handleCellClick(probability, impact)}
                        title={`Probabilidad ${probability} × Impacto ${impact} = ${score} (${getRiskSeverity(score)})`}
                        className={`relative h-12 rounded border flex flex-col items-center justify-center transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D4ED8] ${getCellSurfaceClass(
                          score,
                          isSelected
                        )}`}
                      >
                        <span className="font-mono text-[13px] font-semibold tabular-nums leading-none">
                          {cellRisks.length > 0 ? cellRisks.length : '—'}
                        </span>
                        <span className="font-mono text-[10px] opacity-75 tabular-nums mt-0.5">
                          {score}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#64748B]">
              <span>Eje horizontal: Impacto (1 Mínimo a 5 Crítico)</span>
              <span>Escala: Bajo (1–4) · Medio (5–9) · Alto (10–14) · Crítico (15–25)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Register Controls */}
      <section className="space-y-4 pt-6 border-t border-[#E2E8F0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[15px] font-semibold text-[#0F172A]">Registro de riesgos</h2>

            <div
              role="group"
              aria-label="Filtrar por categoría"
              className="flex items-center gap-1 p-0.5 bg-[#F1F5F9] rounded-md"
            >
              {(['Todos', 'Producto', 'Proyecto'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-[12px] font-medium rounded transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {selectedCell && (
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                className="inline-flex items-center gap-1 text-[12px] font-mono text-[#1D4ED8] hover:underline cursor-pointer"
              >
                <span>
                  Filtro P{selectedCell.probability}×I{selectedCell.impact}
                </span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSuggestRisks}
              disabled={isSuggestingRisks}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium rounded-md border transition-colors whitespace-nowrap ${
                isSuggestingRisks
                  ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8] cursor-wait'
                  : 'bg-white border-[#CBD5E1] text-[#1E3A8A] hover:bg-[#EFF6FF] hover:border-[#93C5FD] cursor-pointer'
              }`}
            >
              {isSuggestingRisks ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sugerir riesgos con IA</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => addRisk()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12.5px] font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {selectedCell
                ? `Nuevo riesgo (P${selectedCell.probability}×I${selectedCell.impact})`
                : 'Agregar riesgo'}
            </button>
          </div>
        </div>

        {risksError && (
          <div role="alert" className="flex items-start gap-1.5 text-[12px] text-[#B91C1C]">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>{risksError}</span>
          </div>
        )}

        {filteredRisks.length === 0 ? (
          <div className="p-6 border border-dashed border-[#CBD5E1] rounded-md text-center space-y-2">
            <p className="text-[13.5px] text-[#64748B]">
              {selectedCell
                ? `No hay riesgos registrados en la coordenada Probabilidad ${selectedCell.probability} × Impacto ${selectedCell.impact}.`
                : 'Aún no registraste riesgos para este plan de pruebas.'}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => addRisk()}
                className="text-[13px] font-medium text-[#1D4ED8] hover:underline cursor-pointer"
              >
                + Crear riesgo aquí
              </button>
              {selectedCell && (
                <button
                  type="button"
                  onClick={() => setSelectedCell(null)}
                  className="text-[13px] text-[#475569] hover:underline cursor-pointer"
                >
                  Mostrar todos los riesgos
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="border border-[#E2E8F0] rounded-md bg-white divide-y divide-[#E2E8F0]">
            {filteredRisks.map((risk) => {
              const score = getRiskScore(risk.probability, risk.impact);
              const severity = getRiskSeverity(score);

              return (
                <div key={risk.id} className="p-4 space-y-3">
                  {/* Top Row: Code, Title, Category, Severity Readout, Delete */}
                  <div className="grid grid-cols-1 md:grid-cols-[95px_1fr_120px_auto_auto] gap-2.5 items-center">
                    <input
                      type="text"
                      value={risk.code}
                      onChange={(e) => updateRisk(risk.id, { code: e.target.value })}
                      aria-label="Código de riesgo"
                      className={`${INPUT_CLASS} font-mono font-medium tabular-nums`}
                    />
                    <input
                      type="text"
                      value={risk.title}
                      onChange={(e) => updateRisk(risk.id, { title: e.target.value })}
                      placeholder="Descripción clara del riesgo técnico o de proyecto"
                      aria-label="Descripción del riesgo"
                      className={`${INPUT_CLASS} font-medium`}
                    />
                    <select
                      value={risk.category}
                      onChange={(e) =>
                        updateRisk(risk.id, { category: e.target.value as RiskCategory })
                      }
                      aria-label="Categoría del riesgo"
                      className={INPUT_CLASS}
                    >
                      <option value="Producto">Producto</option>
                      <option value="Proyecto">Proyecto</option>
                    </select>

                    <div
                      className={`font-mono text-[12.5px] font-semibold tabular-nums whitespace-nowrap px-1 ${getSeverityTextColor(
                        severity
                      )}`}
                    >
                      {score}/25 · {severity}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeRisk(risk.id)}
                      aria-label={`Eliminar riesgo ${risk.code}`}
                      className="p-1.5 text-[#64748B] hover:text-[#B91C1C] transition-colors cursor-pointer justify-self-end"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Probability & Impact Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] text-[#64748B] mb-1">
                        Probabilidad (1–5)
                      </label>
                      <select
                        value={risk.probability}
                        onChange={(e) =>
                          updateRisk(risk.id, { probability: Number(e.target.value) })
                        }
                        className={INPUT_CLASS}
                      >
                        {[1, 2, 3, 4, 5].map((v) => (
                          <option key={v} value={v}>
                            {v} — {PROBABILITY_LABELS[v]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12px] text-[#64748B] mb-1">
                        Impacto (1–5)
                      </label>
                      <select
                        value={risk.impact}
                        onChange={(e) => updateRisk(risk.id, { impact: Number(e.target.value) })}
                        className={INPUT_CLASS}
                      >
                        {[1, 2, 3, 4, 5].map((v) => (
                          <option key={v} value={v}>
                            {v} — {IMPACT_LABELS[v]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Mitigation & Contingency with AI Drafting */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AITextArea
                      id={`risk-mit-${risk.id}`}
                      label="Plan de mitigación (preventivo)"
                      fieldKey="riskMitigation"
                      rows={2}
                      compact
                      value={risk.mitigation}
                      onChange={(val) => updateRisk(risk.id, { mitigation: val })}
                      planContext={plan}
                      extraContext={`Riesgo ${risk.code}: ${risk.title || 'Sin título'} | Categoría: ${risk.category} | Probabilidad: ${risk.probability}/5 | Impacto: ${risk.impact}/5 (${severity})`}
                      placeholder="Acción concreta de QA para reducir probabilidad o detectar el fallo temprano."
                    />
                    <AITextArea
                      id={`risk-cont-${risk.id}`}
                      label="Plan de contingencia (si ocurre)"
                      fieldKey="riskContingency"
                      rows={2}
                      compact
                      value={risk.contingency}
                      onChange={(val) => updateRisk(risk.id, { contingency: val })}
                      planContext={plan}
                      extraContext={`Riesgo ${risk.code}: ${risk.title || 'Sin título'} | Categoría: ${risk.category} | Probabilidad: ${risk.probability}/5 | Impacto: ${risk.impact}/5 (${severity}) | Mitigación: ${risk.mitigation || 'Sin definir'}`}
                      placeholder="Respuesta operativa o rollback si el riesgo se materializa."
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
