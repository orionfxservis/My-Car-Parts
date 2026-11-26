import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BatteryCharging,
  Car,
  Cog,
  Droplets,
  Gauge,
  ShieldCheck,
  Sparkles,
  Wrench,
  ZoomIn,
} from 'lucide-react';
import { CookieBanner, CookiePreferences } from '../components/CookieBanner';
import { EnquiryModal } from '../components/EnquiryModal';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { PromoBannerCarousel } from '../components/PromoBannerCarousel';
import { CarBuyNowCheckout } from '../components/car-parts/CarBuyNowCheckout';
import { CarCartDrawer } from '../components/car-parts/CarCartDrawer';
import { CarProductDetailModal } from '../components/car-parts/CarProductDetailModal';
import {
  CarCartItem,
  formatPkr,
  resolveCarProductDetails,
} from '../components/car-parts/types';
import {
  CarCatalogTabId,
  CarSubCategoryItem,
} from '../data/carPartsCatalog';
import { resolveAssetUrl } from '../lib/cmsValidation';
import { useCarPartsCms } from '../lib/useStorefrontCms';

const COOKIE_STORAGE_KEY = 'my_car_parts_cookie_consent';
const CART_STORAGE_KEY = 'my_car_parts_cart_v1';

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
    case 'cog':
      return <Cog className={iconClass} aria-hidden="true" />;
    case 'wrench':
    default:
      return <Wrench className={iconClass} aria-hidden="true" />;
  }
}

