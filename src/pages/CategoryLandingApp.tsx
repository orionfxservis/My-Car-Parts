import { useCallback, useMemo, useState } from 'react';
import { ArrowRight, Check, Mail, MessageCircle, Plus } from 'lucide-react';
import { CookieBanner, CookiePreferences } from '../components/CookieBanner';
import { Footer } from '../components/Footer';
import { LiveChatBubble } from '../components/LiveChatBubble';
import { Navbar } from '../components/Navbar';
import { QuoteDrawer } from '../components/QuoteDrawer';
import { SafeImage } from '../components/SafeImage';
import { ToolDetailModal } from '../components/ToolDetailModal';
import {
  CATEGORY_CARDS,
  TOOL_INVENTORY,
  ToolCategory,
  ToolItem,
} from '../data/inventory';

const COOKIE_STORAGE_KEY = 'my_car_parts_cookie_consent';
const QUOTE_STORAGE_KEY = 'my_car_parts_quote_ids';

interface CategoryPageConfig {
  navTitle: string;
  eyebrow: string;
  h1: string;
  lead: string;
  whatsappText: string;
  emailSubject: string;
  subCategoriesTitle: string;
  subCategoriesDesc: string;
  subCategories: {
    badge: string;
    scope: string;
    title: string;
    description: string;
    verifyLabel: string;
    subject: string;
  }[];
  guideHeading: string;
  guideParagraphs: { heading?: string; text: string }[];
  checklistTitle: string;
  checklist: string[];
  enquiryTitle: string;
  enquirySubtitle: string;
}

