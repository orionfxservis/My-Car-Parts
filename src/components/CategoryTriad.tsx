import { ArrowRight } from 'lucide-react';
import { CATEGORY_CARDS, CategoryCardData } from '../data/inventory';
import { resolveAssetUrl } from '../lib/cmsValidation';
import { SafeImage } from './SafeImage';

interface CategoryTriadProps {
  cards?: CategoryCardData[];
}

export function CategoryTriad({ cards = CATEGORY_CARDS }: CategoryTriadProps) {
  return (
    <section
      id="categories"
      className="bg-[#0D1015] py-16 sm:py-20 border-b border-slate-800/70"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <h2
              className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Core Equipment &amp; Tooling Divisions
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-400 leading-relaxed">
              Three specialized industrial lines engineered for workshop bays, prime power
              generation stations, and heavy earthmoving operations.
            </p>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono tabular-nums whitespace-nowrap">
            9 Core Systems · NIST &amp; IEC Calibrated
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => {
            const pageHref =
              card.id === 'cars'
                ? './pages/car-parts.html'
                : card.id === 'generators'
                  ? './pages/generator-parts.html'
                  : './pages/heavy-machinery-parts.html';
            return (
              <article
                key={card.id}
                className="group flex flex-col justify-between bg-[#F7F6F2] text-slate-950 rounded-xl border-2 border-slate-300/80 transition-all duration-200 overflow-hidden hover:-translate-y-0.5 hover:border-amber-500"
              >
                <div>
                  <div className="aspect-[16/9] w-full overflow-hidden bg-white relative">
                    <SafeImage
                      src={resolveAssetUrl(card.image, '.')}
                      alt={card.title}
                      fallbackLabel={card.title}
                      className={`w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
                        card.id === 'generators' ? 'object-cover' : 'object-contain p-2'
                      }`}
                    />
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-semibold text-amber-700 mb-1.5">
                      {card.indexLabel}
                    </p>
                    <h3 className="text-xl font-bold text-slate-950 tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-600 mt-1">
                      {card.subtitle}
                    </p>
                    <p className="mt-3.5 text-sm text-slate-800 leading-relaxed">
                      {card.description}
                    </p>

                    <dl className="mt-5 pt-4 border-t border-slate-300/80 space-y-2.5">
                      {card.highlights.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between gap-4 text-xs"
                        >
                          <dt className="text-slate-600 font-medium">{item.label}</dt>
                          <dd className="font-mono tabular-nums font-semibold text-slate-950 text-right">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <a
                    href={pageHref}
                    className="w-full inline-flex items-center justify-between px-4 py-2.5 text-sm font-semibold rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors whitespace-nowrap"
                  >
                    <span>More Details</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
