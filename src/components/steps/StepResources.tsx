import { Check, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DELIVERABLE_OPTIONS } from '../../data/templates';
import {
  EnvironmentNeed,
  ScheduleMilestone,
  StaffRole,
  TestPlanData,
} from '../../types/testPlan';
import { AITextArea } from '../AITextArea';

interface StepResourcesProps {
  plan: TestPlanData;
  onUpdateField: <K extends keyof TestPlanData>(field: K, value: TestPlanData[K]) => void;
}

const CELL_INPUT =
  'w-full px-2.5 py-1.5 text-[13px] bg-white border border-[#CBD5E1] rounded text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15';

export function StepResources({ plan, onUpdateField }: StepResourcesProps) {
  const [customDeliverable, setCustomDeliverable] = useState('');

  // Environments CRUD
  const addEnvironment = () => {
    const next: EnvironmentNeed = {
      id: `env-${Date.now()}`,
      name: '',
      configuration: '',
      tools: '',
      availability: '',
    };
    onUpdateField('environments', [...plan.environments, next]);
  };

  const updateEnvironment = (id: string, patch: Partial<EnvironmentNeed>) => {
    onUpdateField(
      'environments',
      plan.environments.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  };

  const removeEnvironment = (id: string) => {
    onUpdateField(
      'environments',
      plan.environments.filter((e) => e.id !== id)
    );
  };

  // Staffing CRUD
  const addStaffRole = () => {
    const next: StaffRole = {
      id: `st-${Date.now()}`,
      role: '',
      responsibilities: '',
      quantity: 1,
      trainingNeeds: 'Ninguna',
    };
    onUpdateField('staffing', [...plan.staffing, next]);
  };

  const updateStaffRole = (id: string, patch: Partial<StaffRole>) => {
    onUpdateField(
      'staffing',
      plan.staffing.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  };

  const removeStaffRole = (id: string) => {
    onUpdateField(
      'staffing',
      plan.staffing.filter((s) => s.id !== id)
    );
  };

  // Schedule CRUD
  const addMilestone = () => {
    const today = new Date().toISOString().slice(0, 10);
    const next: ScheduleMilestone = {
      id: `sch-${Date.now()}`,
      phase: '',
      startDate: today,
      endDate: today,
      deliverable: '',
    };
    onUpdateField('schedule', [...plan.schedule, next]);
  };

  const updateMilestone = (id: string, patch: Partial<ScheduleMilestone>) => {
    onUpdateField(
      'schedule',
      plan.schedule.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  };

  const removeMilestone = (id: string) => {
    onUpdateField(
      'schedule',
      plan.schedule.filter((m) => m.id !== id)
    );
  };

  // Deliverables
  const toggleDeliverable = (item: string) => {
    if (plan.deliverables.includes(item)) {
      onUpdateField(
        'deliverables',
        plan.deliverables.filter((d) => d !== item)
      );
    } else {
      onUpdateField('deliverables', [...plan.deliverables, item]);
    }
  };

  const addCustomDeliverable = () => {
    const trimmed = customDeliverable.trim();
    if (!trimmed || plan.deliverables.includes(trimmed)) return;
    onUpdateField('deliverables', [...plan.deliverables, trimmed]);
    setCustomDeliverable('');
  };

  const allDeliverableChoices = Array.from(
    new Set([...DELIVERABLE_OPTIONS, ...plan.deliverables])
  );

  return (
    <div className="space-y-8">
      {/* Environments */}
      <section className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[15px] font-semibold text-[#0F172A]">Entornos y herramientas</h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Infraestructura, dispositivos, herramientas de automatización y ventanas de disponibilidad.
            </p>
          </div>
          <button
            type="button"
            onClick={addEnvironment}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar entorno
          </button>
        </div>

        {plan.environments.length === 0 ? (
          <div className="p-5 border border-dashed border-[#CBD5E1] rounded-md text-center space-y-2">
            <p className="text-[13px] text-[#64748B]">No se declararon entornos de prueba.</p>
            <button
              type="button"
              onClick={addEnvironment}
              className="text-[13px] font-medium text-[#1D4ED8] hover:underline cursor-pointer"
            >
              + Agregar primer entorno
            </button>
          </div>
        ) : (
          <div className="border border-[#E2E8F0] rounded-md bg-white divide-y divide-[#E2E8F0]">
            {plan.environments.map((env) => (
              <div key={env.id} className="p-3.5 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1.4fr_auto] gap-2.5 items-center">
                  <input
                    type="text"
                    value={env.name}
                    onChange={(e) => updateEnvironment(env.id, { name: e.target.value })}
                    placeholder="Nombre del entorno (ej. Staging QA)"
                    aria-label="Nombre del entorno"
                    className={`${CELL_INPUT} font-medium`}
                  />
                  <input
                    type="text"
                    value={env.availability}
                    onChange={(e) => updateEnvironment(env.id, { availability: e.target.value })}
                    placeholder="Disponibilidad (ej. 24/7 o Ventana sprint)"
                    aria-label="Disponibilidad"
                    className={CELL_INPUT}
                  />
                  <button
                    type="button"
                    onClick={() => removeEnvironment(env.id)}
                    aria-label="Eliminar entorno"
                    className="p-1.5 text-[#64748B] hover:text-[#B91C1C] transition-colors cursor-pointer justify-self-end"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={env.configuration}
                    onChange={(e) => updateEnvironment(env.id, { configuration: e.target.value })}
                    placeholder="Configuración técnica (servidores, BD, dispositivos)"
                    aria-label="Configuración"
                    className={CELL_INPUT}
                  />
                  <input
                    type="text"
                    value={env.tools}
                    onChange={(e) => updateEnvironment(env.id, { tools: e.target.value })}
                    placeholder="Herramientas (Playwright, Postman, k6, Jira)"
                    aria-label="Herramientas"
                    className={CELL_INPUT}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2">
          <AITextArea
            id="test-data-req"
            label="Requerimientos de datos de prueba"
            fieldKey="testDataRequirements"
            rows={2}
            value={plan.testDataRequirements}
            onChange={(val) => onUpdateField('testDataRequirements', val)}
            planContext={plan}
            placeholder="Especificá usuarios sintéticos, cuentas de prueba, anonimización o datasets requeridos."
          />
        </div>
      </section>

      {/* Staffing & Training */}
      <section className="space-y-3 pt-6 border-t border-[#E2E8F0]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[15px] font-semibold text-[#0F172A]">
              Equipo, responsabilidades y capacitación
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Roles involucrados en las pruebas, dotación asignada y formación necesaria.
            </p>
          </div>
          <button
            type="button"
            onClick={addStaffRole}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar rol
          </button>
        </div>

        {plan.staffing.length === 0 ? (
          <div className="p-5 border border-dashed border-[#CBD5E1] rounded-md text-center space-y-2">
            <p className="text-[13px] text-[#64748B]">Aún no hay roles asignados al plan.</p>
            <button
              type="button"
              onClick={addStaffRole}
              className="text-[13px] font-medium text-[#1D4ED8] hover:underline cursor-pointer"
            >
              + Agregar primer rol
            </button>
          </div>
        ) : (
          <div className="border border-[#E2E8F0] rounded-md bg-white divide-y divide-[#E2E8F0]">
            {plan.staffing.map((role) => (
              <div key={role.id} className="p-3.5 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_90px_1.4fr_auto] gap-2.5 items-center">
                  <input
                    type="text"
                    value={role.role}
                    onChange={(e) => updateStaffRole(role.id, { role: e.target.value })}
                    placeholder="Rol (ej. QA Automation)"
                    aria-label="Rol"
                    className={`${CELL_INPUT} font-medium`}
                  />
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={role.quantity}
                    onChange={(e) =>
                      updateStaffRole(role.id, {
                        quantity: Math.max(1, Number.parseInt(e.target.value || '1', 10)),
                      })
                    }
                    aria-label="Cantidad"
                    className={`${CELL_INPUT} font-mono tabular-nums`}
                  />
                  <input
                    type="text"
                    value={role.trainingNeeds}
                    onChange={(e) => updateStaffRole(role.id, { trainingNeeds: e.target.value })}
                    placeholder="Necesidades de capacitación"
                    aria-label="Capacitación"
                    className={CELL_INPUT}
                  />
                  <button
                    type="button"
                    onClick={() => removeStaffRole(role.id)}
                    aria-label="Eliminar rol"
                    className="p-1.5 text-[#64748B] hover:text-[#B91C1C] transition-colors cursor-pointer justify-self-end"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={role.responsibilities}
                  onChange={(e) => updateStaffRole(role.id, { responsibilities: e.target.value })}
                  placeholder="Responsabilidades principales dentro del plan"
                  aria-label="Responsabilidades"
                  className={CELL_INPUT}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Schedule Milestones */}
      <section className="space-y-3 pt-6 border-t border-[#E2E8F0]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[15px] font-semibold text-[#0F172A]">Cronograma e hitos</h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Fases de preparación, ejecución, pruebas no funcionales y cierre Go / No-Go.
            </p>
          </div>
          <button
            type="button"
            onClick={addMilestone}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar hito
          </button>
        </div>

        {plan.schedule.length === 0 ? (
          <div className="p-5 border border-dashed border-[#CBD5E1] rounded-md text-center space-y-2">
            <p className="text-[13px] text-[#64748B]">No hay hitos registrados en el cronograma.</p>
            <button
              type="button"
              onClick={addMilestone}
              className="text-[13px] font-medium text-[#1D4ED8] hover:underline cursor-pointer"
            >
              + Agregar primer hito
            </button>
          </div>
        ) : (
          <div className="border border-[#E2E8F0] rounded-md bg-white divide-y divide-[#E2E8F0]">
            {plan.schedule.map((ms) => (
              <div
                key={ms.id}
                className="p-3 grid grid-cols-1 sm:grid-cols-[1.5fr_132px_132px_1.3fr_auto] gap-2.5 items-center"
              >
                <input
                  type="text"
                  value={ms.phase}
                  onChange={(e) => updateMilestone(ms.id, { phase: e.target.value })}
                  placeholder="Fase o actividad"
                  aria-label="Fase"
                  className={CELL_INPUT}
                />
                <input
                  type="date"
                  value={ms.startDate}
                  onChange={(e) => updateMilestone(ms.id, { startDate: e.target.value })}
                  aria-label="Fecha inicio"
                  className={`${CELL_INPUT} font-mono tabular-nums`}
                />
                <input
                  type="date"
                  value={ms.endDate}
                  onChange={(e) => updateMilestone(ms.id, { endDate: e.target.value })}
                  aria-label="Fecha fin"
                  className={`${CELL_INPUT} font-mono tabular-nums`}
                />
                <input
                  type="text"
                  value={ms.deliverable}
                  onChange={(e) => updateMilestone(ms.id, { deliverable: e.target.value })}
                  placeholder="Entregable"
                  aria-label="Entregable"
                  className={CELL_INPUT}
                />
                <button
                  type="button"
                  onClick={() => removeMilestone(ms.id)}
                  aria-label="Eliminar hito"
                  className="p-1.5 text-[#64748B] hover:text-[#B91C1C] transition-colors cursor-pointer justify-self-end"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Deliverables & Remaining Tasks */}
      <section className="space-y-4 pt-6 border-t border-[#E2E8F0]">
        <div>
          <h2 className="text-[15px] font-semibold text-[#0F172A]">Entregables de prueba</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Artefactos formales que QA emitirá antes, durante y al cierre de la ejecución.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {allDeliverableChoices.map((item) => {
            const checked = plan.deliverables.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleDeliverable(item)}
                aria-pressed={checked}
                className={`flex items-center justify-between gap-2.5 px-3 py-2 text-left text-[13px] rounded-md border transition-colors cursor-pointer ${
                  checked
                    ? 'bg-[#EFF6FF] border-[#1D4ED8] text-[#0F172A] font-medium'
                    : 'bg-white border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]'
                }`}
              >
                <span className="truncate">{item}</span>
                <span
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                    checked
                      ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white'
                      : 'border-[#CBD5E1] bg-white'
                  }`}
                >
                  {checked && <Check className="w-3 h-3" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customDeliverable}
            onChange={(e) => setCustomDeliverable(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomDeliverable();
              }
            }}
            placeholder="Agregar entregable personalizado..."
            className="w-full px-3 py-2 text-[13.5px] bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D4ED8]"
          />
          <button
            type="button"
            onClick={addCustomDeliverable}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>

        <div className="pt-2">
          <AITextArea
            id="remaining-tasks"
            label="Tareas previas pendientes (Remaining Test Tasks)"
            fieldKey="remainingTasks"
            rows={2}
            value={plan.remainingTasks}
            onChange={(val) => onUpdateField('remainingTasks', val)}
            planContext={plan}
            placeholder="Acciones preparatorias pendientes antes de la ejecución (ej. rotación de llaves, aprobaciones de acceso)."
          />
        </div>
      </section>
    </div>
  );
}
