import { useCallback, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, MessageCircle, X } from 'lucide-react';
import { CookieBanner, CookiePreferences } from '../components/CookieBanner';
import { EnquiryModal } from '../components/EnquiryModal';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { PromoBannerCarousel } from '../components/PromoBannerCarousel';
import { GeneratorPartItem } from '../data/generatorPartsCatalog';
import { resolveAssetUrl } from '../lib/cmsValidation';
import { useGeneratorPartsCms } from '../lib/useStorefrontCms';

const COOKIE_STORAGE_KEY = 'my_car_parts_cookie_consent';
const CARDS_PER_VIEW = 16; // 4 cards per row x 4 rows
const ROW_STEP = 4; // Shift 1 row (4 cards) per arrow click so 4x4 grid stays completely populated

export function GeneratorPartsCatalogApp() {
  const { banners, items, groups } = useGeneratorPartsCms();
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [startIndex, setStartIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<GeneratorPartItem | null>(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [gensetInput, setGensetInput] = useState('');
  const [cookieBannerVisible, setCookieBannerVisible] = useState<boolean>(() => {
    try {
      return !window.localStorage.getItem(COOKIE_STORAGE_KEY);
    } catch {
      return true;
    }
  });

  const effectiveActiveGroup = useMemo(
    () =>
      activeGroup === 'all' || groups.some((g) => g.id === activeGroup)
        ? activeGroup
        : 'all',
    [groups, activeGroup],
  );

  const filteredItems = useMemo(
    () =>
      effectiveActiveGroup === 'all'
        ? items
        : items.filter((item) => (item.tab || 'catalog') === effectiveActiveGroup),
    [effectiveActiveGroup, items],
  );

  const totalItems = filteredItems.length;
  const pageStops = useMemo(() => {
    const stops: number[] = [];
    for (let i = 0; i < totalItems; i += ROW_STEP) {
      stops.push(i);
    }
    return stops;
  }, [totalItems]);

  const visibleItems = useMemo(() => {
    if (totalItems === 0) return [];
    const count = Math.min(CARDS_PER_VIEW, totalItems);
    const result: GeneratorPartItem[] = [];
    for (let i = 0; i < count; i++) {
      result.push(filteredItems[(startIndex + i) % totalItems]);
    }
    return result;
  }, [filteredItems, startIndex, totalItems]);

  const handleStep = useCallback(
    (direction: -1 | 1) => {
      if (totalItems === 0) return;
      setStartIndex((prev) => (prev + direction * ROW_STEP + totalItems) % totalItems);
    },
    [totalItems],
  );

  const handleCookieDismiss = useCallback((prefs: CookiePreferences) => {
    try {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage errors
    }
    setCookieBannerVisible(false);
  }, []);

  const buildWhatsappHref = (item: GeneratorPartItem) => {
    const gensetNote = gensetInput.trim()
      ? ` Genset / Engine serial details: ${gensetInput.trim()}.`
      : '';
    const msg = `Hello My Car Parts, please check availability and pricing for ${item.title} (${item.subsystem}).${gensetNote}`;
    return `https://wa.me/923002183149?text=${encodeURIComponent(msg)}`;
  };

  const buildEmailHref = (item: GeneratorPartItem) => {
    const subject = `${item.title} — Industrial Generator Spare Parts Enquiry`;
    const body = gensetInput.trim()
      ? `Hello My Car Parts team,\n\nPlease verify stock and pricing for: ${item.title} (${item.subsystem})\nGenerator kVA / Engine Serial / AVR details: ${gensetInput.trim()}\n`
      : `Hello My Car Parts team,\n\nPlease verify stock and pricing for: ${item.title} (${item.subsystem})\n`;
    return `mailto:sales@mycarparts.pk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <ErrorBoundary>
      <div id="top" className="min-h-screen flex flex-col bg-white text-slate-900">
        <Navbar
          basePath=".."
          centerTitle="Industrial Generator Spare Parts"
          backToMainHref="../index.html"
          quoteCount={0}
          onSelectCategory={() => {}}
          onOpenQuote={() => {}}
          onOpenEnquiry={() => setEnquiryModalOpen(true)}
        />

        <main className="flex-1 bg-white">
          <h1 className="sr-only">
            Industrial Generator Spare Parts, Diesel Engine Components &amp; Alternator Spares
          </h1>

          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-10">
            {/* Top Scrollable Service & Dispatch Banners */}
            <section
              aria-label="Generator service and dispatch highlights"
              className="mb-10 sm:mb-12"
            >
              <PromoBannerCarousel theme="light" banners={banners} basePath=".." />
            </section>

          {/* Category Group Tabs (shown when Admin defines multiple generator groups) */}
          {groups.length > 1 && (
            <div
              role="tablist"
              aria-label="Generator spare parts groups"
              className="flex items-center gap-6 sm:gap-8 border-b border-slate-200 mb-7 overflow-x-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={effectiveActiveGroup === 'all'}
                onClick={() => {
                  setActiveGroup('all');
                  setStartIndex(0);
                }}
                className={`pb-3 text-sm sm:text-[15px] whitespace-nowrap shrink-0 border-b-2 -mb-[1px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                  effectiveActiveGroup === 'all'
                    ? 'border-[#0284C7] text-slate-950 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                All Parts
              </button>
              {groups.map((tab) => {
                const isActive = effectiveActiveGroup === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveGroup(tab.id);
                      setStartIndex(0);
                    }}
                    className={`pb-3 text-sm sm:text-[15px] whitespace-nowrap shrink-0 border-b-2 -mb-[1px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                      isActive
                        ? 'border-[#0284C7] text-slate-950 font-semibold'
                        : 'border-transparent text-slate-500 hover:text-slate-900 font-medium'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* 4x4 Product Cards Grid with Left & Right Navigation Arrows */}
          <section
            aria-label="Industrial generator spare parts catalog"
            className="relative"
          >
            {totalItems > CARDS_PER_VIEW && (
              <button
                type="button"
                onClick={() => handleStep(-1)}
                aria-label="Previous generator spare parts"
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-800 hover:text-slate-950 hover:bg-slate-50 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
            )}

            {visibleItems.length === 0 ? (
              <div className="py-14 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-lg">
                No product cards added to this group yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {visibleItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setGensetInput('');
                      setSelectedItem(item);
                    }}
                    className="group bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-lg px-5 py-6 flex flex-col items-center justify-between gap-4 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
                  >
                    <div className="w-full aspect-[4/3] flex items-center justify-center bg-white overflow-hidden rounded-md">
                      <img
                        src={resolveAssetUrl(item.image, '..')}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className={
                          item.cover
                            ? 'w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.04]'
                            : 'max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.04]'
                        }
                      />
                    </div>

                    <div className="text-center space-y-1">
                      <span className="block text-sm sm:text-[15px] font-semibold text-slate-900 group-hover:text-slate-950 leading-snug">
                        {item.title}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {item.subsystem}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {totalItems > CARDS_PER_VIEW && (
              <button
                type="button"
                onClick={() => handleStep(1)}
                aria-label="Next generator spare parts"
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-800 hover:text-slate-950 hover:bg-slate-50 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
          </section>

          {/* Subtle Horizontal Dash Indicators for Card Carousel */}
          {totalItems > CARDS_PER_VIEW && (
            <div
              className="mt-6 flex items-center justify-center gap-2"
              role="tablist"
              aria-label="Select generator parts view"
            >
              {pageStops.map((stop, idx) => {
                const isCurrent = startIndex === stop;
                return (
                  <button
                    key={stop}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    aria-label={`Show generator parts set ${idx + 1}`}
                    onClick={() => setStartIndex(stop)}
                    className={`h-[3px] rounded-full transition-all duration-200 cursor-pointer ${
                      isCurrent
                        ? 'w-7 bg-slate-900'
                        : 'w-6 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer basePath=".." compact />

      {/* Generator Part Details & Nameplate Enquiry Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="generator-part-modal-title"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-lg bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Industrial Generator Spare Parts · {selectedItem.subsystem}
                </p>
                <h2
                  id="generator-part-modal-title"
                  className="text-lg font-bold text-slate-950"
                >
                  {selectedItem.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close details modal"
                className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-5">
                <div className="w-28 h-22 shrink-0 rounded-lg border border-slate-200 bg-white flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={resolveAssetUrl(selectedItem.image, '..')}
                    alt={selectedItem.title}
                    referrerPolicy="no-referrer"
                    className={
                      selectedItem.cover
                        ? 'w-full h-full object-cover rounded'
                        : 'max-h-full max-w-full object-contain'
                    }
                  />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedItem.summary}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Available Components
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
                  {selectedItem.components.map((comp) => (
                    <li key={comp}>{comp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <label
                  htmlFor="generator-fitment-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Generator kVA / Engine Serial / Alternator AVR Model (optional)
                </label>
                <input
                  id="generator-fitment-input"
                  type="text"
                  value={gensetInput}
                  onChange={(e) => setGensetInput(e.target.value)}
                  placeholder="e.g. Perkins 1104C-44TAG2 · 100 kVA · Stamford SX460"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={buildWhatsappHref(selectedItem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>WhatsApp Enquiry</span>
                </a>
                <a
                  href={buildEmailHref(selectedItem)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors whitespace-nowrap"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>Email Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <EnquiryModal
        open={enquiryModalOpen}
        divisionTitle="Industrial Generator Spare Parts"
        placeholderHint="e.g. Perkins 1104C · 100 kVA · Stamford SX460 AVR"
        onClose={() => setEnquiryModalOpen(false)}
      />

      <CookieBanner visible={cookieBannerVisible} onDismiss={handleCookieDismiss} />
      </div>
    </ErrorBoundary>
  );
}
