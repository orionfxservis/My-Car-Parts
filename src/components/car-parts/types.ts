import { CarSubCategoryItem } from '../../data/carPartsCatalog';

export type PaymentModeOption =
  | 'Cash on Delivery (COD)'
  | 'Bank Transfer'
  | 'Easypaisa'
  | 'JazzCash'
  | 'Visa / Mastercard (Pay on Confirmation)';

export const PAYMENT_MODE_OPTIONS: PaymentModeOption[] = [
  'Cash on Delivery (COD)',
  'Bank Transfer',
  'Easypaisa',
  'JazzCash',
  'Visa / Mastercard (Pay on Confirmation)',
];

export interface ResolvedCarProductDetails {
  brand: string;
  sku: string;
  price: number;
  availability: string;
  compatibility: string;
  warranty: string;
}

export interface CarCartItem {
  cartKey: string;
  productId: string;
  title: string;
  groupLabel: string;
  brand: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  vehicleFitment: string;
}

export function resolveCarProductDetails(
  item: CarSubCategoryItem,
  groupLabel: string,
  selectedCarName?: string | null,
): ResolvedCarProductDetails {
  const cleanTitleSlug = item.id
    .replace(/[^a-zA-Z0-9]+/g, '')
    .toUpperCase()
    .slice(0, 8);

  return {
    brand: item.brand?.trim() || 'OEM / Certified Aftermarket',
    sku: item.sku?.trim() || `MCP-${cleanTitleSlug || 'PART'}`,
    price: typeof item.price === 'number' && item.price > 0 ? item.price : 0,
    availability: item.availability?.trim() || 'In Stock',
    compatibility:
      item.compatibility?.trim() ||
      (selectedCarName
        ? `${selectedCarName} · Cross-checked by OEM / Chassis VIN`
        : `${groupLabel} — Universal & Vehicle-Specific Fitments (Verify by Model/VIN)`),
    warranty: item.warranty?.trim() || 'OEM Fitment Verified · 30-Day Return Policy',
  };
}

export function formatPkr(amount: number): string {
  if (!amount || amount <= 0) return 'Price on Request';
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}
