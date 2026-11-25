import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { HERO_INVENTORY_SLIDES, HeroSlideItem } from '../data/inventory';
import { DEFAULT_SITE_SECTIONS, SiteSectionData } from '../lib/cmsService';
import { resolveAssetUrl } from '../lib/cmsValidation';
import { SafeImage } from './SafeImage';

interface HeroMarqueeProps {
  onExploreCatalog: () => void;
  onInspectSlide: (slide: HeroSlideItem) => void;
  onOpenSupport: () => void;
  section?: SiteSectionData;
  slides?: HeroSlideItem[];
}

export function HeroMarquee({
  onExploreCatalog,
  onInspectSlide,
  onOpenSupport,
  section = DEFAULT_SITE_SECTIONS['main-hero'],
  slides = HERO_INVENTORY_SLIDES,
}: HeroMarqueeProps) {
  const [paused, setPaused] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const safeSlides = slides.length > 0 ? slides : HERO_INVENTORY_SLIDES;
  const boundedIndex = activeSlideIndex % safeSlides.length;

  // Automatic smooth crossfade dissolve across all HD inventory images
  useEffect(() => {
    if (paused || safeSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % safeSlides.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [paused, safeSlides.length]);

  const activeSlide = safeSlides[boundedIndex];
  // Duplicated seamlessly so translate3d(-50% -> 0%) scrolls smoothly left-to-right indefinitely
  const duplicatedSlides = [...safeSlides, ...safeSlides];

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) =>
      prev === 0 ? safeSlides.length - 1 : prev - 1,
    );
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % safeSlides.length);
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-[#0D1015] via-[#131821] to-[#161C26] border-b border-slate-800/70 pt-8 pb-12 sm:pt-12 sm:pb-16"
    >
      {/* Full-Width 2-Column Hero Split */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Side: Company Proposition & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-center py-2 lg:py-6">
            <p className="text-xs sm:text-sm font-medium text-amber-400 tracking-wide mb-3">
              {section.eyebrow}
            </p>
            <h1
              className="text-slate-50 font-bold tracking-tight leading-[1.08]"
              style={{
                fontSize: 'clamp(1.9rem, 2.9vw, 3rem)',
                textWrap: 'balance',
              }}
            >
              {section.heading}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {section.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreCatalog}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Browse Full Inventory</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onOpenSupport}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Technical Support Desk
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              {(section.stats.length > 0
                ? section.stats
                : DEFAULT_SITE_SECTIONS['main-hero'].stats
              ).map((stat, idx) => (
                <div key={idx}>
                  <p className="font-mono tabular-nums text-lg sm:text-xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: HD Multi-Image Crossfade / Dissolving Showcase */}
          <div className="lg:col-span-7 flex">
            <div className="relative w-full aspect-[16/10] lg:aspect-auto lg:min-h-[460px] xl:min-h-[520px] rounded-xl overflow-hidden border-2 border-slate-700/80 hover:border-amber-500 transition-colors duration-200 bg-[#12161F]">
              {safeSlides.map((slide, index) => {
                const isActive = index === boundedIndex;
                return (
                  <div
                    key={slide.id}
                    aria-hidden={!isActive}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <SafeImage
                      src={resolveAssetUrl(slide.image, '.')}
                      alt={slide.title}
                      fallbackLabel={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}

              {/* Measured Scrim for Legibility */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/30 to-black/15"
              />

              {/* Top-Right Dissolve Controls */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Previous equipment image"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-black/55 hover:bg-black/80 text-slate-200 hover:text-white border border-white/15 backdrop-blur-sm transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Next equipment image"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-black/55 hover:bg-black/80 text-slate-200 hover:text-white border border-white/15 backdrop-blur-sm transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Caption & Slide Switcher */}
              <div className="absolute inset-x-0 bottom-0 z-30 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                    <span className="font-semibold text-amber-400">
                      {activeSlide.categoryLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{activeSlide.sku}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-snug truncate">
                    {activeSlide.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-mono tabular-nums mt-0.5 truncate">
                    {activeSlide.specSummary}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero image slides">
                    {safeSlides.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        role="tab"
                        aria-selected={idx === boundedIndex}
                        aria-label={`Show ${slide.title}`}
                        onClick={() => setActiveSlideIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === boundedIndex
                            ? 'w-6 bg-amber-400'
                            : 'w-2.5 bg-white/35 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => onInspectSlide(activeSlide)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Inspect Specs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Continuous Left-to-Right 4K Inventory Showcase */}
      <div className="mt-10 sm:mt-12">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="font-medium text-slate-200">Full Inventory Collection</span>
            <span aria-hidden="true">·</span>
            <span>Continuous 4K Showcase (Click any system for specifications)</span>
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume inventory reel' : 'Pause inventory reel'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#1B212C] border border-slate-700/80 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {paused ? (
              <>
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Resume Showcase</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Pause Showcase</span>
              </>
            )}
          </button>
        </div>

        <div className="marquee-wrapper relative w-full overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 z-10 bg-gradient-to-r from-[#131821] to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 z-10 bg-gradient-to-l from-[#131821] to-transparent"
          />

          <div className={`animate-marquee-ltr ${paused ? 'is-paused' : ''}`}>
            {duplicatedSlides.map((slide, idx) => (
              <button
                key={`${slide.id}-${idx}`}
                type="button"
                onClick={() => onInspectSlide(slide)}
                className="group flex flex-col flex-shrink-0 w-[290px] sm:w-[370px] lg:w-[410px] mx-2.5 sm:mx-3 rounded-xl overflow-hidden border-2 border-slate-300/80 hover:border-amber-500 bg-[#F7F6F2] text-slate-950 text-left transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-900">
                  <SafeImage
                    src={resolveAssetUrl(slide.image, '.')}
                    alt={slide.title}
                    fallbackLabel={slide.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4 w-full">
                  <div className="flex items-center gap-2 text-xs text-slate-700 mb-1">
                    <span className="font-semibold text-amber-700">{slide.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums text-slate-700">{slide.sku}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 leading-snug truncate">
                    {slide.title}
                  </h3>
                  <p className="text-xs text-slate-700 mt-0.5 truncate font-mono tabular-nums">
                    {slide.specSummary}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Introductory Buyer Overview Below Main Banner */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-50 tracking-tight">
              {section.secondaryHeading}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-300 leading-relaxed">
              {section.secondaryText}{' '}
              Enquire directly via Live Support,{' '}
              <a
                href="mailto:sales@mycarparts.pk"
                className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
              >
                sales@mycarparts.pk
              </a>
              , or WhatsApp{' '}
              <a
                href="https://wa.me/923002183149"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline underline-offset-2 whitespace-nowrap"
              >
                +92 300 2183149
              </a>{' '}
              for immediate availability and pricing.
            </p>
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 text-xs sm:text-sm">
            {(section.items.length > 0
              ? section.items
              : DEFAULT_SITE_SECTIONS['main-hero'].items
            ).map((step) => (
              <div
                key={step.id}
                className="bg-[#1B212C] border border-slate-800 rounded-lg px-4 py-3"
              >
                <p className="font-semibold text-amber-400">{step.title}</p>
                <p className="text-slate-300 mt-0.5">{step.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
