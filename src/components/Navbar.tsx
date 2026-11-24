import { useState } from 'react';
import { Mail, Menu, X } from 'lucide-react';
import { ToolCategory } from '../data/inventory';

interface NavbarProps {
  quoteCount: number;
  onSelectCategory?: (category: ToolCategory) => void;
  onOpenQuote: () => void;
  onOpenEnquiry?: () => void;
  basePath?: string;
  activeCategory?: ToolCategory;
  centerTitle?: string;
  backToMainHref?: string;
}

export function Navbar({
  quoteCount,
  onOpenQuote,
  onOpenEnquiry,
  basePath = '.',
  activeCategory,
  centerTitle,
  backToMainHref,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSubpage = basePath !== '.';
  const isMinimalSubpage = Boolean(centerTitle || backToMainHref);

  const categoryHref = (category: ToolCategory) => {
    if (category === 'cars') return `${basePath}/pages/car-parts.html`;
    if (category === 'generators') return `${basePath}/pages/generator-parts.html`;
    return `${basePath}/pages/heavy-machinery-parts.html`;
  };

  const handleSectionScroll = (id: string) => {
    setMobileOpen(false);
    if (isSubpage) {
      window.location.href = `${basePath}/index.html#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinkClass = (cat?: ToolCategory) =>
    `underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
      cat && activeCategory === cat
        ? 'text-amber-400 underline font-semibold'
        : 'hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-30 bg-[#0D1015]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="relative w-full px-4 sm:px-6 lg:px-10 xl:px-12 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Logo */}
        <a
          href={backToMainHref || (isSubpage ? `${basePath}/index.html` : '#top')}
          onClick={(e) => {
            if (!isSubpage && !backToMainHref) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          aria-label="My Car Parts Home"
          className="inline-flex items-center shrink-0 bg-[#F7F6F2] rounded-md px-2.5 py-1 border border-slate-300/80 hover:border-amber-500 transition-colors"
        >
          <img
            src={`${basePath}/assets/logo/my-car-parts-logo.png`}
            alt="My Car Parts"
            className="h-9 sm:h-10 w-auto object-contain"
          />
        </a>

        {/* Zone 2: Centered Title (minimal subpage) or Clean single-line navigation links */}
        {isMinimalSubpage ? (
          <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 min-w-0 px-2 text-center">
            <span className="block text-sm sm:text-base font-semibold text-white tracking-tight truncate whitespace-nowrap">
              {centerTitle}
            </span>
          </div>
        ) : (
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300"
          >
            <a
              href={categoryHref('cars')}
              className={navLinkClass('cars')}
            >
              Car Spare Parts
            </a>
            <a
              href={categoryHref('generators')}
              className={navLinkClass('generators')}
            >
              Industrial Generator Spare Parts
            </a>
            <a
              href={categoryHref('machinery')}
              className={navLinkClass('machinery')}
            >
              Heavy Machinery Parts
            </a>
            <button
              type="button"
              onClick={() => handleSectionScroll('company')}
              className={navLinkClass()}
            >
              Company
            </button>
            <button
              type="button"
              onClick={() => handleSectionScroll('technical-support')}
              className={navLinkClass()}
            >
              Technical Support
            </button>
          </nav>
        )}

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {backToMainHref ? (
            <>
              {onOpenEnquiry ? (
                <button
                  type="button"
                  onClick={onOpenEnquiry}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                  <span>Enquiry</span>
                </button>
              ) : (
                <a
                  href="mailto:sales@mycarparts.pk"
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap shrink-0"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                  <span>Enquiry</span>
                </a>
              )}
              <a
                href={backToMainHref}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                Back to Main
              </a>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onOpenQuote}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
              >
                {quoteCount > 0 ? `Request Quote (${quoteCount})` : 'Request Quote'}
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileOpen}
                className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-md border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden bg-[#131720] border-b border-slate-800 px-4 py-4 space-y-1"
        >
          <a
            href={categoryHref('cars')}
            onClick={() => setMobileOpen(false)}
            className={`block w-full text-left px-3 py-3 text-sm font-medium rounded-md transition-colors ${
              activeCategory === 'cars'
                ? 'bg-slate-800/90 text-amber-400 font-semibold'
                : 'text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            Car Spare Parts
          </a>
          <a
            href={categoryHref('generators')}
            onClick={() => setMobileOpen(false)}
            className={`block w-full text-left px-3 py-3 text-sm font-medium rounded-md transition-colors ${
              activeCategory === 'generators'
                ? 'bg-slate-800/90 text-amber-400 font-semibold'
                : 'text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            Industrial Generator Spare Parts
          </a>
          <a
            href={categoryHref('machinery')}
            onClick={() => setMobileOpen(false)}
            className={`block w-full text-left px-3 py-3 text-sm font-medium rounded-md transition-colors ${
              activeCategory === 'machinery'
                ? 'bg-slate-800/90 text-amber-400 font-semibold'
                : 'text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            Heavy Machinery Parts
          </a>
          <button
            type="button"
            onClick={() => handleSectionScroll('company')}
            className="w-full text-left px-3 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800/70 rounded-md transition-colors cursor-pointer"
          >
            Company Information
          </button>
          <button
            type="button"
            onClick={() => handleSectionScroll('technical-support')}
            className="w-full text-left px-3 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800/70 rounded-md transition-colors cursor-pointer"
          >
            Technical Support
          </button>
        </nav>
      )}
    </header>
  );
}