export function CarPartsCatalogApp() {
  const { banners, makes, items, groups, adminMobileNo } = useCarPartsCms();
  const [activeMakeId, setActiveMakeId] = useState<string>(makes[0]?.id ?? 'toyota');
  const [selectedCarName, setSelectedCarName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CarCatalogTabId>('car-parts');
  const [selectedItem, setSelectedItem] = useState<CarSubCategoryItem | null>(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  // Shopping Cart persisted in localStorage
  const [cartItems, setCartItems] = useState<CarCartItem[]>(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as CarCartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Buy Now Checkout Table State
  const [checkoutItems, setCheckoutItems] = useState<CarCartItem[] | null>(null);
  const [checkoutSource, setCheckoutSource] = useState<'single' | 'cart'>('single');

  const [cookieBannerVisible, setCookieBannerVisible] = useState<boolean>(() => {
    try {
      return !window.localStorage.getItem(COOKIE_STORAGE_KEY);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota issues
    }
  }, [cartItems]);

  const totalCartUnits = useMemo(
    () => cartItems.reduce((sum, it) => sum + it.quantity, 0),
    [cartItems],
  );

  const activeMake = useMemo(
    () => makes.find((make) => make.id === activeMakeId) ?? makes[0],
    [activeMakeId, makes],
  );

  const effectiveActiveTab = useMemo(
    () => (groups.some((g) => g.id === activeTab) ? activeTab : groups[0]?.id ?? 'car-parts'),
    [groups, activeTab],
  );

  const activeGroupLabel = useMemo(
    () => groups.find((g) => g.id === effectiveActiveTab)?.label || 'Car parts',
    [groups, effectiveActiveTab],
  );

  const visibleItems = useMemo(
    () => items.filter((item) => item.tab === effectiveActiveTab),
    [effectiveActiveTab, items],
  );

  const handleCookieDismiss = useCallback((prefs: CookiePreferences) => {
    try {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage errors
    }
    setCookieBannerVisible(false);
  }, []);

  const handleAddToCart = useCallback((incoming: Omit<CarCartItem, 'cartKey'>) => {
    const cartKey = `${incoming.productId}::${incoming.vehicleFitment}`;
    setCartItems((prev) => {
      const existing = prev.find((it) => it.cartKey === cartKey);
      if (existing) {
        return prev.map((it) =>
          it.cartKey === cartKey
            ? { ...it, quantity: Math.min(999, it.quantity + incoming.quantity) }
            : it,
        );
      }
      return [...prev, { ...incoming, cartKey }];
    });
  }, []);

  const handleUpdateCartQty = useCallback((cartKey: string, nextQty: number) => {
    setCartItems((prev) =>
      prev.map((it) =>
        it.cartKey === cartKey
          ? { ...it, quantity: Math.max(1, Math.min(999, nextQty)) }
          : it,
      ),
    );
  }, []);

  const handleRemoveCartItem = useCallback((cartKey: string) => {
    setCartItems((prev) => prev.filter((it) => it.cartKey !== cartKey));
  }, []);

  const handleSingleBuyNow = useCallback((checkoutItem: CarCartItem) => {
    setCheckoutSource('single');
    setCheckoutItems([checkoutItem]);
    setSelectedItem(null);
  }, []);

  const handleCartBuyNow = useCallback(() => {
    if (cartItems.length === 0) return;
    setCheckoutSource('cart');
    setCheckoutItems([...cartItems]);
    setCartDrawerOpen(false);
  }, [cartItems]);

  return (
    <ErrorBoundary>
      <div id="top" className="min-h-screen flex flex-col bg-white text-slate-900">
        <Navbar
          basePath=".."
          centerTitle="Car Spare Parts"
          backToMainHref="../index.html"
          quoteCount={0}
          cartCount={totalCartUnits}
          onOpenCart={() => setCartDrawerOpen(true)}
          onSelectCategory={() => {}}
          onOpenQuote={() => {}}
          onOpenEnquiry={() => setEnquiryModalOpen(true)}
        />

        <main className="flex-1 bg-white">
          <h1 className="sr-only">Car Spare Parts, Auto Parts &amp; Engine Components</h1>

          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-10">
            {/* Scrollable Service & Shipping Banners */}
            <section
              aria-label="Service and delivery highlights"
              className="mb-9 sm:mb-11"
            >
              <PromoBannerCarousel theme="light" banners={banners} basePath=".." />
            </section>

            {/* Cars by Brand & Model Name */}
            <section
              aria-label="Browse parts by car brand and model"
              className="mb-9 sm:mb-11 bg-slate-50/70 border border-slate-200 rounded-lg p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <Car className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                    Shop by Car Name &amp; Model
                  </h2>
                </div>

                {selectedCarName ? (
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                    <span className="text-slate-600">
                      Selected:{' '}
                      <strong className="text-slate-950 font-semibold">{selectedCarName}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setEnquiryModalOpen(true)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Enquire for Car
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCarName(null)}
                      className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-950 bg-white border border-slate-200 rounded-md transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-500">
                    Choose a brand and car model to pre-fill vehicle fitment for any part below
                  </p>
                )}
              </div>

              {/* Car Make / Brand Selector Row */}
              <div
                role="tablist"
                aria-label="Car brands"
                className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-200"
              >
                {makes.map((make) => {
                  const isActive = activeMake && make.id === activeMake.id;
                  return (
                    <button
                      key={make.id}
                      type="button"
                      role="tab"
                      aria-selected={Boolean(isActive)}
                      onClick={() => setActiveMakeId(make.id)}
                      className={`px-3 py-1.5 text-xs sm:text-[13px] font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                        isActive
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-950'
                      }`}
                    >
                      {make.brand}
                    </button>
                  );
                })}
              </div>

              {/* Car Models Grid for Active Brand */}
              {activeMake && (
                <div
                  role="tabpanel"
                  aria-label={`${activeMake.brand} car models`}
                  className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5"
                >
                  {activeMake.models.map((modelName) => {
                    const fullName =
                      activeMake.id === 'other-models' ||
                      modelName.toLowerCase().startsWith(activeMake.brand.toLowerCase())
                        ? modelName
                        : `${activeMake.brand} ${modelName}`;
                    const isSelected = selectedCarName === fullName;
                    return (
                      <button
                        key={modelName}
                        type="button"
                        onClick={() =>
                          setSelectedCarName((prev) => (prev === fullName ? null : fullName))
                        }
                        className={`px-3 py-2 text-left text-xs sm:text-[13px] font-medium rounded-md border transition-colors truncate cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-slate-950 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400 hover:text-slate-950'
                        }`}
                        title={fullName}
                      >
                        {fullName}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Category Tabs */}
            <div
              role="tablist"
              aria-label="Automotive product groups"
              className="flex items-center gap-6 sm:gap-8 border-b border-slate-200 mb-7 overflow-x-auto"
            >
              {groups.map((tab) => {
                const isActive = effectiveActiveTab === tab.id;
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

            {/* 6-Column Product Card Grid */}
            <div
              role="tabpanel"
              aria-label={activeGroupLabel}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5"
            >
              {visibleItems.map((item) => {
                const details = resolveCarProductDetails(
                  item,
                  activeGroupLabel,
                  selectedCarName,
                );
                const photoCount =
                  item.images && item.images.length > 0 ? item.images.length : item.image ? 1 : 0;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="group bg-white border border-slate-200 hover:border-amber-500/70 hover:shadow-md rounded-lg px-4 py-5 flex flex-col items-center justify-between gap-3 transition-all duration-150 hover:-translate-y-0.5 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
                  >
                    <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-white overflow-hidden rounded-md">
                      {item.image ? (
                        <img
                          src={resolveAssetUrl(item.image, '..')}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain transition-transform duration-200 ease-out group-hover:scale-125"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-125">
                          {renderCategoryIcon(item.iconKey)}
                        </div>
                      )}
                      <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute top-1.5 right-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900/75 text-white text-[10px] font-medium">
                        <ZoomIn className="w-3 h-3 text-amber-400" aria-hidden="true" />
                        <span>Zoom</span>
                      </span>
                    </div>

                    <div className="w-full text-center space-y-1">
                      <span className="block text-[13px] sm:text-sm font-medium text-slate-800 group-hover:text-slate-950 leading-snug">
                        {item.title}
                      </span>
                      {details.price > 0 && (
                        <span className="block text-xs font-bold text-amber-700 font-mono tabular-nums">
                          {formatPkr(details.price)}
                        </span>
                      )}
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
          </div>
        </main>

        <Footer basePath=".." compact />

        {/* Full Product Details Modal (ndestore.com style with Qty, Add to Cart & Buy Now) */}
        <CarProductDetailModal
          item={selectedItem}
          groupLabel={
            (selectedItem && groups.find((g) => g.id === selectedItem.tab)?.label) ||
            activeGroupLabel
          }
          selectedCarName={selectedCarName}
          adminMobileNo={adminMobileNo}
          renderFallbackIcon={renderCategoryIcon}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleSingleBuyNow}
          onOpenCart={() => {
            setSelectedItem(null);
            setCartDrawerOpen(true);
          }}
        />

        {/* Cart Drawer */}
        <CarCartDrawer
          open={cartDrawerOpen}
          items={cartItems}
          onClose={() => setCartDrawerOpen(false)}
          onUpdateQty={handleUpdateCartQty}
          onRemoveItem={handleRemoveCartItem}
          onProceedToBuyNow={handleCartBuyNow}
        />

        {/* Buy Now Order Table & Payment Mode Checkout */}
        <CarBuyNowCheckout
          open={Boolean(checkoutItems && checkoutItems.length > 0)}
          initialItems={checkoutItems ?? []}
          adminMobileNo={adminMobileNo}
          onClose={() => setCheckoutItems(null)}
          onClearCartAfterOrder={
            checkoutSource === 'cart' ? () => setCartItems([]) : undefined
          }
        />

        <EnquiryModal
          open={enquiryModalOpen}
          divisionTitle={selectedCarName ? `Car Spare Parts — ${selectedCarName}` : 'Car Spare Parts'}
          placeholderHint="e.g. Toyota Corolla 2021 · Brake Pads · OEM code or VIN"
          onClose={() => setEnquiryModalOpen(false)}
        />

        <CookieBanner visible={cookieBannerVisible} onDismiss={handleCookieDismiss} />
      </div>
    </ErrorBoundary>
  );
}
