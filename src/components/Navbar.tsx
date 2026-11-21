import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ToolCategory } from '../data/inventory';

interface NavbarProps {
  quoteCount: number;
  onSelectCategory: (category: ToolCategory) => void;
  onOpenQuote: () => void;
}

export function Navbar({ quoteCount, onSelectCategory, onOpenQuote }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCategoryClick = (category: ToolCategory) => {
    setMobileOpen(false);
    onSelectCategory(category);
  };

  const handleSectionScroll = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0D1015]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Logo */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="My Car Parts Home"
          className="inline-flex items-center shrink-0 bg-[#F7F6F2] rounded-md px-2.5 py-1 border border-slate-300/80 hover:border-amber-500 transition-colors"
        >
          <img
            src="./assets/aistudio/my-car-parts-logo_b8556d44.png"
            alt="My Car Parts"
            className="h-9 sm:h-10 w-auto object-contain"
          />
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          <button
            type="button"
            onClick={() => handleCategoryClick('cars')}
            className="hover:text-white underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Car Parts
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick('generators')}
            className="hover:text-white underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Generators Parts
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick('machinery')}
            className="hover:text-white underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Heavy Machinery Equipments
          </button>
          <button
            type="button"
            onClick={() => handleSectionScroll('company')}
            className="hover:text-white underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Company
          </button>
          <button
            type="button"
            onClick={() => handleSectionScroll('technical-support')}
            className="hover:text-white underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Technical Support
          </button>
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
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
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden bg-[#131720] border-b border-slate-800 px-4 py-4 space-y-1"
        >
          <button
            type="button"
            onClick={() => handleCategoryClick('cars')}
            className="w-full text-left px-3 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800/70 rounded-md transition-colors cursor-pointer"
          >
            Car Parts
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick('generators')}
            className="w-full text-left px-3 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800/70 rounded-md transition-colors cursor-pointer"
          >
            Generators Parts
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick('machinery')}
            className="w-full text-left px-3 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800/70 rounded-md transition-colors cursor-pointer"
          >
            Heavy Machinery Equipments
          </button>
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
