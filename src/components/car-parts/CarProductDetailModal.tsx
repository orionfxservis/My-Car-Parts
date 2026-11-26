import { MouseEvent, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { CarSubCategoryItem } from '../../data/carPartsCatalog';
import { resolveAssetUrl } from '../../lib/cmsValidation';
import {
  CarCartItem,
  formatPkr,
  resolveCarProductDetails,
} from './types';

interface CarProductDetailModalProps {
  item: CarSubCategoryItem | null;
  groupLabel: string;
  selectedCarName: string | null;
  adminMobileNo: string;
  renderFallbackIcon: (iconKey: CarSubCategoryItem['iconKey']) => React.ReactNode;
  onClose: () => void;
  onAddToCart: (cartItem: Omit<CarCartItem, 'cartKey'>) => void;
  onBuyNow: (checkoutItem: CarCartItem) => void;
  onOpenCart: () => void;
}

export function CarProductDetailModal({
  item,
  groupLabel,
  selectedCarName,
  adminMobileNo,
  renderFallbackIcon,
  onClose,
  onAddToCart,
  onBuyNow,
  onOpenCart,
}: CarProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [vehicleFitment, setVehicleFitment] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Multi-image gallery & interactive cursor zoom states
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isHoverZooming, setIsHoverZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoomed, setLightboxZoomed] = useState(false);

  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setVehicleFitment(selectedCarName || '');
    setAddedFeedback(false);
    setActiveImageIdx(0);
    setIsHoverZooming(false);
    setLightboxOpen(false);
    setLightboxZoomed(false);
  }, [item, selectedCarName]);

  useEffect(() => {
    if (!item) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) {
          setLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [item, lightboxOpen, onClose]);

  if (!item) return null;

  const galleryImages = (() => {
    const list = (item.images || []).filter(Boolean);
    if (list.length > 0) return list.slice(0, 10);
    if (item.image) return [item.image];
    return [];
  })();

  const safeIdx = Math.min(activeImageIdx, Math.max(0, galleryImages.length - 1));
  const activeImageSrc = galleryImages[safeIdx] ? resolveAssetUrl(galleryImages[safeIdx], '..') : '';

  const details = resolveCarProductDetails(item, groupLabel, selectedCarName);
  const whatsappDigits = adminMobileNo.replace(/\D/g, '') || '923002183149';

  const handleQtyChange = (next: number) => {
    if (Number.isNaN(next)) return;
    setQuantity(Math.max(1, Math.min(999, Math.floor(next))));
  };

  const handleImageMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x, y });
  };

  const buildPayloadItem = (): Omit<CarCartItem, 'cartKey'> => ({
    productId: item.id,
    title: item.title,
    groupLabel,
    brand: details.brand,
    sku: details.sku,
    unitPrice: details.price,
    quantity,
    image: galleryImages[0] || item.image,
    vehicleFitment: vehicleFitment.trim() || selectedCarName || 'General / To be confirmed',
  });

  const handleAdd = () => {
    onAddToCart(buildPayloadItem());
    setAddedFeedback(true);
  };

  const handleBuyNowClick = () => {
    const payload = buildPayloadItem();
    onBuyNow({
      ...payload,
      cartKey: `${payload.productId}::${payload.vehicleFitment}`,
    });
  };

  const quickWhatsappHref = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    `Hello My Car Parts, please confirm stock and pricing for:\nProduct: ${item.title}\nSKU: ${details.sku}\nBrand: ${details.brand}\nQty: ${quantity}${
      vehicleFitment.trim() ? `\nVehicle / Model / VIN: ${vehicleFitment.trim()}` : ''
    }`,
  )}`;

  const quickEmailHref = `mailto:sales@mycarparts.pk?subject=${encodeURIComponent(
    `${item.title} (${details.sku}) — Car Parts Enquiry`,
  )}&body=${encodeURIComponent(
    `Hello My Car Parts Team,\n\nPlease confirm availability and pricing for:\nProduct: ${item.title}\nSKU: ${details.sku}\nBrand: ${details.brand}\nQuantity: ${quantity}${
      vehicleFitment.trim() ? `\nVehicle / Model / VIN: ${vehicleFitment.trim()}` : ''
    }\n`,
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-product-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-2 sm:my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-7 py-3.5 bg-slate-50 border-b border-slate-200">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 min-w-0"
          >
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-950 cursor-pointer mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to Catalog</span>
            </button>
            <span aria-hidden="true" className="text-slate-300">
              |
            </span>
            <span>Car Spare Parts</span>
            <span aria-hidden="true">/</span>
            <span>{groupLabel}</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-slate-900 truncate max-w-[220px] sm:max-w-xs">
              {item.title}
            </span>
          </nav>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-950 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Product Details & Purchase Module */}
        <div className="p-5 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Multi-Image Gallery with Hover Cursor Zoom */}
            <div className="lg:col-span-6 space-y-3.5">
              <div
                onMouseEnter={() => {
                  if (activeImageSrc) setIsHoverZooming(true);
                }}
                onMouseMove={handleImageMouseMove}
                onMouseLeave={() => setIsHoverZooming(false)}
                onClick={() => {
                  if (activeImageSrc) setLightboxOpen(true);
                }}
                className={`relative aspect-[4/3] w-full rounded-xl border border-slate-200 bg-white flex items-center justify-center p-6 overflow-hidden ${
                  activeImageSrc ? 'cursor-zoom-in' : ''
                }`}
              >
                {activeImageSrc ? (
                  <>
                    <img
                      src={activeImageSrc}
                      alt={`${item.title} — Image ${safeIdx + 1}`}
                      referrerPolicy="no-referrer"
                      style={{
                        transform: isHoverZooming ? 'scale(2.35)' : 'scale(1)',
                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                      }}
                      className="max-h-full max-w-full object-contain transition-transform duration-150 ease-out will-change-transform select-none"
                    />
                    <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/75 text-white text-[11px] font-medium">
                      <ZoomIn className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                      <span>
                        {isHoverZooming ? 'Zoomed · Click to Expand' : 'Hover to Zoom'}
                      </span>
                    </span>
                  </>
                ) : (
                  <div className="w-28 h-28 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {renderFallbackIcon(item.iconKey)}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip (Up to 10 Uploaded Images) */}
              {galleryImages.length > 1 && (
                <div
                  role="listbox"
                  aria-label="Product gallery thumbnails"
                  className="grid grid-cols-5 gap-2"
                >
                  {galleryImages.map((thumb, idx) => {
                    const isSelected = idx === safeIdx;
                    return (
                      <button
                        key={`${idx}-${thumb.slice(0, 24)}`}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        onMouseEnter={() => setActiveImageIdx(idx)}
                        className={`aspect-[4/3] rounded-md border bg-white p-1 flex items-center justify-center overflow-hidden cursor-zoom-in transition-all ${
                          isSelected
                            ? 'border-amber-500 ring-2 ring-amber-400/35'
                            : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <img
                          src={resolveAssetUrl(thumb, '..')}
                          alt={`${item.title} view ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Assurance Highlights Strip */}
              <div className="grid grid-cols-3 gap-2.5 text-[11px] text-slate-700">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <span className="font-medium leading-tight">OEM Fitment Verified</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <span className="font-medium leading-tight">30-Day Return Policy</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <span className="font-medium leading-tight">Nationwide COD &amp; Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="lg:col-span-6 space-y-5">
              {/* Unboxed Metadata Kicker (Zero-Pill Discipline) */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="text-amber-700 font-semibold">{groupLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{details.brand}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-slate-600">
                    SKU: {details.sku}
                  </span>
                </div>

                <h2
                  id="pdp-product-title"
                  className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight leading-tight"
                  style={{ textWrap: 'balance' }}
                >
                  {item.title}
                </h2>
              </div>

              {/* Price & Stock Status */}
              <div className="pb-4 border-b border-slate-200 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-slate-950 font-mono tabular-nums">
                    {formatPkr(details.price)}
                  </span>
                  {details.price > 0 ? (
                    <span className="block text-xs text-slate-500 mt-0.5">
                      Cash on Delivery, Bank Transfer, Easypaisa &amp; JazzCash supported
                    </span>
                  ) : (
                    <span className="block text-xs text-slate-500 mt-0.5">
                      Submit Buy Now form for instant confirmed pricing via Email &amp; WhatsApp
                    </span>
                  )}
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <PackageCheck className="w-4 h-4" aria-hidden="true" />
                  <span>{details.availability}</span>
                </div>
              </div>

              {/* Vehicle Compatibility Readout */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-slate-900">Application &amp; Compatibility</p>
                <p className="text-slate-700 leading-relaxed">{details.compatibility}</p>
              </div>

              {/* Fitment Input */}
              <div>
                <label
                  htmlFor="pdp-vehicle-fitment"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Your Car Make / Model / Year or VIN (Optional)
                </label>
                <input
                  id="pdp-vehicle-fitment"
                  type="text"
                  value={vehicleFitment}
                  onChange={(e) => setVehicleFitment(e.target.value)}
                  placeholder="e.g. Toyota Corolla 2021 Altis Grande · 1.8L"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Quantity & Purchase Actions */}
              <div className="space-y-3 pt-1">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label htmlFor="pdp-qty-input" className="sr-only">
                      Quantity
                    </label>
                    <div className="inline-flex items-center border border-slate-300 rounded-md bg-white h-11">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-10 h-full inline-flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-l-md cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        id="pdp-qty-input"
                        type="number"
                        min={1}
                        max={999}
                        value={quantity}
                        onChange={(e) => handleQtyChange(Number(e.target.value))}
                        className="w-14 h-full text-center text-sm font-semibold text-slate-950 font-mono tabular-nums border-x border-slate-200 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleQtyChange(quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-10 h-full inline-flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-r-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`flex-1 min-w-[150px] h-11 inline-flex items-center justify-center gap-2 px-5 text-sm font-semibold rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                      addedFeedback
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-900 text-white'
                    }`}
                  >
                    {addedFeedback ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNowClick}
                    className="flex-1 min-w-[150px] h-11 inline-flex items-center justify-center gap-2 px-5 text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>

                {addedFeedback && (
                  <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <span>
                      Added <strong>{quantity}</strong> × {item.title} to your cart.
                    </span>
                    <button
                      type="button"
                      onClick={onOpenCart}
                      className="font-bold underline underline-offset-2 hover:text-emerald-950 cursor-pointer whitespace-nowrap"
                    >
                      View Cart &amp; Checkout
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={quickWhatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-amber-700 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                    <span>Ask on WhatsApp</span>
                  </a>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <a
                    href={quickEmailHref}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-amber-700 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                    <span>Email Sales Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Section: Full Product Details, Features & Specification Table */}
          <div className="pt-7 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-950 mb-2">
                  Product Description &amp; Key Features
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">{item.summary}</p>
              </div>

              {item.components.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                    Included Variants &amp; Highlights
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
                    {item.components.map((comp) => (
                      <li key={comp}>{comp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-6">
              <h3 className="text-sm font-bold text-slate-950 mb-3">
                Product Specifications
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-slate-50/70">
                      <th className="py-2.5 px-3.5 font-semibold text-slate-700 w-40">
                        Product Name
                      </th>
                      <td className="py-2.5 px-3.5 text-slate-950 font-medium">{item.title}</td>
                    </tr>
                    <tr>
                      <th className="py-2.5 px-3.5 font-semibold text-slate-700">Brand / Quality</th>
                      <td className="py-2.5 px-3.5 text-slate-800">{details.brand}</td>
                    </tr>
                    <tr className="bg-slate-50/70">
                      <th className="py-2.5 px-3.5 font-semibold text-slate-700">SKU / Part Code</th>
                      <td className="py-2.5 px-3.5 font-mono tabular-nums text-slate-800">
                        {details.sku}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-2.5 px-3.5 font-semibold text-slate-700">Division Group</th>
                      <td className="py-2.5 px-3.5 text-slate-800">{groupLabel}</td>
                    </tr>
                    <tr className="bg-slate-50/70">
                      <th className="py-2.5 px-3.5 font-semibold text-slate-700">Compatibility</th>
                      <td className="py-2.5 px-3.5 text-slate-800">{details.compatibility}</td>
                    </tr>
                    <tr>
                      <th className="py-2.5 px-3.5 font-semibold text-slate-700">Availability</th>
                      <td className="py-2.5 px-3.5 text-emerald-700 font-semibold">
                        {details.availability}
                      </td>
                    </tr>
                    <tr className="bg-slate-50/70">
                      <th className="py-2.5 px-3.5 font-semibold text-slate-700">Warranty</th>
                      <td className="py-2.5 px-3.5 text-slate-800">{details.warranty}</td>
                    </tr>
                    <tr>
                      <th className="py-2.5 px-3.5 font-semibold text-slate-700">Payment Modes</th>
                      <td className="py-2.5 px-3.5 text-slate-800">
                        Cash on Delivery (COD), Bank Transfer, Easypaisa, JazzCash
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Zoom Lightbox across all uploaded images */}
      {lightboxOpen && activeImageSrc && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/92 flex flex-col items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(false);
          }}
        >
          <div
            className="w-full max-w-4xl flex items-center justify-between text-white pb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs sm:text-sm font-semibold">
              {item.title} ({safeIdx + 1} / {galleryImages.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxZoomed((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-md cursor-pointer"
              >
                {lightboxZoomed ? (
                  <>
                    <ZoomOut className="w-4 h-4" aria-hidden="true" />
                    <span>Reset Zoom</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-4 h-4" aria-hidden="true" />
                    <span>Zoom In (2x)</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close full screen zoom"
                className="p-2 rounded-md bg-white/10 hover:bg-white/20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className="relative w-full max-w-4xl h-[70vh] bg-white rounded-xl overflow-auto flex items-center justify-center p-6"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxZoomed((prev) => !prev);
            }}
          >
            <img
              src={activeImageSrc}
              alt={`${item.title} zoom ${safeIdx + 1}`}
              referrerPolicy="no-referrer"
              className={`max-h-full max-w-full object-contain transition-transform duration-200 ${
                lightboxZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
              }`}
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx(
                      (safeIdx - 1 + galleryImages.length) % galleryImages.length,
                    );
                  }}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/75 hover:bg-slate-950 text-white cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx((safeIdx + 1) % galleryImages.length);
                  }}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/75 hover:bg-slate-950 text-white cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
