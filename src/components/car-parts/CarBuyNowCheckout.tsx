import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  MessageCircle,
  Minus,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { submitTechnicalInquiry } from '../../lib/cmsService';
import {
  CarCartItem,
  PAYMENT_MODE_OPTIONS,
  PaymentModeOption,
  formatPkr,
} from './types';

interface CarBuyNowCheckoutProps {
  open: boolean;
  initialItems: CarCartItem[];
  adminMobileNo: string;
  onClose: () => void;
  onBackToProduct?: () => void;
  onClearCartAfterOrder?: () => void;
}

interface SubmittedOrderRecord {
  orderCode: string;
  customerName: string;
  mobileNo: string;
  customerEmail: string;
  vehicleInfo: string;
  deliveryAddress: string;
  paymentMode: PaymentModeOption;
  notes: string;
  items: CarCartItem[];
  totalAmountText: string;
  adminMobileNo: string;
}

export function CarBuyNowCheckout({
  open,
  initialItems,
  adminMobileNo,
  onClose,
  onBackToProduct,
  onClearCartAfterOrder,
}: CarBuyNowCheckoutProps) {
  const [items, setItems] = useState<CarCartItem[]>(initialItems);
  const [customerName, setCustomerName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentModeOption>('Cash on Delivery (COD)');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrderRecord | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (!open) return;
    setItems(initialItems);
    setSubmittedOrder(null);
    setErrorMsg('');
    setCopiedText(false);
    const firstVehicle = initialItems.find(
      (it) => it.vehicleFitment && it.vehicleFitment !== 'General / To be confirmed',
    )?.vehicleFitment;
    setVehicleInfo(firstVehicle || '');
  }, [open, initialItems]);

  if (!open) return null;

  const totalUnits = items.reduce((sum, it) => sum + it.quantity, 0);
  const numericSubtotal = items.reduce(
    (sum, it) => sum + (it.unitPrice > 0 ? it.unitPrice * it.quantity : 0),
    0,
  );
  const hasQuoteItems = items.some((it) => it.unitPrice <= 0);
  const totalSummaryText =
    numericSubtotal > 0
      ? `${formatPkr(numericSubtotal)}${hasQuoteItems ? ' + Quote Items' : ''}`
      : 'To be confirmed by sales desk';

  const handleQtyChange = (cartKey: string, nextQty: number) => {
    const clean = Math.max(1, Math.min(999, Math.floor(nextQty || 1)));
    setItems((prev) => prev.map((it) => (it.cartKey === cartKey ? { ...it, quantity: clean } : it)));
  };

  const handleRemove = (cartKey: string) => {
    setItems((prev) => prev.filter((it) => it.cartKey !== cartKey));
  };

  const buildOrderMessageText = (ord: SubmittedOrderRecord) => {
    const tableLines = ord.items.map(
      (it, idx) =>
        `${idx + 1}. ${it.title} | SKU: ${it.sku} | Qty: ${it.quantity} | Unit: ${formatPkr(
          it.unitPrice,
        )} | Subtotal: ${it.unitPrice > 0 ? formatPkr(it.unitPrice * it.quantity) : 'Quote'}`,
    );

    return [
      `MY CAR PARTS — ORDER INQUIRY (${ord.orderCode})`,
      `Customer Name: ${ord.customerName}`,
      `Mobile / WhatsApp: ${ord.mobileNo}`,
      `Customer Email: ${ord.customerEmail}`,
      `Vehicle / Model / VIN: ${ord.vehicleInfo}`,
      `Delivery City & Address: ${ord.deliveryAddress}`,
      `Selected Payment Mode: ${ord.paymentMode} (Payment Mode Only — Confirm Before Dispatch)`,
      '',
      '--- ORDER SUMMARY TABLE ---',
      ...tableLines,
      `Total Payable: ${ord.totalAmountText}`,
      ...(ord.notes ? ['', `Notes: ${ord.notes}`] : []),
    ].join('\n');
  };

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Please keep at least one product in the order table.');
      return;
    }

    const cleanName = customerName.trim();
    const cleanMobile = mobileNo.trim();
    const cleanEmail = customerEmail.trim();
    const cleanVehicle = vehicleInfo.trim();
    const cleanAddress = deliveryAddress.trim();
    const cleanNotes = notes.trim();
    const mobileDigits = cleanMobile.replace(/\D/g, '');

    if (!cleanName) {
      setErrorMsg('Please enter your Full Name.');
      return;
    }
    if (!/^[+\d\s\-()]{7,32}$/.test(cleanMobile) || mobileDigits.length < 7) {
      setErrorMsg('Please enter a valid Mobile / WhatsApp No (at least 7 digits).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid Email Address.');
      return;
    }
    if (!cleanVehicle) {
      setErrorMsg('Please enter your Car Make / Model / Year for fitment verification.');
      return;
    }
    if (cleanAddress.length < 5) {
      setErrorMsg('Please enter your Delivery City & Full Address.');
      return;
    }

    setSubmitting(true);
    try {
      const partLabel =
        items.length === 1
          ? `${items[0].title} (Qty ${items[0].quantity})`
          : `${items[0].title} + ${items.length - 1} more (${totalUnits} units)`;

      const detailsBody = [
        `Customer Email: ${cleanEmail}`,
        `Vehicle: ${cleanVehicle}`,
        `Address: ${cleanAddress}`,
        `Payment Mode: ${paymentMode}`,
        `Order Total: ${totalSummaryText}`,
        ...items.map(
          (it, idx) =>
            `${idx + 1}. ${it.title} (${it.sku}) x${it.quantity} = ${
              it.unitPrice > 0 ? formatPkr(it.unitPrice * it.quantity) : 'Quote'
            }`,
        ),
        ...(cleanNotes ? [`Notes: ${cleanNotes}`] : []),
      ].join(' | ');

      const saved = await submitTechnicalInquiry({
        contactName: cleanName,
        mobileNo: cleanMobile,
        equipmentDivision: 'Car Spare Parts',
        partName: partLabel,
        toolSkuSerial: `${items[0].sku} · ${paymentMode}`.slice(0, 80),
        technicalDetails: detailsBody.slice(0, 2000),
        adminMobileNo,
      });

      const orderRecord: SubmittedOrderRecord = {
        orderCode: saved.ticketCode,
        customerName: cleanName,
        mobileNo: cleanMobile,
        customerEmail: cleanEmail,
        vehicleInfo: cleanVehicle,
        deliveryAddress: cleanAddress,
        paymentMode,
        notes: cleanNotes,
        items: [...items],
        totalAmountText: totalSummaryText,
        adminMobileNo: saved.adminMobileNo,
      };

      setSubmittedOrder(orderRecord);
      onClearCartAfterOrder?.();
    } catch {
      setErrorMsg('Unable to log order notification right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappDigits =
    (submittedOrder?.adminMobileNo || adminMobileNo).replace(/\D/g, '') || '923002183149';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="buy-now-checkout-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-2 sm:my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            {onBackToProduct && !submittedOrder && (
              <button
                type="button"
                onClick={onBackToProduct}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950 cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Back</span>
              </button>
            )}
            <div className="min-w-0">
              <h2
                id="buy-now-checkout-title"
                className="text-base sm:text-lg font-bold text-slate-950 truncate"
              >
                {submittedOrder
                  ? `Order Ready (${submittedOrder.orderCode})`
                  : 'Order Summary Table & Checkout'}
              </h2>
              <p className="text-xs text-slate-500">
                Payment Mode selection only — orders dispatch directly to Email &amp; WhatsApp
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedOrder ? (
          <div className="p-5 sm:p-8 space-y-6">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <CheckCircle2
                className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="space-y-1 text-sm text-emerald-950">
                <p className="font-bold">
                  Order Reference {submittedOrder.orderCode} saved to My Car Parts Desk
                </p>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Your order details and selected Payment Mode ({submittedOrder.paymentMode}) are
                  ready. Click both actions below to dispatch directly via Email and WhatsApp.
                </p>
              </div>
            </div>

            {/* Confirmed Table */}
            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[540px]">
                <thead className="bg-slate-100 text-slate-800 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3.5 font-semibold">Product</th>
                    <th className="py-2.5 px-3.5 font-semibold">SKU</th>
                    <th className="py-2.5 px-3.5 font-semibold text-right">Unit Price</th>
                    <th className="py-2.5 px-3.5 font-semibold text-center">Qty</th>
                    <th className="py-2.5 px-3.5 font-semibold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {submittedOrder.items.map((it) => (
                    <tr key={it.cartKey}>
                      <td className="py-2.5 px-3.5 font-medium text-slate-950">{it.title}</td>
                      <td className="py-2.5 px-3.5 font-mono text-slate-600">{it.sku}</td>
                      <td className="py-2.5 px-3.5 text-right font-mono tabular-nums">
                        {formatPkr(it.unitPrice)}
                      </td>
                      <td className="py-2.5 px-3.5 text-center font-mono tabular-nums">
                        {it.quantity}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-bold font-mono tabular-nums">
                        {it.unitPrice > 0
                          ? formatPkr(it.unitPrice * it.quantity)
                          : 'Quote'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200 text-xs sm:text-sm">
                  <tr>
                    <td colSpan={3} className="py-2.5 px-3.5 font-semibold text-slate-700">
                      Payment Mode (No Online Payment Charged)
                    </td>
                    <td colSpan={2} className="py-2.5 px-3.5 text-right font-semibold text-slate-950">
                      {submittedOrder.paymentMode}
                    </td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td colSpan={3} className="py-3 px-3.5 font-bold text-slate-950">
                      Total Payable
                    </td>
                    <td
                      colSpan={2}
                      className="py-3 px-3.5 text-right text-base font-bold text-slate-950 font-mono tabular-nums"
                    >
                      {submittedOrder.totalAmountText}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p>
                <span className="font-semibold text-slate-700">Customer:</span>{' '}
                {submittedOrder.customerName} ({submittedOrder.mobileNo})
              </p>
              <p>
                <span className="font-semibold text-slate-700">Email:</span>{' '}
                {submittedOrder.customerEmail}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Vehicle:</span>{' '}
                {submittedOrder.vehicleInfo}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Delivery Address:</span>{' '}
                {submittedOrder.deliveryAddress}
              </p>
            </div>

            {/* Direct WhatsApp & Email Dispatch Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
                  buildOrderMessageText(submittedOrder),
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Send Order on WhatsApp ({submittedOrder.adminMobileNo})</span>
              </a>

              <a
                href={`mailto:sales@mycarparts.pk?subject=${encodeURIComponent(
                  `New Order ${submittedOrder.orderCode} — ${submittedOrder.customerName}`,
                )}&body=${encodeURIComponent(buildOrderMessageText(submittedOrder))}`}
                className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Send Order to Email (sales@mycarparts.pk)</span>
              </a>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(buildOrderMessageText(submittedOrder));
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2000);
                  } catch {
                    // Ignore clipboard fallback
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md cursor-pointer whitespace-nowrap"
              >
                {copiedText ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>{copiedText ? 'Copied' : 'Copy Order'}</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} noValidate className="p-5 sm:p-8 space-y-6">
            {/* BUY NOW ORDER TABLE */}
            <div>
              <h3 className="text-sm font-bold text-slate-950 mb-3">
                1. Order Details Table
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[600px]">
                  <thead className="bg-slate-100 text-slate-800 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3.5 font-semibold">Product &amp; Fitment</th>
                      <th className="py-2.5 px-3.5 font-semibold">SKU</th>
                      <th className="py-2.5 px-3.5 font-semibold text-right">Unit Price</th>
                      <th className="py-2.5 px-3.5 font-semibold text-center">Quantity</th>
                      <th className="py-2.5 px-3.5 font-semibold text-right">Total</th>
                      <th className="py-2.5 px-2.5 font-semibold text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {items.map((it) => (
                      <tr key={it.cartKey}>
                        <td className="py-3 px-3.5">
                          <p className="font-bold text-slate-950">{it.title}</p>
                          <p className="text-[11px] text-slate-500">
                            {it.brand} · {it.groupLabel}
                          </p>
                        </td>
                        <td className="py-3 px-3.5 font-mono text-xs text-slate-600">
                          {it.sku}
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono tabular-nums text-slate-800">
                          {formatPkr(it.unitPrice)}
                        </td>
                        <td className="py-3 px-3.5">
                          <div className="flex justify-center">
                            <div className="inline-flex items-center border border-slate-300 rounded bg-white h-8">
                              <button
                                type="button"
                                onClick={() => handleQtyChange(it.cartKey, it.quantity - 1)}
                                aria-label="Decrease row quantity"
                                className="w-7 h-full inline-flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min={1}
                                max={999}
                                value={it.quantity}
                                onChange={(e) =>
                                  handleQtyChange(it.cartKey, Number(e.target.value))
                                }
                                aria-label={`Quantity for ${it.title}`}
                                className="w-11 h-full text-center text-xs font-semibold font-mono tabular-nums border-x border-slate-200 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleQtyChange(it.cartKey, it.quantity + 1)}
                                aria-label="Increase row quantity"
                                className="w-7 h-full inline-flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3.5 text-right font-bold font-mono tabular-nums text-slate-950">
                          {it.unitPrice > 0
                            ? formatPkr(it.unitPrice * it.quantity)
                            : 'Quote'}
                        </td>
                        <td className="py-3 px-2.5 text-center">
                          <button
                            type="button"
                            disabled={items.length <= 1}
                            onClick={() => handleRemove(it.cartKey)}
                            aria-label={`Remove ${it.title}`}
                            className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 text-xs sm:text-sm">
                    <tr>
                      <td colSpan={4} className="py-2.5 px-3.5 font-semibold text-slate-700">
                        Total Quantity ({totalUnits} {totalUnits === 1 ? 'unit' : 'units'}) · Payment
                        Mode: <span className="text-slate-950">{paymentMode}</span>
                      </td>
                      <td
                        colSpan={2}
                        className="py-2.5 px-3.5 text-right font-bold text-slate-950 font-mono tabular-nums"
                      >
                        {totalSummaryText}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* PAYMENT MODE SELECTION ONLY */}
            <div>
              <h3 className="text-sm font-bold text-slate-950 mb-1">
                2. Select Payment Mode (Confirmation Only — No Online Payment Charged)
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Choose how you prefer to settle upon confirmation. Payment is never collected automatically on this page.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {PAYMENT_MODE_OPTIONS.map((mode) => {
                  const selected = paymentMode === mode;
                  return (
                    <label
                      key={mode}
                      className={`flex items-start gap-2 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                        selected
                          ? 'border-amber-500 bg-amber-50/70 text-slate-950 font-semibold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="buyNowPaymentMode"
                        checked={selected}
                        onChange={() => setPaymentMode(mode)}
                        className="mt-0.5 accent-amber-500 cursor-pointer"
                      />
                      <span className="leading-snug">{mode}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* CUSTOMER & DELIVERY FORM */}
            <div>
              <h3 className="text-sm font-bold text-slate-950 mb-3">
                3. Customer &amp; Delivery Details
              </h3>

              {errorMsg && (
                <div
                  role="alert"
                  className="mb-4 p-3 rounded-md bg-red-50 border border-red-300 text-xs font-medium text-red-900"
                >
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs font-semibold text-slate-800 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muhammad Ahmed"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-mobile"
                    className="block text-xs font-semibold text-slate-800 mb-1"
                  >
                    Mobile / WhatsApp No *
                  </label>
                  <input
                    id="checkout-mobile"
                    type="tel"
                    required
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-email"
                    className="block text-xs font-semibold text-slate-800 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-vehicle"
                    className="block text-xs font-semibold text-slate-800 mb-1"
                  >
                    Vehicle Make / Model / Year *
                  </label>
                  <input
                    id="checkout-vehicle"
                    type="text"
                    required
                    value={vehicleInfo}
                    onChange={(e) => setVehicleInfo(e.target.value)}
                    placeholder="e.g. Toyota Corolla 2021 Altis"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  Delivery City &amp; Full Address *
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House / Street / Sector, City"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="checkout-notes"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  Order Notes / Chassis VIN (Optional)
                </label>
                <textarea
                  id="checkout-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific OEM brand preference or delivery instructions..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Order notifies Admin Desk immediately and prepares ready-to-send Email &amp; WhatsApp
                dispatches.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 rounded-md transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>{submitting ? 'Sending Order...' : 'Send (Email & WhatsApp)'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
