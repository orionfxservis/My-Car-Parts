import { FormEvent, useState } from 'react';
import { CheckCircle2, FileText, MessageCircle, Smartphone, Wrench } from 'lucide-react';
import {
  DEFAULT_ADMIN_MOBILE_NO,
  DEFAULT_SITE_SECTIONS,
  EquipmentDivisionOption,
  SiteSectionData,
  submitTechnicalInquiry,
} from '../lib/cmsService';

interface TechnicalSupportProps {
  onOpenChatWithTopic: (topic: string) => void;
  section?: SiteSectionData;
}

interface SubmittedInquirySummary {
  ticketCode: string;
  adminMobileNo: string;
  contactName: string;
  mobileNo: string;
  equipmentDivision: EquipmentDivisionOption;
  partName: string;
  toolSkuSerial: string;
  technicalDetails: string;
}

function toWhatsappDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits || '923002183149';
}

export function TechnicalSupport({
  onOpenChatWithTopic,
  section = DEFAULT_SITE_SECTIONS['main-support'],
}: TechnicalSupportProps) {
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);
  const [contactName, setContactName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [equipmentDivision, setEquipmentDivision] =
    useState<EquipmentDivisionOption>('Car Spare Parts');
  const [partName, setPartName] = useState('');
  const [toolSkuSerial, setToolSkuSerial] = useState('');
  const [technicalDetails, setTechnicalDetails] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<SubmittedInquirySummary | null>(null);

  const guides =
    section.items.length > 0 ? section.items : DEFAULT_SITE_SECTIONS['main-support'].items;
  const configuredAdminMobile = (section.secondaryHeading || '').trim() || DEFAULT_ADMIN_MOBILE_NO;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');

    const cleanName = contactName.trim();
    const cleanMobile = mobileNo.trim();
    const cleanPart = partName.trim();
    const cleanSku = toolSkuSerial.trim();
    const cleanDetails = technicalDetails.trim();
    const mobileDigits = cleanMobile.replace(/\D/g, '');

    if (!cleanName) {
      setError('Please enter your Contact Name.');
      return;
    }
    if (!/^[+\d\s\-()]{7,32}$/.test(cleanMobile) || mobileDigits.length < 7) {
      setError('Please enter a valid Mobile No (e.g. +92 300 1234567).');
      return;
    }
    if (!cleanPart) {
      setError('Please enter the required Part Name.');
      return;
    }
    if (cleanDetails.length < 5) {
      setError('Please provide Technical Inquiry Details (min 5 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const saved = await submitTechnicalInquiry({
        contactName: cleanName,
        mobileNo: cleanMobile,
        equipmentDivision,
        partName: cleanPart,
        toolSkuSerial: cleanSku,
        technicalDetails: cleanDetails,
        adminMobileNo: configuredAdminMobile,
      });

      setSubmittedInquiry({
        ticketCode: saved.ticketCode,
        adminMobileNo: saved.adminMobileNo,
        contactName: cleanName,
        mobileNo: cleanMobile,
        equipmentDivision,
        partName: cleanPart,
        toolSkuSerial: cleanSku,
        technicalDetails: cleanDetails,
      });
    } catch {
      setError('Could not send your inquiry right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const buildInquiryMessageText = (inq: SubmittedInquirySummary) =>
    [
      `New Inquiry Mail (${inq.ticketCode})`,
      `Contact Name: ${inq.contactName}`,
      `Mobile No: ${inq.mobileNo}`,
      `Equipment Division: ${inq.equipmentDivision}`,
      `Part Name: ${inq.partName}`,
      ...(inq.toolSkuSerial ? [`Tool SKU / Serial No: ${inq.toolSkuSerial}`] : []),
      `Technical Inquiry Details: ${inq.technicalDetails}`,
    ].join('\n');

  return (
    <section
      id="technical-support"
      className="bg-[#12161E] py-16 sm:py-20 border-b border-slate-800/70"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="max-w-2xl mb-10">
          <p className="text-xs sm:text-sm font-medium text-amber-400 mb-2">
            {section.eyebrow}
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            {section.heading}
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-400 leading-relaxed">
            {section.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Technical Manuals & Live Assistance Cards (Pearl White) */}
          <div className="lg:col-span-5 space-y-4">
            {guides.map((guide) => {
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
            {submittedInquiry ? (
              <div className="py-6 text-center max-w-lg mx-auto">
                <CheckCircle2
                  className="w-11 h-11 text-emerald-600 mx-auto mb-3"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-slate-950">
                  New Inquiry Mail Sent
                </h3>
                <p className="mt-2 text-sm text-slate-800">
                  Reference ID:{' '}
                  <span className="font-mono font-bold text-amber-700 tabular-nums">
                    {submittedInquiry.ticketCode}
                  </span>
                </p>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  Your inquiry notification has been delivered to our{' '}
                  <span className="font-semibold text-slate-950">
                    {submittedInquiry.equipmentDivision}
                  </span>{' '}
                  admin desk and formatted for admin mobile{' '}
                  <span className="font-mono font-semibold text-slate-950">
                    {submittedInquiry.adminMobileNo}
                  </span>
                  .
                </p>

                <div className="mt-4 p-3.5 rounded-lg bg-white border border-slate-300 text-left text-xs text-slate-800 space-y-1">
                  <p className="font-bold text-amber-700">New Inquiry Mail</p>
                  <p>
                    <span className="font-semibold">Contact Name:</span>{' '}
                    {submittedInquiry.contactName}
                  </p>
                  <p>
                    <span className="font-semibold">Mobile No:</span>{' '}
                    {submittedInquiry.mobileNo}
                  </p>
                  <p>
                    <span className="font-semibold">Equipment Division:</span>{' '}
                    {submittedInquiry.equipmentDivision}
                  </p>
                  <p>
                    <span className="font-semibold">Part Name:</span>{' '}
                    {submittedInquiry.partName}
                  </p>
                  {submittedInquiry.toolSkuSerial && (
                    <p>
                      <span className="font-semibold">Tool SKU / Serial No:</span>{' '}
                      <span className="font-mono">{submittedInquiry.toolSkuSerial}</span>
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Details:</span>{' '}
                    {submittedInquiry.technicalDetails}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                  <a
                    href={`https://wa.me/${toWhatsappDigits(submittedInquiry.adminMobileNo)}?text=${encodeURIComponent(
                      buildInquiryMessageText(submittedInquiry),
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Send to Admin WhatsApp ({submittedInquiry.adminMobileNo})</span>
                  </a>
                  <a
                    href={`sms:${submittedInquiry.adminMobileNo.replace(/\s+/g, '')}?body=${encodeURIComponent(
                      buildInquiryMessageText(submittedInquiry),
                    )}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors whitespace-nowrap"
                  >
                    <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Send SMS to Admin Mobile</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedInquiry(null);
                      setPartName('');
                      setToolSkuSerial('');
                      setTechnicalDetails('');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-200/70 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
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
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="support-mobile"
                      className="block text-xs font-semibold text-slate-900 mb-1.5"
                    >
                      Mobile No
                    </label>
                    <input
                      id="support-mobile"
                      type="tel"
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                      placeholder="+92 300 1234567"
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
                      value={equipmentDivision}
                      onChange={(e) =>
                        setEquipmentDivision(e.target.value as EquipmentDivisionOption)
                      }
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
                      htmlFor="support-part-name"
                      className="block text-xs font-semibold text-slate-900 mb-1.5"
                    >
                      Part Name
                    </label>
                    <input
                      id="support-part-name"
                      type="text"
                      value={partName}
                      onChange={(e) => setPartName(e.target.value)}
                      placeholder="e.g. Fuel Injector / Brake Pads"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="support-serial"
                    className="block text-xs font-semibold text-slate-900 mb-1.5"
                  >
                    Tool SKU / Serial No (Optional)
                  </label>
                  <input
                    id="support-serial"
                    type="text"
                    value={toolSkuSerial}
                    onChange={(e) => setToolSkuSerial(e.target.value)}
                    placeholder="e.g. VK-GN-500"
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-md text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                  />
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
                    value={technicalDetails}
                    onChange={(e) => setTechnicalDetails(e.target.value)}
                    placeholder="Describe operating conditions, voltage/torque range, or calibration needs..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 resize-y"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {submitting ? 'Sending Inquiry...' : 'Submit Technical Request'}
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
