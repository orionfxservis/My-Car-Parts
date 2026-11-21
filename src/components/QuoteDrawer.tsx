import { FormEvent, useState } from 'react';
import { CheckCircle2, Trash2, X } from 'lucide-react';
import { ToolItem } from '../data/inventory';

interface QuoteDrawerProps {
  open: boolean;
  items: ToolItem[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onClearItems: () => void;
}

export function QuoteDrawer({
  open,
  items,
  onClose,
  onRemoveItem,
  onClearItems,
}: QuoteDrawerProps) {
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [quoteRef, setQuoteRef] = useState<string | null>(null);

  if (!open) return null;

  const estimatedTotal = items.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!company.trim()) {
      setError('Please enter your company or workshop name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid business email address.');
      return;
    }

    setQuoteRef(`RFQ-${Math.floor(100000 + Math.random() * 900000)}`);
    onClearItems();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Request Commercial Quote"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-[#151A23] border-l border-slate-800 flex flex-col justify-between overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 sticky top-0 bg-[#151A23]/95 backdrop-blur-sm z-10">
            <div>
              <h2 className="text-lg font-bold text-white">Commercial Quote Request</h2>
              <p className="text-xs text-slate-400">
                Direct fleet &amp; industrial equipment pricing
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close quote drawer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {quoteRef ? (
              <div className="py-10 text-center">
                <CheckCircle2
                  className="w-11 h-11 text-emerald-400 mx-auto mb-3"
                  aria-hidden="true"
                />
                <h3 className="text-lg font-bold text-white">Quote Request Submitted</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Reference:{' '}
                  <span className="font-mono text-amber-400 font-semibold tabular-nums">
                    {quoteRef}
                  </span>
                </p>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Our commercial desk will send a formal itemized quotation with freight
                  lead times to <span className="text-slate-200">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuoteRef(null);
                    setNotes('');
                    onClose();
                  }}
                  className="mt-6 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer"
                >
                  Return to Catalog
                </button>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-slate-300">
                      Selected Equipment ({items.length})
                    </h3>
                    {items.length > 0 && (
                      <span className="text-xs font-mono tabular-nums text-amber-400">
                        Est. ${estimatedTotal.toLocaleString('en-US')}
                      </span>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <div className="p-4 rounded-lg border border-slate-800 bg-[#11151C] text-xs text-slate-400">
                      No specific tools selected yet. Submit a general inquiry below or add
                      systems from the catalog.
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-800 border border-slate-800 rounded-lg bg-[#11151C]">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="p-3.5 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] font-mono tabular-nums text-slate-400 mt-0.5">
                              {item.sku} · ${item.price.toLocaleString('en-US')}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            aria-label={`Remove ${item.name} from quote`}
                            className="p-2 text-slate-400 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {error && (
                    <div
                      role="alert"
                      className="p-3 rounded-md bg-red-500/10 border border-red-500/40 text-xs text-red-200"
                    >
                      {error}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="quote-company"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      Company / Fleet Name
                    </label>
                    <input
                      id="quote-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Meridian Heavy Plant LLC"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#11151C] border border-slate-700 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="quote-email"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      Procurement Email
                    </label>
                    <input
                      id="quote-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="procurement@company.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#11151C] border border-slate-700 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="quote-notes"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      Delivery Region &amp; Quantities
                    </label>
                    <textarea
                      id="quote-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Specify shipping port, voltage standards (50/60Hz), or bulk quantities..."
                      className="w-full px-3.5 py-2.5 text-sm bg-[#11151C] border border-slate-700 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer"
                  >
                    Submit Quote Request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
