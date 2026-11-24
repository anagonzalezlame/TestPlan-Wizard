import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DocumentStatus, TestPlanData, TestPlanStandard } from '../../types/testPlan';
import { AITextArea } from '../AITextArea';

interface StepContextProps {
  plan: TestPlanData;
  onUpdateField: <K extends keyof TestPlanData>(field: K, value: TestPlanData[K]) => void;
  onChangeStandard: (standard: TestPlanStandard) => void;
  onOpenTemplates: () => void;
}

const INPUT_CLASS =
  'w-full px-3 py-2 text-[14px] bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15 transition-colors';

export function StepContext({
  plan,
  onUpdateField,
  onChangeStandard,
  onOpenTemplates,
}: StepContextProps) {
  const [newReference, setNewReference] = useState('');

  const addReference = () => {
    const trimmed = newReference.trim();
    if (!trimmed) return;
    onUpdateField('references', [...plan.references, trimmed]);
    setNewReference('');
  };

  const removeReference = (index: number) => {
    onUpdateField(
      'references',
      plan.references.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-8">
      {/* Quick Template Callout Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-[15px] font-semibold text-[#0F172A]">Punto de partida</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Elegí una plantilla precargada (E-commerce, API REST o App Móvil) o editá este plan directamente.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenTemplates}
          className="px-3.5 py-2 text-[13px] font-medium text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Explorar plantillas
        </button>
      </div>

      {/* Standard Choice */}
      <section className="space-y-3">
        <div>
          <h2 className="text-[15px] font-semibold text-[#0F172A]">Estándar normativo</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Podés cambiar de norma en cualquier momento; tus respuestas se reorganizan automáticamente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChangeStandard('ISO_29119')}
            className={`p-4 text-left rounded-md border transition-colors cursor-pointer ${
              plan.standard === 'ISO_29119'
                ? 'bg-[#EFF6FF]/60 border-[#1D4ED8]'
                : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-[14px] font-semibold text-[#0F172A]">
                ISO/IEC/IEEE 29119-3
              </span>
              <span className="font-mono text-[11.5px] text-[#1D4ED8]">
                {plan.standard === 'ISO_29119' ? 'Activo' : '8 cláusulas'}
              </span>
            </div>
            <p className="mt-1.5 text-[12.5px] text-[#475569] leading-relaxed">
              Estándar vigente adaptable a equipos ágiles y DevOps. Agrupa contexto, riesgos, estrategia y cronograma de forma concisa.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChangeStandard('IEEE_829')}
            className={`p-4 text-left rounded-md border transition-colors cursor-pointer ${
              plan.standard === 'IEEE_829'
                ? 'bg-[#EFF6FF]/60 border-[#1D4ED8]'
                : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-[14px] font-semibold text-[#0F172A]">
                IEEE 829-2008
              </span>
              <span className="font-mono text-[11.5px] text-[#1D4ED8]">
                {plan.standard === 'IEEE_829' ? 'Activo' : '18 secciones'}
              </span>
            </div>
            <p className="mt-1.5 text-[12.5px] text-[#475569] leading-relaxed">
              Formato clásico de 18 secciones formales, ideal para auditorías tradicionales, licitaciones y entornos regulados.
            </p>
          </button>
        </div>
      </section>

      {/* Identification Grid */}
      <section className="space-y-4 pt-6 border-t border-[#E2E8F0]">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">Identificación del documento</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="doc-id" className="block text-[13px] font-medium text-[#334155] mb-1.5">
              Identificador único
            </label>
            <input
              id="doc-id"
              type="text"
              value={plan.documentId}
              onChange={(e) => onUpdateField('documentId', e.target.value)}
              placeholder="Ej. TP-ECOM-2026-01"
              className={`${INPUT_CLASS} font-mono tabular-nums`}
            />
          </div>

          <div>
            <label htmlFor="doc-version" className="block text-[13px] font-medium text-[#334155] mb-1.5">
              Versión
            </label>
            <input
              id="doc-version"
              type="text"
              value={plan.version}
              onChange={(e) => onUpdateField('version', e.target.value)}
              placeholder="Ej. 1.0"
              className={`${INPUT_CLASS} font-mono tabular-nums`}
            />
          </div>

          <div>
            <label htmlFor="doc-status" className="block text-[13px] font-medium text-[#334155] mb-1.5">
              Estado
            </label>
            <select
              id="doc-status"
              value={plan.status}
              onChange={(e) => onUpdateField('status', e.target.value as DocumentStatus)}
              className={INPUT_CLASS}
            >
              <option value="Borrador">Borrador</option>
              <option value="En revisión">En revisión</option>
              <option value="Aprobado">Aprobado</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="doc-title" className="block text-[13px] font-medium text-[#334155] mb-1.5">
              Título del Plan de Pruebas
            </label>
            <input
              id="doc-title"
              type="text"
              value={plan.title}
              onChange={(e) => onUpdateField('title', e.target.value)}
              placeholder="Ej. Plan de Pruebas — Portal de Pagos v2.0"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="doc-project" className="block text-[13px] font-medium text-[#334155] mb-1.5">
              Proyecto / Producto
            </label>
            <input
              id="doc-project"
              type="text"
              value={plan.projectName}
              onChange={(e) => onUpdateField('projectName', e.target.value)}
              placeholder="Ej. Plataforma E-commerce"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="doc-author" className="block text-[13px] font-medium text-[#334155] mb-1.5">
              Autor responsable
            </label>
            <input
              id="doc-author"
              type="text"
              value={plan.author}
              onChange={(e) => onUpdateField('author', e.target.value)}
              placeholder="Nombre y rol"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="doc-approver" className="block text-[13px] font-medium text-[#334155] mb-1.5">
              Aprobador designado
            </label>
            <input
              id="doc-approver"
              type="text"
              value={plan.approver}
              onChange={(e) => onUpdateField('approver', e.target.value)}
              placeholder="Nombre y rol"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="doc-date" className="block text-[13px] font-medium text-[#334155] mb-1.5">
              Fecha de emisión
            </label>
            <input
              id="doc-date"
              type="date"
              value={plan.date}
              onChange={(e) => onUpdateField('date', e.target.value)}
              className={`${INPUT_CLASS} font-mono tabular-nums`}
            />
          </div>
        </div>
      </section>

      {/* Context & Objectives */}
      <section className="space-y-5 pt-6 border-t border-[#E2E8F0]">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">Contexto y objetivos</h2>

        <AITextArea
          id="doc-summary"
          label="Resumen ejecutivo / Introducción"
          fieldKey="summary"
          rows={3}
          value={plan.summary}
          onChange={(val) => onUpdateField('summary', val)}
          planContext={plan}
          placeholder="Describí brevemente el propósito de este lanzamiento y el contexto del sistema bajo prueba."
        />

        <AITextArea
          id="doc-objectives"
          label="Objetivos clave de las pruebas"
          fieldKey="objectives"
          rows={3}
          value={plan.objectives}
          onChange={(val) => onUpdateField('objectives', val)}
          planContext={plan}
          placeholder="¿Qué atributos de calidad, riesgos o requisitos críticos se busca confirmar antes de liberar?"
        />

        <AITextArea
          id="doc-basis"
          label="Base de pruebas (Test Basis)"
          fieldKey="testBasis"
          rows={2}
          value={plan.testBasis}
          onChange={(val) => onUpdateField('testBasis', val)}
          planContext={plan}
          placeholder="Ej. Historias de usuario, PRD, contratos OpenAPI, requisitos regulatorios o guías WCAG."
        />
      </section>

      {/* References List */}
      <section className="space-y-3 pt-6 border-t border-[#E2E8F0]">
        <div>
          <h2 className="text-[15px] font-semibold text-[#0F172A]">Documentos de referencia</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Especificaciones, diagramas de arquitectura o normativas vinculadas a este plan.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newReference}
            onChange={(e) => setNewReference(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addReference();
              }
            }}
            placeholder="Ej. PRD-042 — Especificación de Checkout"
            className={INPUT_CLASS}
          />
          <button
            type="button"
            onClick={addReference}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>

        {plan.references.length === 0 ? (
          <p className="text-[13px] text-[#64748B] py-3 border border-dashed border-[#CBD5E1] rounded-md px-4">
            Aún no agregaste referencias. Incluí los PRD, contratos API o normas aplicables.
          </p>
        ) : (
          <ul className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-md bg-white">
            {plan.references.map((ref, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-[13.5px] text-[#1E293B]"
              >
                <span className="break-words">{ref}</span>
                <button
                  type="button"
                  onClick={() => removeReference(idx)}
                  aria-label="Eliminar referencia"
                  className="p-1.5 text-[#64748B] hover:text-[#B91C1C] transition-colors shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
