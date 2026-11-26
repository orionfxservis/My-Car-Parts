import { Minus, Plus, ShoppingBag, Trash2, Wrench, X } from 'lucide-react';
import { resolveAssetUrl } from '../../lib/cmsValidation';
import { CarCartItem, formatPkr } from './types';

interface CarCartDrawerProps {
  open: boolean;
  items: CarCartItem[];
  onClose: () => void;
  onUpdateQty: (cartKey: string, nextQty: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onProceedToBuyNow: () => void;
}

export function CarCartDrawer({
  open,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onProceedToBuyNow,
}: CarCartDrawerProps) {
  if (!open) return null;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const pricedSubtotal = items.reduce(
    (sum, item) => sum + (item.unitPrice > 0 ? item.unitPrice * item.quantity : 0),
    0,
  );
  const hasQuoteItems = items.some((item) => item.unitPrice <= 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="car-cart-drawer-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-white text-slate-900 border-l border-slate-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" aria-hidden="true" />
            <h2 id="car-cart-drawer-title" className="text-base font-bold text-slate-950">
              Your Cart ({totalCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart drawer"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-800">Your cart is currently empty</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click any product card to view details, select quantity, and add parts to your cart.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartKey}
                className="flex gap-3.5 p-3.5 rounded-lg border border-slate-200 bg-white"
              >
                <div className="w-16 h-16 shrink-0 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center p-1.5 overflow-hidden">
                  {item.image ? (
                    <img
                      src={resolveAssetUrl(item.image, '..')}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Wrench className="w-6 h-6 text-slate-400" aria-hidden="true" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-950 leading-snug truncate">
                      {item.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.cartKey)}
                      aria-label={`Remove ${item.title}`}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] font-mono text-slate-500">
                    SKU: {item.sku} · {item.brand}
                  </p>
                  <p className="text-[11px] text-slate-600 truncate">
                    Vehicle: {item.vehicleFitment}
                  </p>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center border border-slate-300 rounded bg-white h-7">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.cartKey, Math.max(1, item.quantity - 1))}
                        aria-label="Decrease quantity"
                        className="w-7 h-full inline-flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold font-mono tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.cartKey, Math.min(999, item.quantity + 1))}
                        aria-label="Increase quantity"
                        className="w-7 h-full inline-flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-slate-950 font-mono tabular-nums">
                      {item.unitPrice > 0
                        ? formatPkr(item.unitPrice * item.quantity)
                        : 'Price on Request'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">Estimated Total</span>
              <span className="font-bold text-slate-950 font-mono tabular-nums">
                {pricedSubtotal > 0
                  ? `${formatPkr(pricedSubtotal)}${hasQuoteItems ? ' + Quote Items' : ''}`
                  : 'Confirmed on Order'}
              </span>
            </div>
            <button
              type="button"
              onClick={onProceedToBuyNow}
              className="w-full py-3 px-4 text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer"
            >
              Proceed to Buy Now Table
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
