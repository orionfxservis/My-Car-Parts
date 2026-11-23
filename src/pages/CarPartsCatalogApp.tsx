import { useCallback, useMemo, useState } from 'react';
import {
  BatteryCharging,
  Bike,
  Cog,
  Droplets,
  Gauge,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';
import { CookieBanner, CookiePreferences } from '../components/CookieBanner';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { PromoBannerCarousel } from '../components/PromoBannerCarousel';
import {
  CAR_CATALOG_ITEMS,
  CAR_CATALOG_TABS,
  CarCatalogTabId,
  CarSubCategoryItem,
} from '../data/carPartsCatalog';

const COOKIE_STORAGE_KEY = 'my_car_parts_cookie_consent';

function renderCategoryIcon(iconKey: CarSubCategoryItem['iconKey']) {
  const iconClass = 'w-12 h-12 text-slate-700 stroke-[1.5]';
  switch (iconKey) {
    case 'droplets':
      return <Droplets className={iconClass} aria-hidden="true" />;
    case 'gauge':
      return <Gauge className={iconClass} aria-hidden="true" />;
    case 'battery':
      return <BatteryCharging className={iconClass} aria-hidden="true" />;
    case 'sparkles':
      return <Sparkles className={iconClass} aria-hidden="true" />;
    case 'shield':
      return <ShieldCheck className={iconClass} aria-hidden="true" />;
    case 'bike':
      return <Bike className={iconClass} aria-hidden="true" />;
    case 'cog':
      return <Cog className={iconClass} aria-hidden="true" />;
    case 'wrench':
    default:
      return <Wrench className={iconClass} aria-hidden="true" />;
  }
}

export function CarPartsCatalogApp() {
  const [activeTab, setActiveTab] = useState<CarCatalogTabId>('car-parts');
  const [selectedItem, setSelectedItem] = useState<CarSubCategoryItem | null>(null);
  const [vehicleInput, setVehicleInput] = useState('');
  const [cookieBannerVisible, setCookieBannerVisible] = useState<boolean>(() => {
    try {
      return !window.localStorage.getItem(COOKIE_STORAGE_KEY);
    } catch {
      return true;
    }
  });

  const visibleItems = useMemo(
    () => CAR_CATALOG_ITEMS.filter((item) => item.tab === activeTab),
    [activeTab],
  );

  const handleCookieDismiss = useCallback((prefs: CookiePreferences) => {
    try {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage errors
    }
    setCookieBannerVisible(false);
  }, []);

  const buildWhatsappHref = (item: CarSubCategoryItem) => {
    const vehicleNote = vehicleInput.trim()
      ? ` Vehicle / OEM details: ${vehicleInput.trim()}.`
      : '';
    const msg = `Hello My Car Parts, please check availability and pricing for ${item.title}.${vehicleNote}`;
    return `https://wa.me/923002183149?text=${encodeURIComponent(msg)}`;
  };

  const buildEmailHref = (item: CarSubCategoryItem) => {
    const subject = `${item.title} — Car Spare Parts Enquiry`;
    const body = vehicleInput.trim()
      ? `Hello My Car Parts team,\n\nPlease verify stock and pricing for: ${item.title}\nVehicle / OEM / VIN details: ${vehicleInput.trim()}\n`
      : `Hello My Car Parts team,\n\nPlease verify stock and pricing for: ${item.title}\n`;
    return `mailto:sales@mycarparts.pk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar
        basePath=".."
        centerTitle="Car Spare Parts"
        backToMainHref="../index.html"
        quoteCount={0}
        onSelectCategory={() => {}}
        onOpenQuote={() => {}}
      />

      <main className="flex-1 bg-white">
        <h1 className="sr-only">Car Spare Parts, Auto Parts &amp; Engine Components</h1>

        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-10">
          {/* Scrollable Service & Shipping Banners */}
          <section
            aria-label="Service and delivery highlights"
            className="mb-10 sm:mb-12"
          >
            <PromoBannerCarousel theme="light" />
          </section>

          {/* Category Tabs matching reference */}
          <div
            role="tablist"
            aria-label="Automotive product groups"
            className="flex items-center gap-6 sm:gap-8 border-b border-slate-200 mb-7 overflow-x-auto"
          >
            {CAR_CATALOG_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
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

          {/* 6-Column Subcategory Card Grid matching reference */}
          <div
            role="tabpanel"
            aria-label={CAR_CATALOG_TABS.find((t) => t.id === activeTab)?.label}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5"
          >
            {visibleItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setVehicleInput('');
                  setSelectedItem(item);
                }}
                className="group bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-lg px-4 py-5 flex flex-col items-center justify-between gap-3.5 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
              >
                <div className="w-full aspect-[4/3] flex items-center justify-center bg-white overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.04]">
                      {renderCategoryIcon(item.iconKey)}
                    </div>
                  )}
                </div>

                <span className="text-[13px] sm:text-sm font-medium text-slate-800 group-hover:text-slate-950 text-center leading-snug">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer basePath=".." compact />

      {/* Category Details & Availability Enquiry Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="car-category-modal-title"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-lg bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200">
              <div>
                <p className="text-xs font-medium text-slate-500">Car Spare Parts</p>
                <h2
                  id="car-category-modal-title"
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
                  {selectedItem.image ? (
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    renderCategoryIcon(selectedItem.iconKey)
                  )}
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
                  htmlFor="car-fitment-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Vehicle Make / Model / Year or OEM / VIN (optional)
                </label>
                <input
                  id="car-fitment-input"
                  type="text"
                  value={vehicleInput}
                  onChange={(e) => setVehicleInput(e.target.value)}
                  placeholder="e.g. Toyota Corolla 2021 · OEM part number or VIN"
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

      <CookieBanner visible={cookieBannerVisible} onDismiss={handleCookieDismiss} />
    </div>
  );
}
