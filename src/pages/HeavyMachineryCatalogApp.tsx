import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, MessageCircle, X, ZoomIn } from 'lucide-react';
import { CookieBanner, CookiePreferences } from '../components/CookieBanner';
import { EnquiryModal } from '../components/EnquiryModal';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { SafeImage } from '../components/SafeImage';
import { MachineryPartItem } from '../data/machineryPartsCatalog';
import { resolveAssetUrl } from '../lib/cmsValidation';
import { useMachineryPartsCms } from '../lib/useStorefrontCms';

const COOKIE_STORAGE_KEY = 'my_car_parts_cookie_consent';
const CARDS_PER_VIEW = 16; // 4 cards per row x 4 rows
const ROW_STEP = 4; // Shift 1 row (4 cards) per arrow click so 4x4 grid stays populated

export function HeavyMachineryCatalogApp() {
  const { headerSection, items, groups } = useMachineryPartsCms();
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [startIndex, setStartIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MachineryPartItem | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isHoverZooming, setIsHoverZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [machineInput, setMachineInput] = useState('');
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
    const result: MachineryPartItem[] = [];
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

  const buildWhatsappHref = (item: MachineryPartItem) => {
    const machineNote = machineInput.trim()
      ? ` Machine / Serial / OEM details: ${machineInput.trim()}.`
      : '';
    const msg = `Hello My Car Parts, please check availability and pricing for ${item.title} (${item.subsystem}).${machineNote}`;
    return `https://wa.me/923002183149?text=${encodeURIComponent(msg)}`;
  };

  const buildEmailHref = (item: MachineryPartItem) => {
    const subject = `${item.title} — Heavy Machinery Parts Enquiry`;
    const body = machineInput.trim()
      ? `Hello My Car Parts team,\n\nPlease verify stock and pricing for: ${item.title} (${item.subsystem})\nMachine Model / Serial Prefix / OEM Code: ${machineInput.trim()}\n`
      : `Hello My Car Parts team,\n\nPlease verify stock and pricing for: ${item.title} (${item.subsystem})\n`;
    return `mailto:sales@mycarparts.pk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <ErrorBoundary>
      <div id="top" className="min-h-screen flex flex-col bg-white text-slate-900">
        <Navbar
          basePath=".."
          centerTitle="Heavy Machinery Parts"
          backToMainHref="../index.html"
          quoteCount={0}
          onSelectCategory={() => {}}
          onOpenQuote={() => {}}
          onOpenEnquiry={() => setEnquiryModalOpen(true)}
        />

        <main className="flex-1 bg-white">
          {/* Header & Image on Right Side */}
          <section className="bg-white border-b border-slate-200 pt-8 pb-12 sm:pt-12 sm:pb-16">
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                <div className="lg:col-span-6">
                  <p className="text-xs sm:text-sm font-semibold text-amber-700 tracking-wide mb-3">
                    {headerSection.eyebrow}
                  </p>
                  <h1
                    className="text-slate-950 font-bold tracking-tight leading-[1.08]"
                    style={{
                      fontSize: 'clamp(1.95rem, 3.05vw, 3.1rem)',
                      textWrap: 'balance',
                    }}
                  >
                    {headerSection.heading}
                  </h1>
                  <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                    {headerSection.description}
                  </p>
                </div>

                <div className="lg:col-span-6">
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-xs transition-colors duration-200 bg-white">
                    <SafeImage
                      src={resolveAssetUrl(
                        headerSection.image || '../assets/aistudio/image_11c6e947.png',
                        '..',
                      )}
                      alt={headerSection.heading}
                      fallbackLabel="Heavy Machinery Parts"
                      className="w-full h-full object-contain p-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

        {/* 4x4 Product Cards Grid with Left & Right Navigation Arrows (matching generator-parts.html) */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 sm:py-12">
          {/* Category Group Tabs (shown when Admin defines multiple machinery groups) */}
          {groups.length > 1 && (
            <div
              role="tablist"
              aria-label="Heavy machinery parts groups"
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

          <section
            aria-label="Heavy machinery spare parts catalog"
            className="relative"
          >
            {totalItems > CARDS_PER_VIEW && (
              <button
                type="button"
                onClick={() => handleStep(-1)}
                aria-label="Previous heavy machinery parts"
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
                {visibleItems.map((item) => {
                  const photoCount =
                    item.images && item.images.length > 0 ? item.images.length : item.image ? 1 : 0;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setMachineInput('');
                        setActiveImageIdx(0);
                        setIsHoverZooming(false);
                        setSelectedItem(item);
                      }}
                      className="group bg-white border border-slate-200 hover:border-amber-500/70 hover:shadow-md rounded-lg px-5 py-6 flex flex-col items-center justify-between gap-4 transition-all duration-150 hover:-translate-y-0.5 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
                    >
                      <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-white overflow-hidden rounded-md">
                        <img
                          src={resolveAssetUrl(item.image, '..')}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className={
                            item.cover
                              ? 'w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-125'
                              : 'max-h-full max-w-full object-contain transition-transform duration-200 ease-out group-hover:scale-125'
                          }
                        />
                        <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute top-1.5 right-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900/75 text-white text-[10px] font-medium">
                          <ZoomIn className="w-3 h-3 text-amber-400" aria-hidden="true" />
                          <span>Zoom</span>
                        </span>
                      </div>

                      <div className="text-center space-y-1">
                        <span className="block text-sm sm:text-[15px] font-semibold text-slate-900 group-hover:text-slate-950 leading-snug">
                          {item.title}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {item.subsystem}
                        </span>
                        {photoCount > 1 && (
                          <span className="block text-[10px] text-slate-500 font-mono tabular-nums">
                            {photoCount} Photos
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {totalItems > CARDS_PER_VIEW && (
              <button
                type="button"
                onClick={() => handleStep(1)}
                aria-label="Next heavy machinery parts"
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-800 hover:text-slate-950 hover:bg-slate-50 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
          </section>

          {/* Horizontal Dash Indicators for Card Carousel */}
          {totalItems > CARDS_PER_VIEW && (
            <div
              className="mt-6 flex items-center justify-center gap-2"
              role="tablist"
              aria-label="Select heavy machinery parts view"
            >
              {pageStops.map((stop, idx) => {
                const isCurrent = startIndex === stop;
                return (
                  <button
                    key={stop}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    aria-label={`Show heavy machinery parts set ${idx + 1}`}
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

      {/* Heavy Machinery Part Details & Serial Verification Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="machinery-part-modal-title"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-lg bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Heavy Machinery Parts · {selectedItem.subsystem}
                </p>
                <h2
                  id="machinery-part-modal-title"
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

            <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
              {(() => {
                const gallery =
                  selectedItem.images && selectedItem.images.length > 0
                    ? selectedItem.images.slice(0, 10)
                    : selectedItem.image
                      ? [selectedItem.image]
                      : [];
                const safeIdx = Math.min(activeImageIdx, Math.max(0, gallery.length - 1));
                const activeSrc = gallery[safeIdx] ? resolveAssetUrl(gallery[safeIdx], '..') : '';
                const handleZoomMove = (e: MouseEvent<HTMLDivElement>) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  if (!rect.width || !rect.height) return;
                  const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                  const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
                  setZoomOrigin({ x, y });
                };
                return (
                  <div className="space-y-3">
                    <div
                      onMouseEnter={() => activeSrc && setIsHoverZooming(true)}
                      onMouseMove={handleZoomMove}
                      onMouseLeave={() => setIsHoverZooming(false)}
                      className="relative aspect-[16/10] w-full rounded-lg border border-slate-200 bg-white flex items-center justify-center p-3 overflow-hidden cursor-zoom-in"
                    >
                      {activeSrc && (
                        <>
                          <img
                            src={activeSrc}
                            alt={selectedItem.title}
                            referrerPolicy="no-referrer"
                            style={{
                              transform: isHoverZooming ? 'scale(2.25)' : 'scale(1)',
                              transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                            }}
                            className="max-h-full max-w-full object-contain transition-transform duration-150 ease-out will-change-transform select-none"
                          />
                          <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/75 text-white text-[10px] font-medium">
                            <ZoomIn className="w-3 h-3 text-amber-400" aria-hidden="true" />
                            <span>{isHoverZooming ? 'Zoomed' : 'Hover to Zoom'}</span>
                          </span>
                        </>
                      )}
                    </div>
                    {gallery.length > 1 && (
                      <div className="grid grid-cols-5 gap-1.5">
                        {gallery.map((thumb, idx) => (
                          <button
                            key={`${idx}-${thumb.slice(0, 20)}`}
                            type="button"
                            onClick={() => setActiveImageIdx(idx)}
                            onMouseEnter={() => setActiveImageIdx(idx)}
                            className={`aspect-[4/3] rounded border bg-white p-1 flex items-center justify-center overflow-hidden cursor-zoom-in ${
                              idx === safeIdx
                                ? 'border-amber-500 ring-2 ring-amber-400/35'
                                : 'border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            <img
                              src={resolveAssetUrl(thumb, '..')}
                              alt={`${selectedItem.title} view ${idx + 1}`}
                              referrerPolicy="no-referrer"
                              className="max-h-full max-w-full object-contain"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {selectedItem.summary}
                    </p>
                  </div>
                );
              })()}

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
                  htmlFor="machinery-fitment-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Machine Make / Model / Serial Prefix or OEM Part Number (optional)
                </label>
                <input
                  id="machinery-fitment-input"
                  type="text"
                  value={machineInput}
                  onChange={(e) => setMachineInput(e.target.value)}
                  placeholder="e.g. CAT 320D · Komatsu PC200-8 · JCB 3CX · OEM code"
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
        divisionTitle="Heavy Machinery Parts"
        placeholderHint="e.g. CAT 320D · Komatsu PC200-8 · JCB 3CX · OEM code"
        onClose={() => setEnquiryModalOpen(false)}
      />

      <CookieBanner visible={cookieBannerVisible} onDismiss={handleCookieDismiss} />
      </div>
    </ErrorBoundary>
  );
}
