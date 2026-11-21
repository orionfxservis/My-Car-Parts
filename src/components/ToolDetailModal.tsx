import { Check, Plus, ShieldCheck, X } from 'lucide-react';
import { ToolItem } from '../data/inventory';
import { SafeImage } from './SafeImage';

interface ToolDetailModalProps {
  tool: ToolItem | null;
  inQuote: boolean;
  onClose: () => void;
  onToggleQuote: (tool: ToolItem) => void;
}

export function ToolDetailModal({
  tool,
  inQuote,
  onClose,
  onToggleQuote,
}: ToolDetailModalProps) {
  if (!tool) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tool-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#161B24] border border-slate-700/90 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-800 sticky top-0 bg-[#161B24]/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 text-xs text-slate-400 min-w-0">
            <span className="font-medium text-amber-400">{tool.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{tool.sku}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close specifications modal"
            className="inline-flex items-center justify-center w-9 h-9 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 bg-[#10141B]">
              <SafeImage
                src={tool.image}
                alt={tool.name}
                fallbackLabel={tool.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2 id="tool-modal-title" className="text-xl sm:text-2xl font-bold text-white">
                {tool.name}
              </h2>
              <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">{tool.fullDesc}</p>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <span className="block text-xs text-slate-400">List Price (Ex-Works)</span>
                  <span className="font-mono tabular-nums text-2xl font-bold text-white">
                    Rs {tool.price.toLocaleString('en-US')}
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    tool.availability === 'In Stock' ? 'text-emerald-400' : 'text-amber-300'
                  }`}
                >
                  {tool.availability}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                <span>{tool.warranty}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                Technical Specifications
              </h3>
              <dl className="divide-y divide-slate-800/80 border-t border-b border-slate-800/80">
                {tool.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="py-2.5 flex items-center justify-between gap-4 text-xs sm:text-sm"
                  >
                    <dt className="text-slate-400">{spec.label}</dt>
                    <dd className="font-mono tabular-nums text-slate-100 text-right">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                Primary Field Applications
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                {tool.applications.map((app) => (
                  <li key={app} className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-mono mt-0.5">—</span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white border border-slate-700 rounded-md transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onToggleQuote(tool)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer ${
                inQuote
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {inQuote ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Added to Quote List</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add to Quote Request</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
