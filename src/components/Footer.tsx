import { FormEvent, useState } from 'react';
import {
  CheckCircle2,
  Headphones,
  Landmark,
  Mail,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';

type ModalDocType =
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'manuals'
  | 'software'
  | 'warranty'
  | 'training'
  | 'faq'
  | 'news'
  | 'distributor'
  | null;

const MODAL_DOCS: Record<
  Exclude<ModalDocType, null>,
  { title: string; subtitle: string; sections: { heading: string; body: string }[] }
> = {
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Effective November 2026',
    sections: [
      {
        heading: '1. Commercial & Technical Data Collected',
        body: 'My Car Parts Ltd. collects contact names, business email addresses, equipment SKUs, and technical support ticket details solely to process commercial quotations, NIST calibration records, and warranty assistance.',
      },
      {
        heading: '2. Data Retention & Protection',
        body: 'We do not sell or lease customer contact records to third-party brokers. Equipment serial calibration logs are retained for the active service life of the registered tool.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    subtitle: 'Effective November 2026',
    sections: [
      {
        heading: '1. Industrial Equipment & Calibration Compliance',
        body: 'All automotive, generator, and heavy machinery tooling must be operated within rated torque, dielectric voltage (IEC 60900), and hydraulic pressure (700 Bar max) limits specified in the supplied technical manual.',
      },
      {
        heading: '2. Quotations & Commercial Freight',
        body: 'Formal commercial quotations remain valid for 30 calendar days. Ex-Works dispatch schedules depend on regional depot availability and hazardous hydraulic fluid freight compliance.',
      },
    ],
  },
  cookies: {
    title: 'Cookies Policy',
    subtitle: 'Effective November 2026',
    sections: [
      {
        heading: '1. Essential Session Preferences',
        body: 'This website uses strictly necessary browser storage to preserve your active quote list and category selection during your session.',
      },
      {
        heading: '2. Managing Browser Preferences',
        body: 'You may clear or restrict local storage and cookies at any time via your browser privacy settings without losing access to our public product specifications.',
      },
    ],
  },
  manuals: {
    title: 'Manual Downloads & Technical Sheets',
    subtitle: 'Engineering Reference Library',
    sections: [
      {
        heading: 'Automotive Torque & Telemetry Series (VK-AT)',
        body: 'Includes digital angle wrench calibration charts, 6-point impact socket torque limits, and J2534 pass-through wiring guides.',
      },
      {
        heading: 'Power Generation & Hydraulic Series (VK-GN / VK-HM)',
        body: 'Covers LB-5000 three-phase Camlock step-load wiring, IEC 60900 dielectric inspection intervals, and 700-bar hydraulic puller safety tolerances.',
      },
    ],
  },
  software: {
    title: 'Software & Firmware Updates',
    subtitle: 'Diagnostic Terminal Release Notes',
    sections: [
      {
        heading: 'VK-AT-905 Telemetry Tablet — Firmware v4.12',
        body: 'Adds 2026 CAN-FD and DoIP vehicle coverage for light-commercial hybrid drivetrains and expands 4-channel oscilloscope trigger presets.',
      },
      {
        heading: 'LB-5000 Load Bank Logger — Utility v2.4',
        body: 'Provides CSV harmonic export and automated AVR voltage-droop step timing reports over USB-C.',
      },
    ],
  },
  warranty: {
    title: 'Warranty Policy',
    subtitle: 'Industrial Tooling & Metrology Coverage',
    sections: [
      {
        heading: 'Structural Forgings & Hand Tools',
        body: 'Forged chrome-vanadium sockets, 4140 gland wrenches, and hydraulic puller jaws carry a 5-Year to Lifetime structural warranty against material defects.',
      },
      {
        heading: 'Electronic Diagnostics & Load Analyzers',
        body: 'Diagnostic tablets, load banks, and digital torque sensors are covered for 3 years, including factory NIST-traceable recalibration turnaround within 72 hours.',
      },
    ],
  },
  training: {
    title: 'Training Videos & Field Procedures',
    subtitle: 'Technician Onboarding Modules',
    sections: [
      {
        heading: 'Module 01: Wet-Stacking Burn-Off with 50 kW Load Banks',
        body: 'Demonstrates progressive 25% / 50% / 75% / 100% step-loading on standby diesel generators to clear unburned carbon deposits safely.',
      },
      {
        heading: 'Module 02: 50-Ton Track Pin & Gear Extraction Setup',
        body: 'Covers reaction-frame centering, brass pressure gauge monitoring at 700 Bar, and zero-shock bearing removal on quarry excavators.',
      },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Ordering, Calibration & Freight',
    sections: [
      {
        heading: 'Are torque tools shipped with calibration certificates?',
        body: 'Yes. Every digital torque wrench and hydraulic pressure gauge ships with a serialized ISO/IEC 17025 NIST-traceable multi-point certificate.',
      },
      {
        heading: 'What voltage standards do your generator load banks support?',
        body: 'Our LB-5000 supports 208V, 400V, and 480V three-phase connections at both 50 Hz and 60 Hz.',
      },
    ],
  },
  news: {
    title: 'News & Resources',
    subtitle: 'My Car Parts Bulletins',
    sections: [
      {
        heading: 'Rotterdam & Detroit Calibration Depots Expanded',
        body: 'Added 4 high-pressure 700-bar hydraulic test benches and automated 1000V dielectric verification rigs to cut fleet turnaround times to 24 hours.',
      },
      {
        heading: '2026 Heavy Quarry Tooling Line Released',
        body: 'New 4,200 Nm continuous-rotation planetary torque heads are now shipping for excavator slew-ring and crusher maintenance teams.',
      },
    ],
  },
  distributor: {
    title: 'Become A Distributor',
    subtitle: 'Authorized Regional Partner Program',
    sections: [
      {
        heading: 'Partner Requirements',
        body: 'We partner with established automotive equipment suppliers, generator service contractors, and heavy plant parts houses across North America, Europe, and MENA.',
      },
      {
        heading: 'Apply via Commercial Desk',
        body: 'Email your company profile and target territory to sales@mycarparts.pk or call +92 300 2183149 to speak with our channel team.',
      },
    ],
  },
};

interface FooterProps {
  basePath?: string;
  compact?: boolean;
}

export function Footer({ basePath = '.', compact = false }: FooterProps) {
  const [activeDoc, setActiveDoc] = useState<ModalDocType>(null);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const isSubpage = basePath !== '.';

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    setNewsletterError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim())) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setNewsletterSubscribed(true);
  };

  const scrollToSection = (id: string) => {
    if (isSubpage) {
      window.location.href = `${basePath}/index.html#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-[#111318] text-slate-300 border-t border-slate-800/90">
      <div
        className={`w-full px-4 sm:px-6 lg:px-10 xl:px-12 ${
          compact ? 'py-6' : 'py-12 sm:py-16'
        }`}
      >
        {!compact && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand & Socials */}
          <div className="lg:col-span-3 space-y-4">
            <a
              href={isSubpage ? `${basePath}/index.html` : '#top'}
              onClick={(e) => {
                if (!isSubpage) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              aria-label="My Car Parts Home"
              className="inline-flex items-center bg-[#F7F6F2] rounded-xl px-3.5 py-2 border-2 border-slate-300/80 hover:border-amber-500 transition-colors"
            >
              <img
                src={`${basePath}/assets/logo/my-car-parts-logo.png`}
                alt="My Car Parts"
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Engineered service tooling for commercial automotive workshops, standby power
              generators, and heavy earthmoving fleets.
            </p>
            <p className="text-xs text-slate-500">
              4400 Forge Parkway, Suite 300, Detroit, MI 48207
            </p>

            {/* Social Links */}
            <div className="pt-1 flex items-center gap-2.5">
              <a
                href="#social-linkedin"
                onClick={(e) => e.preventDefault()}
                aria-label="My Car Parts on LinkedIn"
                className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-[#181C23] border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
              <a
                href="#social-youtube"
                onClick={(e) => e.preventDefault()}
                aria-label="My Car Parts on YouTube"
                className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-[#181C23] border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                </svg>
              </a>
              <a
                href="#social-x"
                onClick={(e) => e.preventDefault()}
                aria-label="My Car Parts on X"
                className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-[#181C23] border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#social-instagram"
                onClick={(e) => e.preventDefault()}
                aria-label="My Car Parts on Instagram"
                className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-[#181C23] border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Support */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-5">Support</h3>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('technical-support')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Technical Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveDoc('manuals')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Manual Downloads
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveDoc('software')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Software Updates
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveDoc('warranty')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Warranty Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveDoc('training')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Training Videos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveDoc('faq')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-5">Company</h3>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('company')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About My Car Parts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveDoc('news')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  News &amp; Resources
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveDoc('distributor')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Become A Distributor
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('technical-support')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Get in touch */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-5">Get in touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-500 mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <span className="block text-[11px] font-medium tracking-wider text-slate-400">
                    BUSINESS
                  </span>
                  <a
                    href="mailto:sales@mycarparts.pk"
                    className="text-sm font-medium text-white hover:text-amber-400 transition-colors break-all"
                  >
                    sales@mycarparts.pk
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Headphones
                  className="w-4 h-4 text-amber-500 mt-1 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <span className="block text-[11px] font-medium tracking-wider text-slate-400">
                    AFTER-SALES
                  </span>
                  <a
                    href="mailto:aftersale@mycarparts.pk"
                    className="text-sm font-medium text-white hover:text-amber-400 transition-colors break-all"
                  >
                    aftersale@mycarparts.pk
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle
                  className="w-4 h-4 text-amber-500 mt-1 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <span className="block text-[11px] font-medium tracking-wider text-slate-400">
                    WHATSAPP
                  </span>
                  <a
                    href="tel:+923002183149"
                    className="text-sm font-medium font-mono tabular-nums text-white hover:text-amber-400 transition-colors"
                  >
                    +92 300 2183149
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-500 mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <span className="block text-[11px] font-medium tracking-wider text-slate-400">
                    PHONE
                  </span>
                  <a
                    href="tel:+923002183149"
                    className="text-sm font-medium font-mono tabular-nums text-white hover:text-amber-400 transition-colors"
                  >
                    +92 300 2183149
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 5 (Right Side): Newsletter Signup & Payment Methods */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-lg font-semibold text-white">Newsletter Signup</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Receive quarterly calibration advisories and new tool inventory releases.
            </p>
            <div className="pt-1">
              {newsletterSubscribed ? (
                <div className="flex items-start gap-2 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/40 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Subscribed {newsletterEmail} to quarterly advisories.
                  </span>
                </div>
              ) : !newsletterOpen ? (
                <button
                  type="button"
                  onClick={() => setNewsletterOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>Newsletter Signup</span>
                </button>
              ) : (
                <form onSubmit={handleNewsletterSubmit} noValidate className="space-y-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter work email..."
                    aria-label="Newsletter email address"
                    className="w-full px-3.5 py-2 text-sm bg-[#181C23] border border-slate-700 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                  {newsletterError && (
                    <p className="text-xs text-red-400">{newsletterError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Accepted Payment Mode Icons */}
            <div className="pt-4 border-t border-slate-800/80">
              <p className="text-xs font-medium text-slate-400 mb-2.5">
                Accepted Payment Methods
              </p>
              <div
                className="flex flex-wrap items-center gap-2"
                aria-label="Accepted payment methods"
              >
                {/* Visa Card */}
                <div
                  title="Visa Card"
                  className="inline-flex items-center justify-center h-9 px-3 rounded-md border border-amber-500 bg-[#161A22] hover:bg-[#1E2430] transition-colors"
                >
                  <svg
                    className="h-3.5 w-auto"
                    viewBox="0 0 48 16"
                    fill="none"
                    aria-label="Visa Card"
                  >
                    <path
                      d="M18.6 1.5L14.2 14.5H11.1L8.9 4.5C8.8 3.9 8.6 3.7 8.1 3.4C7.3 3 6 2.6 4.9 2.3L5 1.5H10C10.7 1.5 11.3 2 11.4 2.8L12.6 9.8L15.7 1.5H18.6ZM30.8 10.2C30.8 6.8 26.2 6.6 26.2 5.1C26.2 4.6 26.7 4.1 27.6 4C28.1 3.9 29.4 3.9 30.9 4.6L31.5 1.9C30.7 1.6 29.6 1.3 28.3 1.3C24.9 1.3 22.6 3.1 22.6 5.6C22.6 7.5 24.3 8.5 25.5 9.1C26.8 9.8 27.2 10.2 27.2 10.8C27.2 11.7 26.1 12.1 25.1 12.1C23.4 12.1 22.4 11.7 21.6 11.3L21 14.1C21.8 14.5 23.3 14.8 24.8 14.8C28.4 14.8 30.8 13 30.8 10.2ZM39.6 14.5H42.2L39.9 1.5H37.5C36.9 1.5 36.4 1.9 36.1 2.4L31.4 14.5H34.9L35.6 12.5H39.2L39.6 14.5ZM36.4 10L38 5.4L38.9 10H36.4ZM22.2 1.5L19.4 14.5H16.2L19 1.5H22.2Z"
                      fill="#F8FAFC"
                    />
                  </svg>
                </div>

                {/* Master Card */}
                <div
                  title="Master Card"
                  className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-md border border-amber-500 bg-[#161A22] hover:bg-[#1E2430] transition-colors"
                >
                  <svg
                    className="h-4 w-auto"
                    viewBox="0 0 28 18"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="10" cy="9" r="7" fill="#EB001B" />
                    <circle cx="18" cy="9" r="7" fill="#F79E1B" fillOpacity="0.9" />
                  </svg>
                  <span className="text-[11px] font-semibold text-white whitespace-nowrap">
                    Mastercard
                  </span>
                </div>

                {/* Easypaisa */}
                <div
                  title="Easypaisa"
                  className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-md border border-amber-500 bg-[#161A22] hover:bg-[#1E2430] transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center justify-center w-4 h-4 rounded-sm bg-emerald-500 text-slate-950 font-bold text-[10px]"
                  >
                    e
                  </span>
                  <span className="text-[11px] font-semibold text-white whitespace-nowrap">
                    Easypaisa
                  </span>
                </div>

                {/* JazzCash */}
                <div
                  title="JazzCash"
                  className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-md border border-amber-500 bg-[#161A22] hover:bg-[#1E2430] transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center justify-center w-4 h-4 rounded-sm bg-red-600 text-amber-300 font-bold text-[10px]"
                  >
                    J
                  </span>
                  <span className="text-[11px] font-semibold text-white whitespace-nowrap">
                    JazzCash
                  </span>
                </div>

                {/* Bank Transfer */}
                <div
                  title="Bank Transfer"
                  className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-md border border-amber-500 bg-[#161A22] hover:bg-[#1E2430] transition-colors"
                >
                  <Landmark className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                  <span className="text-[11px] font-semibold text-white whitespace-nowrap">
                    Bank Transfer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Bottom Copyright & Policy Links */}
        <div
          className={`${
            compact ? '' : 'pt-6 '
          }flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500`}
        >
          <p>
            © 2026 My Car Parts Ltd. All rights reserved.{' '}
            <span className="text-slate-400">· Designed &amp; Developed by Orion Fx.</span>
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`${basePath}/pages/car-parts.html`}
              className="hover:text-amber-400 transition-colors"
            >
              Car Spare Parts
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={`${basePath}/pages/generator-parts.html`}
              className="hover:text-amber-400 transition-colors"
            >
              Industrial Generator Spare Parts
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={`${basePath}/pages/heavy-machinery-parts.html`}
              className="hover:text-amber-400 transition-colors"
            >
              Heavy Machinery Parts
            </a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveDoc('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveDoc('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveDoc('cookies')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Cookies Policy
            </button>
          </div>
        </div>
      </div>

      {/* Resource & Legal Modal */}
      {activeDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-doc-title"
          onClick={() => setActiveDoc(null)}
        >
          <div
            className="w-full max-w-lg bg-[#161B24] border border-slate-700 rounded-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 id="footer-doc-title" className="text-lg font-bold text-white">
                  {MODAL_DOCS[activeDoc].title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {MODAL_DOCS[activeDoc].subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              {MODAL_DOCS[activeDoc].sections.map((sec) => (
                <div key={sec.heading}>
                  <h4 className="text-sm font-semibold text-slate-100">{sec.heading}</h4>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
