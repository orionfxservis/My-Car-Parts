import { DEFAULT_SITE_SECTIONS, SiteSectionData } from '../lib/cmsService';

interface CompanySectionProps {
  section?: SiteSectionData;
}

export function CompanySection({
  section = DEFAULT_SITE_SECTIONS['main-company'],
}: CompanySectionProps) {
  const standards =
    section.items.length > 0 ? section.items : DEFAULT_SITE_SECTIONS['main-company'].items;

  return (
    <section
      id="company"
      className="bg-[#0D1015] py-16 sm:py-20 border-b border-slate-800/70"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs sm:text-sm font-medium text-amber-400 mb-2">
              {section.eyebrow}
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {section.heading}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              {section.description}
            </p>
            {section.secondaryText && (
              <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
                {section.secondaryText}
              </p>
            )}
          </div>

          <div className="lg:col-span-7 divide-y divide-slate-800/80 border-t border-b border-slate-800/80">
            {standards.map((item, idx) => (
              <div key={item.id || idx} className="py-5 first:pt-4 last:pb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  <span className="font-mono text-amber-400 mr-2.5 tabular-nums">
                    {item.code || `0${idx + 1}.`}
                  </span>
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-300 leading-relaxed pl-0 sm:pl-9">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
