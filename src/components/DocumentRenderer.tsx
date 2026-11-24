import { useMemo } from 'react';
import { TestPlanData } from '../types/testPlan';
import { buildStructuredDocument } from '../utils/documentGenerator';

interface DocumentRendererProps {
  plan: TestPlanData;
  compact?: boolean;
}

export function DocumentRenderer({ plan, compact = false }: DocumentRendererProps) {
  const doc = useMemo(() => buildStructuredDocument(plan), [plan]);

  return (
    <article
      className={`bg-white text-[#0F172A] ${
        compact ? 'p-6 text-[13px] leading-relaxed' : 'p-8 md:p-10 text-[14px] leading-relaxed'
      }`}
    >
      {/* Editorial Technical Document Header */}
      <header className="pb-6 border-b border-[#CBD5E1]">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B] font-mono tabular-nums">
          <span>
            {doc.standardLabel} · {doc.documentId}
          </span>
          <span>
            v{doc.version} · {doc.status} · {doc.date}
          </span>
        </div>

        <h1
          className={`mt-3 font-semibold tracking-tight text-[#0F172A] ${
            compact ? 'text-xl' : 'text-2xl md:text-[26px]'
          }`}
        >
          {doc.title}
        </h1>

        <dl className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 pt-4 border-t border-[#E2E8F0] text-xs">
          <div>
            <dt className="text-[#64748B]">Proyecto</dt>
            <dd className="mt-0.5 font-medium text-[#0F172A]">{doc.projectName}</dd>
          </div>
          <div>
            <dt className="text-[#64748B]">Autor responsable</dt>
            <dd className="mt-0.5 font-medium text-[#0F172A]">{doc.author}</dd>
          </div>
          <div>
            <dt className="text-[#64748B]">Aprobador</dt>
            <dd className="mt-0.5 font-medium text-[#0F172A]">{doc.approver}</dd>
          </div>
        </dl>
      </header>

      {/* Normative Sections */}
      <div className={compact ? 'mt-6 space-y-6' : 'mt-8 space-y-8'}>
        {doc.sections.map((section) => (
          <section key={section.id} className="print-section">
            <h2
              className={`font-semibold text-[#0F172A] pb-1.5 border-b border-[#E2E8F0] flex items-baseline gap-2.5 ${
                compact ? 'text-[15px]' : 'text-[17px]'
              }`}
            >
              <span className="font-mono text-[#1D4ED8] tabular-nums">{section.number}.</span>
              <span>{section.title}</span>
            </h2>

            <div className="mt-3 space-y-3.5">
              {section.blocks.map((block, index) => {
                if (block.type === 'subheading') {
                  return (
                    <h3
                      key={`${section.id}-sub-${index}`}
                      className="text-[13px] font-semibold text-[#334155] pt-1"
                    >
                      {block.text}
                    </h3>
                  );
                }

                if (block.type === 'paragraph') {
                  return (
                    <p
                      key={`${section.id}-p-${index}`}
                      className="text-[#334155] whitespace-pre-line"
                    >
                      {block.text}
                    </p>
                  );
                }

                if (block.type === 'list') {
                  return (
                    <ul
                      key={`${section.id}-ul-${index}`}
                      className="list-disc pl-5 space-y-1.5 text-[#334155]"
                    >
                      {block.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === 'keyValue') {
                  return (
                    <div
                      key={`${section.id}-kv-${index}`}
                      className="border border-[#E2E8F0] rounded-md overflow-hidden"
                    >
                      <dl className="divide-y divide-[#E2E8F0]">
                        {block.rows.map((row, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-2 px-3.5 py-2.5 text-[13px]"
                          >
                            <dt className="font-medium text-[#475569]">{row.label}</dt>
                            <dd className="text-[#0F172A]">{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  );
                }

                if (block.type === 'table') {
                  return (
                    <div
                      key={`${section.id}-tbl-${index}`}
                      className="overflow-x-auto border border-[#E2E8F0] rounded-md"
                    >
                      <table className="print-table w-full text-left border-collapse text-[12.5px]">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                            {block.headers.map((header, hIdx) => (
                              <th
                                key={hIdx}
                                className="px-3 py-2 font-semibold text-[#334155] whitespace-nowrap"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                          {block.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="align-top">
                              {row.map((cell, cIdx) => {
                                const isNumeric = block.numericColumns?.includes(cIdx);
                                return (
                                  <td
                                    key={cIdx}
                                    className={`px-3 py-2 text-[#1E293B] ${
                                      isNumeric ? 'font-mono tabular-nums whitespace-nowrap' : ''
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
