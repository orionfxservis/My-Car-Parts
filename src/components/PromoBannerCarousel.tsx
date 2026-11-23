import { useCallback, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, MessageCircle, X } from 'lucide-react';
import { CAR_PROMO_BANNERS, CarPromoBanner } from '../data/carPartsCatalog';

interface PromoBannerCarouselProps {
  theme?: 'light' | 'dark';
}

export function PromoBannerCarousel({ theme = 'light' }: PromoBannerCarouselProps) {
  const [selectedBanner, setSelectedBanner] = useState<CarPromoBanner | null>(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const bannerTrackRef = useRef<HTMLDivElement | null>(null);

  const bannerSlides = useMemo(
    () => [...CAR_PROMO_BANNERS, CAR_PROMO_BANNERS[0]],
    [],
  );

  const getBannerStepWidth = () => {
    const track = bannerTrackRef.current;
    if (!track || track.children.length === 0) return 0;
    const firstCard = track.children[0] as HTMLElement;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '20') || 20;
    return firstCard.getBoundingClientRect().width + gap;
  };

  const scrollToBanner = useCallback((targetIndex: number) => {
    const total = CAR_PROMO_BANNERS.length;
    const normalized = ((targetIndex % total) + total) % total;
    setActiveBannerIndex(normalized);
    const track = bannerTrackRef.current;
    if (!track) return;
    const step = getBannerStepWidth();
    if (step > 0) {
      track.scrollTo({ left: normalized * step, behavior: 'smooth' });
    }
  }, []);

  const handleBannerScroll = useCallback(() => {
    const track = bannerTrackRef.current;
    if (!track) return;
    const step = getBannerStepWidth();
    if (step <= 0) return;
    const idx = Math.round(track.scrollLeft / step) % CAR_PROMO_BANNERS.length;
    setActiveBannerIndex(idx);
  }, []);

  const isDark = theme === 'dark';

  return (
    <>
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scrollToBanner(activeBannerIndex - 1)}
          aria-label="Previous banner"
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-800 hover:text-slate-950 hover:bg-slate-50 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Horizontal 2-Up Scroll Track */}
        <div
          ref={bannerTrackRef}
          onScroll={handleBannerScroll}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {bannerSlides.map((banner, idx) => (
            <button
              key={`${banner.id}-${idx}`}
              type="button"
              onClick={() => setSelectedBanner(banner)}
              className={`group relative shrink-0 w-full md:w-[calc(50%-10px)] h-[230px] sm:h-[260px] lg:h-[280px] rounded-lg overflow-hidden snap-start text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isDark ? 'border border-slate-800/80' : ''
              }`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug">
                  {banner.title}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {banner.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scrollToBanner(activeBannerIndex + 1)}
          aria-label="Next banner"
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-800 hover:text-slate-950 hover:bg-slate-50 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* 4 Horizontal Dash Indicators */}
      <div
        className="mt-4 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Select banner slide"
      >
        {CAR_PROMO_BANNERS.map((banner, idx) => {
          const isCurrent = activeBannerIndex === idx;
          return (
            <button
              key={banner.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              aria-label={`Show banner ${idx + 1}: ${banner.title}`}
              onClick={() => scrollToBanner(idx)}
              className={`h-[3px] rounded-full transition-all duration-200 cursor-pointer ${
                isCurrent
                  ? isDark
                    ? 'w-7 bg-amber-500'
                    : 'w-7 bg-slate-900'
                  : isDark
                    ? 'w-6 bg-slate-700 hover:bg-slate-500'
                    : 'w-6 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          );
        })}
      </div>

      {/* Banner Quick Enquiry Modal */}
      {selectedBanner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-banner-modal-title"
          onClick={() => setSelectedBanner(null)}
        >
          <div
            className="w-full max-w-md bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src={selectedBanner.image}
                alt={selectedBanner.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
              />
              <button
                type="button"
                onClick={() => setSelectedBanner(null)}
                aria-label="Close banner modal"
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-slate-800 hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 id="promo-banner-modal-title" className="text-lg font-bold text-white">
                  {selectedBanner.title}
                </h3>
                <p className="text-xs text-slate-200 mt-0.5">{selectedBanner.subtitle}</p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Contact our sales desk for {selectedBanner.enquiryTopic.toLowerCase()}, order
                assistance, or VIN/OEM part verification.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/923002183149?text=${encodeURIComponent(
                    `Hello My Car Parts, I have an enquiry regarding: ${selectedBanner.enquiryTopic}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>WhatsApp Desk</span>
                </a>
                <a
                  href={`mailto:sales@mycarparts.pk?subject=${encodeURIComponent(
                    selectedBanner.enquiryTopic,
                  )}`}
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
    </>
  );
}
