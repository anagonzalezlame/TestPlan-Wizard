import { X } from 'lucide-react';
import { useEffect } from 'react';

interface StandardsGuideModalProps {
  open: boolean;
  onClose: () => void;
}

const MAPPING_ROWS = [
  {
    wizard: '01. Contexto e Identificación',
    iso: 'Metadatos · 1. Contexto de las Pruebas (Objetivos, Base, Referencias)',
    ieee: '1. Identificador · 2. Referencias · 3. Introducción',
  },
  {
    wizard: '02. Alcance e Ítems',
    iso: '2. Alcance y Elementos Bajo Prueba (Ítems, En alcance, Exclusiones)',
    ieee: '4. Ítems de Prueba · 6. Funcionalidades a Probar · 7. No Probadas',
  },
  {
    wizard: '03. Estrategia y Criterios',
    iso: '4. Estrategia de Pruebas · 5. Criterios de Control (Entrada/Salida/Suspensión)',
    ieee: '8. Enfoque · 9. Aceptación/Fallo · 10. Suspensión y Reanudación',
  },
  {
    wizard: '04. Recursos y Cronograma',
    iso: '6. Entornos, Datos y Entregables · 7. Personal, Roles y Cronograma',
    ieee: '11. Entregables · 12. Tareas · 13. Entorno · 14-15. Personal · 16. Cronograma',
  },
  {
    wizard: '05. Matriz de Riesgos',
    iso: '3. Registro y Evaluación de Riesgos (Producto y Proyecto + Contingencias)',
    ieee: '5. Riesgos de Software · 17. Riesgos de Planificación y Contingencias',
  },
  {
    wizard: '06. Revisión y Exportación',
    iso: '8. Aprobaciones y Control de Documento',
    ieee: '18. Aprobaciones',
  },
];

export function StandardsGuideModal({ open, onClose }: StandardsGuideModalProps) {
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
      aria-labelledby="standards-modal-title"
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white border border-[#E2E8F0] rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
          <div>
            <h2 id="standards-modal-title" className="text-[17px] font-semibold text-[#0F172A]">
              Correspondencia normativa: ISO/IEC/IEEE 29119-3 vs IEEE 829
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Tus respuestas se capturan una sola vez y el motor genera la estructura exacta de cada estándar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar guía normativa"
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          <div className="overflow-x-auto border border-[#E2E8F0] rounded-md">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-3.5 py-2.5 font-semibold text-[#334155]">Paso del Asistente</th>
                  <th className="px-3.5 py-2.5 font-semibold text-[#334155]">ISO/IEC/IEEE 29119-3</th>
                  <th className="px-3.5 py-2.5 font-semibold text-[#334155]">IEEE 829-2008</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {MAPPING_ROWS.map((row) => (
                  <tr key={row.wizard} className="align-top">
                    <td className="px-3.5 py-2.5 font-medium text-[#0F172A] whitespace-nowrap">
                      {row.wizard}
                    </td>
                    <td className="px-3.5 py-2.5 text-[#334155]">{row.iso}</td>
                    <td className="px-3.5 py-2.5 text-[#334155]">{row.ieee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[12.5px] text-[#475569] leading-relaxed">
            <strong>¿Cuál conviene elegir?</strong> ISO/IEC/IEEE 29119-3 reemplazó oficialmente a IEEE 829 y resulta más ágil y orientada a riesgos para equipos iterativos o DevOps. IEEE 829 sigue siendo útil cuando un cliente, organismo estatal o auditoría exige explícitamente las 18 secciones clásicas.
          </p>
        </div>
      </div>
    </div>
  );
}
