import { useMemo, useState } from 'react';
import { Check, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { TOOL_INVENTORY, ToolCategory, ToolItem } from '../data/inventory';
import { SafeImage } from './SafeImage';

interface ToolsCatalogProps {
  activeCategory: ToolCategory | 'all';
  onChangeCategory: (category: ToolCategory | 'all') => void;
  quoteIds: string[];
  onToggleQuote: (tool: ToolItem) => void;
  onInspectTool: (tool: ToolItem) => void;
}

const FILTER_OPTIONS: { id: ToolCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Tools' },
  { id: 'cars', label: 'Car Parts' },
  { id: 'generators', label: 'Generators Parts' },
  { id: 'machinery', label: 'Heavy Machinery Equipments' },
];

export function ToolsCatalog({
  activeCategory,
  onChangeCategory,
  quoteIds,
  onToggleQuote,
  onInspectTool,
}: ToolsCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return TOOL_INVENTORY.filter((tool) => {
      const matchesCat = activeCategory === 'all' || tool.category === activeCategory;
      if (!matchesCat) return false;
      if (!query) return true;
      return (
        tool.name.toLowerCase().includes(query) ||
        tool.sku.toLowerCase().includes(query) ||
        tool.shortDesc.toLowerCase().includes(query) ||
        tool.categoryLabel.toLowerCase().includes(query)
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <section
      id="tools-catalog"
      className="bg-[#12161E] py-16 sm:py-20 border-b border-slate-800/70"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Equipment Inventory &amp; Tool Specifications
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
              Inspect technical tolerances, operating ranges, and unit pricing across our
              active catalog. Add tools to a quote request or open full engineering sheets.
            </p>
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SKU or tool name..."
              aria-label="Search tools by SKU or name"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#1A202B] border border-slate-700/90 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Interactive Category Segmented Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-800/80">
          <div
            role="tablist"
            aria-label="Tool category filter"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#1A202B] border border-slate-800 rounded-lg"
          >
            {FILTER_OPTIONS.map((opt) => {
              const isActive = activeCategory === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onChangeCategory(opt.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-[#232B39]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span>
              Showing {filteredTools.length} of {TOOL_INVENTORY.length} systems
            </span>
          </div>
        </div>

        {/* Catalog Grid or Empty State */}
        {filteredTools.length === 0 ? (
          <div className="bg-[#F7F6F2] text-slate-950 border-2 border-slate-300/80 hover:border-amber-500 transition-colors rounded-xl p-10 text-center">
            <p className="text-base font-semibold text-slate-950">
              No tools match &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-sm text-slate-700 mt-1.5">
              Clear the search filter or switch to All Tools to inspect our full inventory.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onChangeCategory('all');
              }}
              className="mt-5 px-4 py-2 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredTools.map((tool) => {
              const inQuote = quoteIds.includes(tool.id);
              return (
                <article
                  key={tool.id}
                  className="flex flex-col justify-between bg-[#F7F6F2] text-slate-950 rounded-xl border-2 border-slate-300/80 hover:border-amber-500 transition-all duration-200 overflow-hidden hover:-translate-y-0.5"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => onInspectTool(tool)}
                      className="block w-full aspect-[4/3] overflow-hidden bg-slate-900 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    >
                      <SafeImage
                        src={tool.image}
                        alt={tool.name}
                        fallbackLabel={tool.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
                      />
                    </button>

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-700 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-amber-700 font-semibold truncate">
                            {tool.categoryLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums text-slate-700 shrink-0">
                            {tool.sku}
                          </span>
                        </div>
                        <span
                          className={`shrink-0 font-semibold ${
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
                          onClick={() => onInspectTool(tool)}
                          className="text-left hover:text-amber-700 transition-colors cursor-pointer"
                        >
                          {tool.name}
                        </button>
                      </h3>

                      <p className="mt-2 text-sm text-slate-800 leading-relaxed">
                        {tool.shortDesc}
                      </p>

                      <dl className="mt-4 pt-4 border-t border-slate-300/80 space-y-2">
                        {tool.specs.slice(0, 2).map((spec) => (
                          <div
                            key={spec.label}
                            className="flex items-center justify-between gap-3 text-xs"
                          >
                            <dt className="text-slate-600 font-medium">{spec.label}</dt>
                            <dd className="font-mono tabular-nums font-semibold text-slate-950 text-right">
                              {spec.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-slate-300/70 flex items-center justify-between gap-3">
                    <div>
                      <span className="block text-[11px] font-medium text-slate-600">
                        Unit List Price
                      </span>
                      <span className="font-mono tabular-nums text-base font-bold text-slate-950">
                        Rs {tool.price.toLocaleString('en-US')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onInspectTool(tool)}
                        className="px-3 py-2 text-xs font-semibold text-slate-900 hover:text-slate-950 bg-white hover:bg-slate-200/70 border border-slate-300 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Specs
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleQuote(tool)}
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
        )}
      </div>
    </section>
  );
}
