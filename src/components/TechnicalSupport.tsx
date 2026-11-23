import { FormEvent, useState } from 'react';
import { CheckCircle2, FileText, Wrench } from 'lucide-react';
import { TECHNICAL_GUIDES } from '../data/inventory';

interface TechnicalSupportProps {
  onOpenChatWithTopic: (topic: string) => void;
}

export function TechnicalSupport({ onOpenChatWithTopic }: TechnicalSupportProps) {
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Car Spare Parts');
  const [serial, setSerial] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name or workshop contact.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid work email address.');
      return;
    }
    if (message.trim().length < 10) {
      setError(
        'Please describe your technical question or calibration request (min 10 characters).',
      );
      return;
    }

    const ticketCode = `VK-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedTicket(ticketCode);
  };

  return (
    <section
      id="technical-support"
      className="bg-[#12161E] py-16 sm:py-20 border-b border-slate-800/70"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="max-w-2xl mb-10">
          <p className="text-xs sm:text-sm font-medium text-amber-400 mb-2">
            Technical Support &amp; Calibration Desk
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Engineering documentation, calibration, and field diagnostics.
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-400 leading-relaxed">
            Access technical operating procedures or submit a direct inquiry to our certified
            automotive, generator, and hydraulic engineering team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Technical Manuals & Live Assistance Cards (Pearl White) */}
          <div className="lg:col-span-5 space-y-4">
            {TECHNICAL_GUIDES.map((guide) => {
              const isExpanded = activeGuideId === guide.id;
              return (
                <div
                  key={guide.id}
                  className="bg-[#F7F6F2] text-slate-950 border-2 border-slate-300/80 hover:border-amber-500 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-700 mb-1.5">
                    <span className="text-amber-700 font-semibold">{guide.category}</span>
                    <span className="font-mono tabular-nums text-slate-700">{guide.code}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-950">{guide.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-800 leading-relaxed">
                    {guide.summary}
                  </p>

                  {isExpanded && (
                    <div className="mt-4 pt-3.5 border-t border-slate-300/80 text-xs text-slate-800 space-y-1.5">
                      <p className="font-semibold text-slate-950">Quick Reference Summary:</p>
                      <p>
                        Recommended verification cycle: every 12 months or 5,000 operational
                        cycles under ISO/IEC 17025 standards. Contact our metrology desk for
                        printable calibration certificates.
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-600 font-mono">{guide.pages}</span>
                    <button
                      type="button"
                      onClick={() => setActiveGuideId(isExpanded ? null : guide.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:text-slate-950 bg-white hover:bg-slate-200/70 border border-slate-300 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{isExpanded ? 'Hide Summary' : 'View Brief'}</span>
                    </button>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Right Column: Validated Technical Ticket Form + Immediate Troubleshooting Card (Pearl White) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#F7F6F2] text-slate-950 border-2 border-slate-300/80 hover:border-amber-500 transition-colors duration-200 rounded-xl p-6 sm:p-8">
            {submittedTicket ? (
              <div className="py-8 text-center max-w-md mx-auto">
                <CheckCircle2
                  className="w-11 h-11 text-emerald-600 mx-auto mb-3"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-slate-950">
                  Technical Request Logged
                </h3>
                <p className="mt-2 text-sm text-slate-800">
                  Reference ID:{' '}
                  <span className="font-mono font-bold text-amber-700 tabular-nums">
                    {submittedTicket}
                  </span>
                </p>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  A specialist from our {category} engineering group will reply to{' '}
                  <span className="font-semibold text-slate-950">{email}</span> within 2
                  business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedTicket(null);
                    setMessage('');
                    setSerial('');
                  }}
                  className="mt-6 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    Submit a Technical Service Ticket
                  </h3>
                  <p className="text-xs text-slate-700 mt-1">
                    For warranty claims, NIST recalibration scheduling, or load bank sizing.
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="p-3 rounded-md bg-red-100 border border-red-400 text-xs font-medium text-red-900"
                  >
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="support-name"
                      className="block text-xs font-semibold text-slate-900 mb-1.5"
                    >
                      Contact Name
                    </label>
                    <input
                      id="support-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="support-email"
                      className="block text-xs font-semibold text-slate-900 mb-1.5"
                    >
                      Work Email
                    </label>
                    <input
                      id="support-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="service@company.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="support-category"
                      className="block text-xs font-semibold text-slate-900 mb-1.5"
                    >
                      Equipment Division
                    </label>
                    <select
                      id="support-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Car Spare Parts">Car Spare Parts</option>
                      <option value="Industrial Generator Spare Parts">
                        Industrial Generator Spare Parts
                      </option>
                      <option value="Heavy Machinery Parts">Heavy Machinery Parts</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="support-serial"
                      className="block text-xs font-semibold text-slate-900 mb-1.5"
                    >
                      Tool SKU / Serial (Optional)
                    </label>
                    <input
                      id="support-serial"
                      type="text"
                      value={serial}
                      onChange={(e) => setSerial(e.target.value)}
                      placeholder="e.g. VK-GN-500"
                      className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-md text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="support-message"
                    className="block text-xs font-semibold text-slate-900 mb-1.5"
                  >
                    Technical Inquiry Details
                  </label>
                  <textarea
                    id="support-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe operating conditions, voltage/torque range, or calibration needs..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 resize-y"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Submit Technical Request
                  </button>
                </div>
              </form>
            )}
            </div>

            <div className="bg-[#F7F6F2] text-slate-950 border-2 border-slate-300/80 hover:border-amber-500 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5">
              <div>
                <h3 className="text-sm font-bold text-slate-950">
                  Need immediate troubleshooting?
                </h3>
                <p className="text-xs text-slate-700 mt-1">
                  Connect directly with our live service desk for wiring or torque specs.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onOpenChatWithTopic('I need technical support for torque or generator setup.')
                }
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Open Support Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