const PAGE_CONFIGS: Record<ToolCategory, CategoryPageConfig> = {
  cars: {
    navTitle: 'Car Spare Parts',
    eyebrow: 'Auto Parts Supplier · Car Spare Parts, Auto Parts & Engine Components',
    h1: 'Car Spare Parts, Auto Parts & Engine Components',
    lead: 'My Car Parts supplies vehicle owners, mechanical workshops, and commercial fleet service bays with dependable car spare parts, auto parts, and engine components alongside calibrated workshop tooling. Every enquiry is verified by OEM part number or VIN for accurate fitment and current dispatch availability.',
    whatsappText:
      'Hello My Car Parts, please check Car Spare Parts availability and pricing.',
    emailSubject: 'Car Spare Parts Enquiry',
    subCategoriesTitle: 'Automotive Spare Parts & Engine Component Categories',
    subCategoriesDesc:
      'Supporting routine vehicle servicing, braking maintenance, suspension repair, and powertrain rebuilds through verified workshop instruments and enquiry-confirmed auto parts.',
    subCategories: [
      {
        badge: 'CATEGORY 01',
        scope: 'Engine Components',
        title: 'Engine Spare Parts & Fastening',
        description:
          'Replacement engine components, cylinder head gaskets, timing assembly parts, seals, and precision torque-to-yield fastening instruments for drivetrain rebuilds.',
        verifyLabel: 'Verify by OEM Code / VIN',
        subject: 'Engine Components Enquiry',
      },
      {
        badge: 'CATEGORY 02',
        scope: 'Brakes & Filters',
        title: 'Brake Pads, Rotors & Filters',
        description:
          'Service-grade brake pads, rotors, oil, air, cabin, and fuel filters, paired with dial runout gauges engineered to verify disc flatness and prevent brake pulsation.',
        verifyLabel: 'Verify by Make & Year',
        subject: 'Brake & Filter Auto Parts Enquiry',
      },
      {
        badge: 'CATEGORY 03',
        scope: 'Chassis & OBD-II',
        title: 'Car Suspension & Diagnostic Auto Parts',
        description:
          'Control arm bushings, tie-rod ends, wheel hub hardware, and bi-directional CAN-FD / DoIP telemetry tablets for ABS bleeding, injector coding, and fault tracing.',
        verifyLabel: 'Verify by Chassis Code',
        subject: 'Suspension & Diagnostic Auto Parts Enquiry',
      },
    ],
    guideHeading: 'How We Verify Auto Parts & Engine Component Compatibility',
    guideParagraphs: [
      {
        text: 'Ordering car spare parts or internal engine components without confirming model-year revisions, engine displacement, or fastener tolerances often causes costly workshop delays. Rather than publishing unverified universal fitment guesses, My Car Parts cross-checks your vehicle details before confirming pricing or dispatch.',
      },
      {
        heading: 'What to Include in Your Car Spare Parts Enquiry',
        text: 'Whether you need engine components, brake pads and filtration kits, suspension parts, or calibrated diagnostic equipment, sharing your OEM part number, VIN or chassis code, engine code, and manufacturing year helps our specialists confirm exact stock status and lead times in one clear quote.',
      },
      {
        heading: 'Built for Independent Garages, Fleet Bays & Vehicle Owners',
        text: 'Automotive repair centers count on repeatable torque calibration and modern J2534/CAN-FD diagnostic coverage, while fleet operators require dependable scheduling for recurring wear auto parts. Our sales desk handles single-part requests and bulk workshop orders, supported by our after-sales engineering desk at aftersale@mycarparts.pk.',
      },
    ],
    checklistTitle: 'Pre-Order Compatibility Checklist',
    checklist: [
      'Vehicle make, model, variant, and manufacturing year',
      'OEM part number or photo of the stamped component',
      'VIN / chassis number or engine code for cross-reference',
      'Required quantity and preferred delivery location',
    ],
    enquiryTitle: 'Ready to verify stock or request a car spare parts quote?',
    enquirySubtitle:
      'Message our auto parts desk on WhatsApp or email your part list for same-day availability confirmation.',
  },
  generators: {
    navTitle: 'Industrial Generator Spare Parts',
    eyebrow: 'Power Generation Supply · Diesel Engines, Alternators & Testing',
    h1: 'Industrial Generator Spare Parts, Diesel Engine Components & Load Testing Systems',
    lead: 'My Car Parts supports commercial facilities, standby power contractors, and prime-power operators with industrial diesel generator spare parts, alternator and governor control assemblies, and calibrated testing instrumentation. Submit your generator set nameplate or engine serial details for verified part matching and stock status.',
    whatsappText:
      'Hello My Car Parts, please check Industrial Generator Spare Parts availability and pricing.',
    emailSubject: 'Industrial Generator Spare Parts Enquiry',
    subCategoriesTitle: 'Industrial Diesel Generator Parts & Maintenance Coverage',
    subCategoriesDesc:
      'Reliable standby and continuous power depends on matched engine internals, stable excitation regulation, and scheduled preventive load testing.',
    subCategories: [
      {
        badge: 'DIVISION 01',
        scope: 'Prime Mover',
        title: 'Generator Engine & Filter Parts',
        description:
          'Diesel engine maintenance consumables, fuel/oil/water-separator filters, gaskets, belts, water pumps, and cooling-circuit spares verified against your engine build list.',
        verifyLabel: 'Verify by Engine Serial',
        subject: 'Generator Engine Parts Enquiry',
      },
      {
        badge: 'DIVISION 02',
        scope: 'Electrical End',
        title: 'Alternator Spare Parts & AVRs',
        description:
          'Automatic Voltage Regulators (AVRs), rotating rectifier diode bridges, exciter components, governor speed controllers, and 1000V insulated switchgear service tools.',
        verifyLabel: 'Verify by Alternator Model',
        subject: 'Alternator & AVR Parts Enquiry',
      },
      {
        badge: 'DIVISION 03',
        scope: 'Commissioning',
        title: 'Load Banks & Generator Accessories',
        description:
          'Portable three-phase resistive load banks for wet-stacking prevention, ATS transfer panel accessories, magnetic pickup sensors, and synchronous speed meters.',
        verifyLabel: 'Verify by Voltage & Hz',
        subject: 'Load Bank & Accessories Enquiry',
      },
    ],
    guideHeading: 'Accurate Fitment for Prime & Standby Diesel Generators',
    guideParagraphs: [
      {
        text: 'Industrial generator assemblies combine diesel prime movers, brushless alternators, electronic governors, and automatic voltage regulators—often customized by canopy builder and production batch. Even when two gensets share the same kVA rating, filter housings, diode bridges, and magnetic pickups can differ.',
      },
      {
        heading: 'Verified Nameplate Cross-Referencing',
        text: 'To protect buyers from mismatched electrical or engine components, My Car Parts verifies every industrial generator spare parts request against your engine serial number, alternator frame/AVR code, operating voltage (e.g., 400V 50 Hz or 480V 60 Hz), and existing part reference before confirming stock or quoting lead time.',
      },
      {
        heading: 'Maintenance, Load Testing & After-Sales Assistance',
        text: 'Whether scheduling planned oil-and-filter maintenance, replacing a failed AVR or rectifier bridge, or commissioning standby sets with a 50 kW load bank, our team provides responsive commercial quotations and wiring/calibration documentation.',
      },
    ],
    checklistTitle: 'Details to Share for Generator Parts',
    checklist: [
      'Generator rated kVA / kW, voltage (208V / 400V / 480V), and 50/60 Hz',
      'Diesel engine serial plate / build list number',
      'Alternator frame model and AVR part number (if ordering electrical spares)',
      'Required filter codes, sensor thread size, or test equipment SKU',
    ],
    enquiryTitle: 'Need industrial generator parts or load bank pricing?',
    enquirySubtitle:
      'Send your generator nameplate photo or part list on WhatsApp for fast verification and quotation.',
  },
  machinery: {
    navTitle: 'Heavy Machinery Parts',
    eyebrow: 'Earthmoving & Construction · Excavator, JCB & Hydraulic Machinery Parts',
    h1: 'Heavy Machinery Parts: Excavator, JCB & Hydraulic Construction Components',
    lead: 'My Car Parts supplies construction contractors, quarry maintenance yards, and earthmoving fleet teams with excavator, JCB, and heavy construction machinery parts alongside 700-bar hydraulic service systems. Every enquiry is cross-checked by machine serial plate and OEM part code for verified fitment.',
    whatsappText:
      'Hello My Car Parts, please check Heavy Machinery, Excavator & Hydraulic Parts availability.',
    emailSubject: 'Heavy Machinery & Excavator Parts Enquiry',
    subCategoriesTitle: 'Excavator, JCB & Hydraulic Construction Machinery Categories',
    subCategoriesDesc:
      'Engineered for excavators, JCB backhoe loaders, wheel loaders, dozers, and rock crushers operating under high hydraulic pressure and heavy structural loads.',
    subCategories: [
      {
        badge: 'DIVISION 01',
        scope: 'Fluid Power',
        title: 'Hydraulic Spare Parts & Cylinder Seals',
        description:
          'Hydraulic cylinder seal kits, gland spanners, high-pressure gauges, and ram overhaul fixtures built for excavator boom, arm, bucket, and lift cylinders up to 700 Bar.',
        verifyLabel: 'Verify by Bore & Rod Size',
        subject: 'Hydraulic Spare Parts Enquiry',
      },
      {
        badge: 'DIVISION 02',
        scope: 'Excavator & JCB',
        title: 'Excavator, JCB & Undercarriage Parts',
        description:
          'Track pin extraction equipment, final drive sprocket pullers, pivot pins, bushings, and loader/excavator wear hardware verified against your machine serial plate.',
        verifyLabel: 'Verify by Machine Serial',
        subject: 'Excavator & JCB Parts Enquiry',
      },
      {
        badge: 'DIVISION 03',
        scope: 'Construction Plant',
        title: 'Construction Machinery Torque Systems',
        description:
          'Continuous-rotation planetary hydraulic torque multipliers for M24–M64 slew-ring fasteners, crusher liners, and structural construction machinery assemblies.',
        verifyLabel: 'Verify by Fastener Size',
        subject: 'Construction Machinery Torque Enquiry',
      },
    ],
    guideHeading: 'Verified Fitment for Excavator, JCB & Construction Machinery',
    guideParagraphs: [
      {
        text: 'Unplanned downtime on an excavator, JCB loader, or quarry crusher halts an entire site. When rebuilding a final drive, extracting seized track pins, or resealing high-pressure hydraulic rams, service teams require properly rated 700-bar hydraulic tooling and exact OEM-matched replacement parts.',
      },
      {
        heading: 'Checking Serial Numbers & Hydraulic Dimensions Before Dispatch',
        text: 'Construction machinery frequently undergoes mid-series cylinder, pin, and hydraulic valve revisions across serial ranges. Before confirming stock or pricing on excavator, JCB, or general heavy machinery spare parts, My Car Parts cross-checks your machine model, serial prefix, bore/rod measurements, or OEM part number.',
      },
      {
        heading: 'Stock Availability, Lead Times & Technical Support',
        text: 'Items marked In Stock ship promptly once compatibility is confirmed, while specialized planetary torque assemblies marked Built to Order carry confirmed lead schedules in your formal quote. Reach our sales desk at sales@mycarparts.pk or technical desk at aftersale@mycarparts.pk.',
      },
    ],
    checklistTitle: 'Pre-Enquiry Machine Information',
    checklist: [
      'Machine brand/type (excavator, JCB backhoe, loader) and serial prefix',
      'OEM part code or physical dimensions (pin diameter, gland OD, drive size)',
      'Required hydraulic working pressure or bolt torque target',
      'Project site location for freight & dispatch scheduling',
    ],
    enquiryTitle: 'Looking for excavator, JCB, or hydraulic machinery parts?',
    enquirySubtitle:
      'Share your machine model, serial plate, or part number on WhatsApp for same-day verification.',
  },
};

