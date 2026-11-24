import { FormEvent, useState } from 'react';
import { CheckCircle2, Mail, MessageCircle, ShieldCheck, X } from 'lucide-react';

interface EnquiryModalProps {
  open: boolean;
  divisionTitle: string;
  placeholderHint?: string;
  onClose: () => void;
}

export function EnquiryModal({
  open,
  divisionTitle,
  onClose,
}: EnquiryModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const resetForm = () => {
    setCompanyName('');
    setContactName('');
    setLocation('');
    setCountry('');
    setEmail('');
    setMobile('');
    setRequirements('');
    setIsHumanVerified(false);
    setErrorMessage(null);
    setSubmitted(false);
  };

  const handleClose = () => {
    setErrorMessage(null);
    setSubmitted(false);
    onClose();
  };

  const buildStructuredMessage = () =>
    [
      `Division: ${divisionTitle}`,
      `Name of Company: ${companyName.trim()}`,
      `Contact Person Name: ${contactName.trim()}`,
      `Address/City/Location: ${location.trim()}`,
      `Country: ${country.trim()}`,
      `Email: ${email.trim()}`,
      `Mobile Number: ${mobile.trim()}`,
      `Requirement Details: ${requirements.trim()}`,
    ].join('\n');

  const buildWhatsappHref = () => {
    const msg = `Hello My Car Parts,\n${buildStructuredMessage()}`;
    return `https://wa.me/923002183149?text=${encodeURIComponent(msg)}`;
  };

  const buildEmailHref = () => {
    const subject = `${divisionTitle} Enquiry — ${companyName.trim() || contactName.trim()}`;
    return `mailto:sales@mycarparts.pk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Hello My Car Parts team,\n\n${buildStructuredMessage()}\n`,
    )}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !companyName.trim() ||
      !contactName.trim() ||
      !location.trim() ||
      !country.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !requirements.trim()
    ) {
      setErrorMessage('Please fill in all required (*) fields before sending your enquiry.');
      return;
    }
    if (!isHumanVerified) {
      setErrorMessage('Please confirm the "I\'m not a robot" verification checkbox.');
      return;
    }
    setErrorMessage(null);
    setSubmitted(true);
  };

  const inputClass =
    'w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 transition-colors';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feel-free-enquire-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white text-slate-900 border border-slate-200 rounded-lg shadow-2xl p-6 sm:p-8 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close enquiry modal"
          className="absolute top-5 right-5 p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="mb-6 pr-8">
              <h2
                id="feel-free-enquire-title"
                className="text-2xl sm:text-[28px] font-bold text-slate-950 tracking-tight"
              >
                Feel Free To Enquire
              </h2>
              <p className="mt-1.5 text-sm text-slate-600">
                We welcome any question or requirement you may have for our products ({divisionTitle})
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-company" className="sr-only">
                    Name of Company *
                  </label>
                  <input
                    id="enquiry-company"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Name of Company *"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="enquiry-contact-person" className="sr-only">
                    Contact Person Name *
                  </label>
                  <input
                    id="enquiry-contact-person"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contact Person Name *"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="enquiry-location" className="sr-only">
                    Address/City/Location *
                  </label>
                  <input
                    id="enquiry-location"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Address/City/Location *"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="enquiry-country" className="sr-only">
                    Country *
                  </label>
                  <input
                    id="enquiry-country"
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country *"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="enquiry-email" className="sr-only">
                    Email *
                  </label>
                  <input
                    id="enquiry-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email *"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="enquiry-mobile" className="sr-only">
                    Mobile Number *
                  </label>
                  <input
                    id="enquiry-mobile"
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Mobile Number *"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="enquiry-details" className="sr-only">
                  Requirement Details *
                </label>
                <textarea
                  id="enquiry-details"
                  required
                  rows={5}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Requirement Details *"
                  className={inputClass}
                />
              </div>

              {/* Human Verification Box */}
              <div className="pt-1">
                <label
                  htmlFor="enquiry-robot-check"
                  className="inline-flex items-center justify-between gap-6 w-full sm:w-[300px] px-4 py-3 bg-slate-50 border border-slate-300 rounded-md cursor-pointer select-none hover:border-slate-400 transition-colors"
                >
                  <span className="inline-flex items-center gap-3">
                    <input
                      id="enquiry-robot-check"
                      type="checkbox"
                      checked={isHumanVerified}
                      onChange={(e) => {
                        setIsHumanVerified(e.target.checked);
                        if (e.target.checked) setErrorMessage(null);
                      }}
                      className="w-5 h-5 rounded-xs border-slate-400 accent-amber-500 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-800">
                      I&apos;m not a robot
                    </span>
                  </span>

                  <span className="flex flex-col items-center text-[10px] text-slate-500 leading-tight">
                    <ShieldCheck
                      className={`w-6 h-6 ${
                        isHumanVerified ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                      aria-hidden="true"
                    />
                    <span>Verification</span>
                  </span>
                </label>
              </div>

              {errorMessage && (
                <p role="alert" className="text-xs sm:text-sm font-medium text-red-600">
                  {errorMessage}
                </p>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  Send Message
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-4 space-y-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Enquiry Prepared for {divisionTitle}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Thank you, {contactName}. Send your enquiry directly to our sales desk via
                  WhatsApp or Email below for same-day pricing and stock confirmation.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-xs sm:text-sm text-slate-700 space-y-1">
              <p>
                <span className="font-semibold text-slate-900">Company:</span> {companyName}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Location:</span> {location}, {country}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Contact:</span> {email} · {mobile}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Requirements:</span> {requirements}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={buildWhatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Send via WhatsApp</span>
              </a>
              <a
                href={buildEmailHref()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Send via Email</span>
              </a>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors cursor-pointer"
              >
                New Enquiry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