const PAGE_PATHS: Record<ToolCategory, string> = {
  cars: './car-parts.html',
  generators: './generator-parts.html',
  machinery: './heavy-machinery-parts.html',
};

interface CategoryLandingAppProps {
  category: ToolCategory;
}

export function CategoryLandingApp({ category }: CategoryLandingAppProps) {
  const config = PAGE_CONFIGS[category];
  const divisionCard = useMemo(
    () => CATEGORY_CARDS.find((c) => c.id === category)!,
    [category],
  );
  const categoryTools = useMemo(
    () => TOOL_INVENTORY.filter((item) => item.category === category),
    [category],
  );

  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [quoteIds, setQuoteIds] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem(QUOTE_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [quoteDrawerOpen, setQuoteDrawerOpen] = useState(false);
  const [chatExternalPrompt, setChatExternalPrompt] = useState<string | null>(null);
  const [cookieBannerVisible, setCookieBannerVisible] = useState<boolean>(() => {
    try {
      return !window.localStorage.getItem(COOKIE_STORAGE_KEY);
    } catch {
      return true;
    }
  });

  const saveQuoteIds = useCallback((updater: (prev: string[]) => string[]) => {
    setQuoteIds((prev) => {
      const next = updater(prev);
      try {
        window.localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const quoteItems = useMemo(
    () => TOOL_INVENTORY.filter((item) => quoteIds.includes(item.id)),
    [quoteIds],
  );

  const handleToggleQuote = useCallback(
    (tool: ToolItem) => {
      saveQuoteIds((prev) =>
        prev.includes(tool.id) ? prev.filter((id) => id !== tool.id) : [...prev, tool.id],
      );
    },
    [saveQuoteIds],
  );

  const handleRemoveQuoteItem = useCallback(
    (id: string) => {
      saveQuoteIds((prev) => prev.filter((item) => item !== id));
    },
    [saveQuoteIds],
  );

  const handleClearQuote = useCallback(() => {
    saveQuoteIds(() => []);
  }, [saveQuoteIds]);

  const handleCookieDismiss = useCallback((prefs: CookiePreferences) => {
    try {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage errors
    }
    setCookieBannerVisible(false);
  }, []);

  const handleNavigateCategory = useCallback((target: ToolCategory) => {
    window.location.href = PAGE_PATHS[target];
  }, []);

  const relatedCategories = (Object.keys(PAGE_PATHS) as ToolCategory[]).filter(
    (c) => c !== category,
  );

  return (
    <div id="top" className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar
        basePath=".."
        activeCategory={category}
        centerTitle={config.navTitle}
        backToMainHref="../index.html"
        quoteCount={quoteItems.length}
        onSelectCategory={handleNavigateCategory}
        onOpenQuote={() => setQuoteDrawerOpen(true)}
      />

      <main className="flex-1 bg-white">
        {/* Hero Band matching white inner-page theme */}
        <section className="bg-white border-b border-slate-200 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
            <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-5">
              <a href="../index.html" className="hover:text-[#0284C7] transition-colors">
                Home
              </a>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              <span className="text-slate-900 font-medium">{config.navTitle}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-6">
                <p className="text-xs sm:text-sm font-semibold text-amber-700 tracking-wide mb-3">
                  {config.eyebrow}
                </p>
                <h1
                  className="text-slate-950 font-bold tracking-tight leading-[1.08]"
                  style={{
                    fontSize: 'clamp(1.95rem, 3.05vw, 3.1rem)',
                    textWrap: 'balance',
                  }}
                >
                  {config.h1}
                </h1>
                <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                  {config.lead}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={`https://wa.me/923002183149?text=${encodeURIComponent(config.whatsappText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Enquire on WhatsApp (+92 300 2183149)</span>
                  </a>
                  <a
                    href={`mailto:sales@mycarparts.pk?subject=${encodeURIComponent(config.emailSubject)}`}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors whitespace-nowrap"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    <span>Email sales@mycarparts.pk</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-xs transition-colors duration-200 bg-white">
                  <SafeImage
                    src={
                      divisionCard.image.startsWith('./assets/')
                        ? `../${divisionCard.image.slice(2)}`
                        : divisionCard.image
                    }
                    alt={config.h1}
                    fallbackLabel={config.navTitle}
                    className={`w-full h-full ${
                      category === 'generators' ? 'object-cover' : 'object-contain p-3'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Categories Section */}
        <section className="bg-slate-50/70 py-16 sm:py-20 border-b border-slate-200">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
            <div className="max-w-2xl mb-10">
              <h2
                className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                {config.subCategoriesTitle}
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                {config.subCategoriesDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {config.subCategories.map((sub) => (
                <article
                  key={sub.title}
                  className="flex flex-col justify-between bg-white text-slate-900 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 p-6"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs mb-2">
                      <span className="font-semibold text-amber-700">{sub.badge}</span>
                      <span className="font-mono text-slate-500">{sub.scope}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-950">{sub.title}</h3>
                    <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-slate-600">{sub.verifyLabel}</span>
                    <a
                      href={`mailto:sales@mycarparts.pk?subject=${encodeURIComponent(sub.subject)}`}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap"
                    >
                      Check Availability
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Verified Inventory & Tooling Section */}
        <section className="bg-white py-16 sm:py-20 border-b border-slate-200">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div className="max-w-2xl">
                <h2
                  className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Featured {config.navTitle} Systems (Verified Specifications)
                </h2>
                <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                  Inspect verified tolerances, unit pricing in Rs, and add equipment directly to
                  your commercial quote basket.
                </p>
              </div>
              <a
                href="../index.html#categories"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0284C7] hover:text-sky-700 whitespace-nowrap"
              >
                <span>Explore All Equipment Divisions</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {categoryTools.map((tool) => {
                const inQuote = quoteIds.includes(tool.id);
                return (
                  <article
                    key={tool.id}
                    className="flex flex-col justify-between bg-white text-slate-900 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden hover:-translate-y-0.5"
                  >
                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedTool(tool)}
                        className="block w-full aspect-[4/3] overflow-hidden bg-slate-100 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
                      >
                        <SafeImage
                          src={tool.image}
                          alt={tool.name}
                          fallbackLabel={tool.name}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
                        />
                      </button>

                      <div className="p-6">
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-600 mb-2">
                          <span className="font-mono font-bold text-amber-700">{tool.sku}</span>
                          <span
                            className={`font-semibold ${
                              tool.availability === 'In Stock'
                                ? 'text-emerald-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {tool.availability}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-950 leading-snug">
                          <button
                            type="button"
                            onClick={() => setSelectedTool(tool)}
                            className="text-left hover:text-[#0284C7] transition-colors cursor-pointer"
                          >
                            {tool.name}
                          </button>
                        </h3>

                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                          {tool.shortDesc}
                        </p>

                        <dl className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                          {tool.specs.map((spec) => (
                            <div
                              key={spec.label}
                              className="flex items-center justify-between gap-3 text-xs"
                            >
                              <dt className="text-slate-500 font-medium">{spec.label}</dt>
                              <dd className="font-mono tabular-nums font-semibold text-slate-900 text-right">
                                {spec.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <span className="block text-[11px] font-medium text-slate-500">
                          Unit List Price
                        </span>
                        <span className="font-mono tabular-nums text-base font-bold text-slate-950">
                          Rs {tool.price.toLocaleString('en-US')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedTool(tool)}
                          className="px-3 py-2 text-xs font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          Specs
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleQuote(tool)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            inQuote
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          }`}
                        >
                          {inQuote ? (
                            <>
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>In Quote</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Add to Quote</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Buyer Verification & Related Divisions Section */}
        <section className="bg-slate-50/70 py-16 sm:py-20">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-7 space-y-4">
                <h2
                  className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  {config.guideHeading}
                </h2>
                {config.guideParagraphs.map((para, idx) => (
                  <div key={idx} className="space-y-1.5">
                    {para.heading && (
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 pt-2">
                        {para.heading}
                      </h3>
                    )}
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {para.text}
                    </p>
                  </div>
                ))}
              </div>

              <aside className="lg:col-span-5 space-y-5">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                  <h3 className="text-base font-bold text-slate-950 mb-3">
                    {config.checklistTitle}
                  </h3>
                  <ul className="space-y-2.5 text-sm text-slate-600 list-disc pl-5">
                    {config.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                  <h3 className="text-base font-bold text-slate-950 mb-3">
                    Explore Related Divisions
                  </h3>
                  <ul className="space-y-2.5 text-sm">
                    {relatedCategories.map((rel) => (
                      <li key={rel}>
                        <a
                          href={PAGE_PATHS[rel]}
                          className="text-[#0284C7] hover:text-sky-700 font-medium underline underline-offset-4 transition-colors"
                        >
                          {PAGE_CONFIGS[rel].navTitle} →
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        href="../index.html#technical-support"
                        className="text-[#0284C7] hover:text-sky-700 font-medium underline underline-offset-4 transition-colors"
                      >
                        Technical Support &amp; Calibration Manuals →
                      </a>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>

            {/* Direct Enquiry Callout Band */}
            <div className="mt-12 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-950">{config.enquiryTitle}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{config.enquirySubtitle}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href={`https://wa.me/923002183149?text=${encodeURIComponent(config.whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>WhatsApp +92 300 2183149</span>
                </a>
                <a
                  href={`mailto:sales@mycarparts.pk?subject=${encodeURIComponent(config.emailSubject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors whitespace-nowrap"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>sales@mycarparts.pk</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer basePath=".." compact />

      <ToolDetailModal
        tool={selectedTool}
        inQuote={selectedTool ? quoteIds.includes(selectedTool.id) : false}
        onClose={() => setSelectedTool(null)}
        onToggleQuote={handleToggleQuote}
      />

      <QuoteDrawer
        open={quoteDrawerOpen}
        items={quoteItems}
        onClose={() => setQuoteDrawerOpen(false)}
        onRemoveItem={handleRemoveQuoteItem}
        onClearItems={handleClearQuote}
      />

      <LiveChatBubble
        externalPrompt={chatExternalPrompt}
        onConsumeExternalPrompt={() => setChatExternalPrompt(null)}
        cookieBannerVisible={cookieBannerVisible}
      />

      <CookieBanner visible={cookieBannerVisible} onDismiss={handleCookieDismiss} />
    </div>
  );
}
