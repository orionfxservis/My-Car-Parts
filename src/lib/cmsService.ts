import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  CAR_CATALOG_ITEMS,
  CAR_CATALOG_TABS,
  CAR_MAKES_DIRECTORY,
  CAR_PROMO_BANNERS,
  CarCatalogTab,
  CarCatalogTabId,
  CarMakeEntry,
  CarPromoBanner,
  CarSubCategoryItem,
} from '../data/carPartsCatalog';
import {
  GENERATOR_PARTS_CATALOG,
  GENERATOR_PROMO_BANNERS,
  GeneratorPartItem,
} from '../data/generatorPartsCatalog';
import {
  CATEGORY_CARDS,
  CategoryCardData,
  HERO_INVENTORY_SLIDES,
  HeroSlideItem,
  TECHNICAL_GUIDES,
  TOOL_INVENTORY,
  ToolCategory,
  ToolItem,
} from '../data/inventory';
import {
  MACHINERY_PARTS_CATALOG,
  MachineryPartItem,
} from '../data/machineryPartsCatalog';
import { CMS_LIMITS, clampString, sanitizeId } from './cmsValidation';
import { OperationType, auth, db, handleFirestoreError } from './firebase';

export type CmsPageId = 'main' | 'cars' | 'generators' | 'machinery';

export interface SiteSectionStat {
  label: string;
  value: string;
}

export interface SiteSectionItem {
  id: string;
  code?: string;
  category?: string;
  title: string;
  summary: string;
  pages?: string;
}

export interface SiteSectionData {
  id: string;
  page: CmsPageId;
  eyebrow: string;
  heading: string;
  description: string;
  secondaryHeading: string;
  secondaryText: string;
  image: string;
  stats: SiteSectionStat[];
  items: SiteSectionItem[];
}

export interface CatalogProductData {
  id: string;
  page: 'cars' | 'generators' | 'machinery';
  sortOrder: number;
  title: string;
  subsystem: string;
  tab: string;
  iconKey: string;
  image: string;
  cover: boolean;
  summary: string;
  components: string[];
}

export interface AdminUserRecord {
  uid: string;
  role: 'admin';
  addedBy: string;
}

export type EquipmentDivisionOption =
  | 'Car Spare Parts'
  | 'Industrial Generator Spare Parts'
  | 'Heavy Machinery Parts';

export interface TechnicalInquiryRecord {
  id: string;
  ticketCode: string;
  title: 'New Inquiry Mail';
  contactName: string;
  mobileNo: string;
  equipmentDivision: EquipmentDivisionOption;
  partName: string;
  toolSkuSerial: string;
  technicalDetails: string;
  adminMobileNo: string;
  status: 'unread' | 'read';
  createdAtMs: number;
}

export const DEFAULT_ADMIN_MOBILE_NO = '+92 300 2183149';

export const DEFAULT_SITE_SECTIONS: Record<string, SiteSectionData> = {
  'main-hero': {
    id: 'main-hero',
    page: 'main',
    eyebrow: 'Car Spare Parts Supplier · Industrial Generator Parts · Heavy Machinery Parts',
    heading: 'Car Spare Parts, Industrial Generator Parts & Heavy Machinery Components',
    description:
      'My Car Parts is your destination for quality Car Spare Parts, Industrial Generator Spare Parts & Heavy Machinery Parts. We help Vehicle Owners, Automotive Workshops, Generator Maintenance Professionals, Equipment Operators & Industrial Businesses find the right components for repairs, servicing & maintenance requirements.',
    secondaryHeading:
      'Trusted Supply for Automotive Workshops, Power Generation & Construction Fleets',
    secondaryText:
      'As a dedicated auto parts supplier and industrial distributor, My Car Parts supplies dependable car spare parts—including engine spare parts, brake pads and filters, and car suspension parts for Toyota, Honda, and Suzuki vehicles—alongside diesel generator parts, alternator and governor assemblies, and generator maintenance parts for Perkins and Cummins units. We also support civil contractors and quarry operators with heavy machinery spare parts, hydraulic spare parts, and service equipment for Caterpillar, Komatsu, and JCB machines.',
    image: '',
    stats: [
      { value: '10–8,500 Nm', label: 'Torque Coverage' },
      { value: '50–1,200 kW', label: 'Load Bank Testing' },
      { value: '700 Bar', label: 'Hydraulic Force' },
    ],
    items: [
      {
        id: 'step-1',
        title: '1. Browse Online Stock',
        summary:
          'Filter car parts, generator parts, and machinery equipment by category or SKU.',
      },
      {
        id: 'step-2',
        title: '2. Request Availability',
        summary:
          'Add required items to your quote basket or share your vehicle, genset, or machine model number.',
      },
    ],
  },
  'main-company': {
    id: 'main-company',
    page: 'main',
    eyebrow: 'About My Car Parts',
    heading: 'Built for workshops, power houses, and active job sites.',
    description:
      'Founded in 2008, My Car Parts manufactures and calibrates heavy-duty service instruments for commercial automotive centers, standby diesel generator operators, and civil earthmoving contractors.',
    secondaryHeading: '',
    secondaryText:
      'Our engineering division bridges mechanical forging with digital telemetry—giving field technicians repeatable accuracy under extreme vibration, oil exposure, and high-voltage conditions.',
    image: '',
    stats: [],
    items: [
      {
        id: 'std-1',
        code: '01.',
        title: 'Drop-Forged Metallurgy & Heat Verification',
        summary:
          'Every high-torque multiplier, socket, and 50-ton hydraulic jaw undergoes ultrasonic flaw testing and Rockwell C hardness certification before shipment.',
      },
      {
        id: 'std-2',
        code: '02.',
        title: 'NIST-Traceable Calibration Certificates',
        summary:
          'Digital angle torque wrenches, load bank meters, and pressure gauges ship with serialized multi-point calibration certificates valid for OEM audits.',
      },
      {
        id: 'std-3',
        code: '03.',
        title: 'Rapid Fleet & Power Station Logistics',
        summary:
          'Regional depots maintain stock of mission-critical extraction kits and generator service chests for same-day air or ground freight dispatch.',
      },
    ],
  },
  'main-support': {
    id: 'main-support',
    page: 'main',
    eyebrow: 'Technical Support & Calibration Desk',
    heading: 'Engineering documentation, calibration, and field diagnostics.',
    description:
      'Access technical operating procedures or submit a direct inquiry to our certified automotive, generator, and hydraulic engineering team.',
    secondaryHeading: '',
    secondaryText: '',
    image: '',
    stats: [],
    items: TECHNICAL_GUIDES.map((g) => ({
      id: g.id,
      code: g.code,
      category: g.category,
      title: g.title,
      summary: g.summary,
      pages: g.pages,
    })),
  },
  'machinery-header': {
    id: 'machinery-header',
    page: 'machinery',
    eyebrow: 'Earthmoving & Construction · Excavator, JCB & Hydraulic Machinery Parts',
    heading: 'Heavy Machinery Parts: Excavator, JCB & Hydraulic Construction Components',
    description:
      'My Car Parts supplies construction contractors, quarry maintenance yards, and earthmoving fleet teams with excavator, JCB, and heavy construction machinery parts alongside 700-bar hydraulic service systems. Every enquiry is cross-checked by machine serial plate and OEM part code for verified fitment.',
    secondaryHeading: '',
    secondaryText: '',
    image: '../assets/aistudio/image_11c6e947.png',
    stats: [],
    items: [],
  },
  'cars-groups': {
    id: 'cars-groups',
    page: 'cars',
    eyebrow: '',
    heading: 'Car Spare Parts Product Groups',
    description: '',
    secondaryHeading: '',
    secondaryText: '',
    image: '',
    stats: [],
    items: CAR_CATALOG_TABS.map((t) => ({
      id: t.id,
      title: t.label,
      summary: '',
    })),
  },
  'generators-groups': {
    id: 'generators-groups',
    page: 'generators',
    eyebrow: '',
    heading: 'Generator Spare Parts Product Groups',
    description: '',
    secondaryHeading: '',
    secondaryText: '',
    image: '',
    stats: [],
    items: [{ id: 'catalog', title: 'Generator Parts', summary: '' }],
  },
  'machinery-groups': {
    id: 'machinery-groups',
    page: 'machinery',
    eyebrow: '',
    heading: 'Heavy Machinery Product Groups',
    description: '',
    secondaryHeading: '',
    secondaryText: '',
    image: '',
    stats: [],
    items: [{ id: 'catalog', title: 'Heavy Machinery Parts', summary: '' }],
  },
};

export const DEFAULT_PAGE_GROUPS: Record<'cars' | 'generators' | 'machinery', CarCatalogTab[]> = {
  cars: CAR_CATALOG_TABS,
  generators: [{ id: 'catalog', label: 'Generator Parts' }],
  machinery: [{ id: 'catalog', label: 'Heavy Machinery Parts' }],
};

function requireAdminUid(): string {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Admin sign-in is required to save changes.');
  }
  return user.uid;
}

export function carItemToCatalogProduct(
  item: CarSubCategoryItem,
  sortOrder: number,
): CatalogProductData {
  return {
    id: item.id,
    page: 'cars',
    sortOrder,
    title: item.title,
    subsystem: '',
    tab: item.tab,
    iconKey: item.iconKey || 'wrench',
    image: item.image || '',
    cover: false,
    summary: item.summary,
    components: [...item.components],
  };
}

export function catalogProductToCarItem(p: CatalogProductData): CarSubCategoryItem {
  return {
    id: p.id,
    tab: (p.tab as CarCatalogTabId) || 'car-parts',
    title: p.title,
    image: p.image || undefined,
    iconKey: (p.iconKey as CarSubCategoryItem['iconKey']) || 'wrench',
    summary: p.summary,
    components: p.components,
  };
}

export function generatorItemToCatalogProduct(
  item: GeneratorPartItem,
  sortOrder: number,
): CatalogProductData {
  return {
    id: item.id,
    page: 'generators',
    sortOrder,
    title: item.title,
    subsystem: item.subsystem,
    tab: 'catalog',
    iconKey: 'cog',
    image: item.image,
    cover: Boolean(item.cover),
    summary: item.summary,
    components: [...item.components],
  };
}

export function catalogProductToGeneratorItem(p: CatalogProductData): GeneratorPartItem {
  return {
    id: p.id,
    tab: p.tab || 'catalog',
    title: p.title,
    subsystem: p.subsystem,
    image: p.image,
    cover: p.cover,
    summary: p.summary,
    components: p.components,
  };
}

export function machineryItemToCatalogProduct(
  item: MachineryPartItem,
  sortOrder: number,
): CatalogProductData {
  return {
    id: item.id,
    page: 'machinery',
    sortOrder,
    title: item.title,
    subsystem: item.subsystem,
    tab: 'catalog',
    iconKey: 'cog',
    image: item.image,
    cover: Boolean(item.cover),
    summary: item.summary,
    components: [...item.components],
  };
}

export function catalogProductToMachineryItem(p: CatalogProductData): MachineryPartItem {
  return {
    id: p.id,
    tab: p.tab || 'catalog',
    title: p.title,
    subsystem: p.subsystem,
    image: p.image,
    cover: p.cover,
    summary: p.summary,
    components: p.components,
  };
}

export function getDefaultCatalogProducts(
  page: 'cars' | 'generators' | 'machinery',
): CatalogProductData[] {
  if (page === 'cars') {
    return CAR_CATALOG_ITEMS.map((item, i) => carItemToCatalogProduct(item, i));
  }
  if (page === 'generators') {
    return GENERATOR_PARTS_CATALOG.map((item, i) => generatorItemToCatalogProduct(item, i));
  }
  return MACHINERY_PARTS_CATALOG.map((item, i) => machineryItemToCatalogProduct(item, i));
}

export function getDefaultPromoBanners(
  page: 'cars' | 'generators',
): (CarPromoBanner & { sortOrder: number; page: 'cars' | 'generators' })[] {
  const source = page === 'cars' ? CAR_PROMO_BANNERS : GENERATOR_PROMO_BANNERS;
  return source.map((b, i) => ({ ...b, page, sortOrder: i }));
}

// ---------------- READ OPERATIONS (Public Storefront & Admin) ----------------

export async function fetchSiteSections(): Promise<Record<string, SiteSectionData>> {
  const path = 'site_sections';
  try {
    const q = query(
      collection(db, path),
      where('page', 'in', ['main', 'cars', 'generators', 'machinery']),
    );
    const snap = await getDocs(q);
    const merged: Record<string, SiteSectionData> = { ...DEFAULT_SITE_SECTIONS };
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      merged[docSnap.id] = {
        id: docSnap.id,
        page: (d.page as CmsPageId) || 'main',
        eyebrow: String(d.eyebrow ?? ''),
        heading: String(d.heading ?? ''),
        description: String(d.description ?? ''),
        secondaryHeading: String(d.secondaryHeading ?? ''),
        secondaryText: String(d.secondaryText ?? ''),
        image: String(d.image ?? ''),
        stats: Array.isArray(d.stats) ? (d.stats as SiteSectionStat[]) : [],
        items: Array.isArray(d.items) ? (d.items as SiteSectionItem[]) : [],
      };
    });
    return merged;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export function getPageGroupsFromSections(
  page: 'cars' | 'generators' | 'machinery',
  sections?: Record<string, SiteSectionData>,
): CarCatalogTab[] {
  const sectionId = `${page}-groups`;
  const defaults = DEFAULT_PAGE_GROUPS[page];
  const items = sections?.[sectionId]?.items;
  if (!items || items.length === 0) {
    return defaults;
  }
  const mapped = items
    .map((it) => ({
      id: sanitizeId(it.id, ''),
      label: clampString(it.title || '', 60),
    }))
    .filter((g) => Boolean(g.id && g.label));
  return mapped.length > 0 ? mapped : defaults;
}

export function getCarGroupsFromSections(
  sections?: Record<string, SiteSectionData>,
): CarCatalogTab[] {
  return getPageGroupsFromSections('cars', sections);
}

export async function fetchPageGroups(
  page: 'cars' | 'generators' | 'machinery',
): Promise<CarCatalogTab[]> {
  const sectionId = `${page}-groups`;
  const path = `site_sections/${sectionId}`;
  const defaults = DEFAULT_PAGE_GROUPS[page];
  try {
    const snap = await getDoc(doc(db, 'site_sections', sectionId));
    if (!snap.exists()) {
      return defaults;
    }
    const data = snap.data();
    const items = Array.isArray(data.items) ? (data.items as SiteSectionItem[]) : [];
    const mapped = items
      .map((it) => ({
        id: sanitizeId(String(it.id || ''), ''),
        label: clampString(String(it.title || ''), 60),
      }))
      .filter((g) => Boolean(g.id && g.label));
    return mapped.length > 0 ? mapped : defaults;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function fetchCarGroups(): Promise<CarCatalogTab[]> {
  return fetchPageGroups('cars');
}

export async function fetchHeroSlides(): Promise<(HeroSlideItem & { sortOrder: number })[]> {
  const path = 'hero_slides';
  try {
    const q = query(collection(db, path), where('sortOrder', '>=', 0));
    const snap = await getDocs(q);
    if (snap.empty) {
      return HERO_INVENTORY_SLIDES.map((s, i) => ({ ...s, sortOrder: i }));
    }
    return snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          sortOrder: Number(data.sortOrder ?? 0),
          toolId: String(data.toolId ?? ''),
          categoryLabel: String(data.categoryLabel ?? ''),
          sku: String(data.sku ?? ''),
          title: String(data.title ?? ''),
          specSummary: String(data.specSummary ?? ''),
          image: String(data.image ?? ''),
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function fetchDivisionCards(): Promise<(CategoryCardData & { sortOrder: number })[]> {
  const path = 'division_cards';
  try {
    const q = query(collection(db, path), where('id', 'in', ['cars', 'generators', 'machinery']));
    const snap = await getDocs(q);
    if (snap.empty) {
      return CATEGORY_CARDS.map((c, i) => ({ ...c, sortOrder: i }));
    }
    return snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id as ToolCategory,
          sortOrder: Number(data.sortOrder ?? 0),
          indexLabel: String(data.indexLabel ?? ''),
          title: String(data.title ?? ''),
          subtitle: String(data.subtitle ?? ''),
          description: String(data.description ?? ''),
          image: String(data.image ?? ''),
          ctaLabel: String(data.ctaLabel ?? 'Explore'),
          highlights: Array.isArray(data.highlights)
            ? (data.highlights as { label: string; value: string }[])
            : [],
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function fetchToolInventory(): Promise<(ToolItem & { sortOrder: number })[]> {
  const path = 'tool_inventory';
  try {
    const q = query(
      collection(db, path),
      where('category', 'in', ['cars', 'generators', 'machinery']),
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      return TOOL_INVENTORY.map((t, i) => ({ ...t, sortOrder: i }));
    }
    return snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          sortOrder: Number(data.sortOrder ?? 0),
          sku: String(data.sku ?? ''),
          name: String(data.name ?? ''),
          category: (data.category as ToolCategory) || 'cars',
          categoryLabel: String(data.categoryLabel ?? ''),
          image: String(data.image ?? ''),
          shortDesc: String(data.shortDesc ?? ''),
          fullDesc: String(data.fullDesc ?? ''),
          price: Number(data.price ?? 0),
          availability: (data.availability as 'In Stock' | 'Built to Order') || 'In Stock',
          warranty: String(data.warranty ?? ''),
          specs: Array.isArray(data.specs)
            ? (data.specs as { label: string; value: string }[])
            : [],
          applications: Array.isArray(data.applications) ? (data.applications as string[]) : [],
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function fetchPromoBanners(
  page: 'cars' | 'generators',
): Promise<(CarPromoBanner & { sortOrder: number; page: 'cars' | 'generators' })[]> {
  const path = 'promo_banners';
  try {
    const q = query(collection(db, path), where('page', '==', page));
    const snap = await getDocs(q);
    if (snap.empty) {
      return getDefaultPromoBanners(page);
    }
    return snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          page: (data.page as 'cars' | 'generators') || page,
          sortOrder: Number(data.sortOrder ?? 0),
          title: String(data.title ?? ''),
          subtitle: String(data.subtitle ?? ''),
          image: String(data.image ?? ''),
          enquiryTopic: String(data.enquiryTopic ?? ''),
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function fetchCarMakes(): Promise<(CarMakeEntry & { sortOrder: number })[]> {
  const path = 'car_makes';
  try {
    const q = query(collection(db, path), where('sortOrder', '>=', 0));
    const snap = await getDocs(q);
    if (snap.empty) {
      return CAR_MAKES_DIRECTORY.map((m, i) => ({ ...m, sortOrder: i }));
    }
    return snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          sortOrder: Number(data.sortOrder ?? 0),
          brand: String(data.brand ?? ''),
          models: Array.isArray(data.models) ? (data.models as string[]) : [],
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function fetchCatalogProducts(
  page: 'cars' | 'generators' | 'machinery',
): Promise<CatalogProductData[]> {
  const path = 'catalog_products';
  try {
    const q = query(collection(db, path), where('page', '==', page));
    const snap = await getDocs(q);
    if (snap.empty) {
      return getDefaultCatalogProducts(page);
    }
    return snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          page: (data.page as 'cars' | 'generators' | 'machinery') || page,
          sortOrder: Number(data.sortOrder ?? 0),
          title: String(data.title ?? ''),
          subsystem: String(data.subsystem ?? ''),
          tab: String(data.tab ?? 'catalog'),
          iconKey: String(data.iconKey ?? 'wrench'),
          image: String(data.image ?? ''),
          cover: Boolean(data.cover),
          summary: String(data.summary ?? ''),
          components: Array.isArray(data.components) ? (data.components as string[]) : [],
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

// ---------------- ADMIN WRITE OPERATIONS ----------------

function buildSiteSectionPayload(section: SiteSectionData, uid: string) {
  return {
    id: sanitizeId(section.id, 'section'),
    page: section.page,
    eyebrow: clampString(section.eyebrow, CMS_LIMITS.EYEBROW_MAX),
    heading: clampString(section.heading || 'Section Heading', CMS_LIMITS.HEADING_MAX),
    description: clampString(section.description, CMS_LIMITS.DESCRIPTION_MAX),
    secondaryHeading: clampString(section.secondaryHeading, CMS_LIMITS.HEADING_MAX),
    secondaryText: clampString(section.secondaryText, CMS_LIMITS.DESCRIPTION_MAX),
    image: clampString(section.image, CMS_LIMITS.IMAGE_MAX),
    stats: section.stats.slice(0, CMS_LIMITS.STATS_MAX_COUNT).map((s) => ({
      label: clampString(s.label, 120),
      value: clampString(s.value, 120),
    })),
    items: section.items.slice(0, CMS_LIMITS.ITEMS_MAX_COUNT).map((it) => ({
      id: sanitizeId(it.id || 'item'),
      code: clampString(it.code || '', 60),
      category: clampString(it.category || '', 120),
      title: clampString(it.title || 'Item', CMS_LIMITS.TITLE_MAX),
      summary: clampString(it.summary || '', CMS_LIMITS.SUMMARY_MAX),
      pages: clampString(it.pages || '', 120),
    })),
    updatedBy: uid,
  };
}

export async function saveSiteSection(section: SiteSectionData): Promise<void> {
  const uid = requireAdminUid();
  const id = sanitizeId(section.id, 'section');
  const docRef = doc(db, 'site_sections', id);
  const path = `site_sections/${id}`;
  try {
    const snap = await getDoc(docRef);
    const payload = buildSiteSectionPayload(section, uid);
    if (!snap.exists()) {
      await setDoc(docRef, {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(docRef, {
        page: payload.page,
        eyebrow: payload.eyebrow,
        heading: payload.heading,
        description: payload.description,
        secondaryHeading: payload.secondaryHeading,
        secondaryText: payload.secondaryText,
        image: payload.image,
        stats: payload.stats,
        items: payload.items,
        updatedBy: payload.updatedBy,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

function buildHeroSlidePayload(slide: HeroSlideItem & { sortOrder: number }, uid: string) {
  return {
    id: sanitizeId(slide.id, 'slide'),
    sortOrder: Math.max(0, Math.min(1000, Math.round(slide.sortOrder))),
    toolId: sanitizeId(slide.toolId || 'vk-car-torque', 'vk-car-torque'),
    categoryLabel: clampString(slide.categoryLabel || 'Equipment', CMS_LIMITS.CATEGORY_LABEL_MAX),
    sku: clampString(slide.sku || 'SKU-001', CMS_LIMITS.SKU_MAX),
    title: clampString(slide.title || 'Untitled Slide', CMS_LIMITS.TITLE_MAX),
    specSummary: clampString(slide.specSummary || '', CMS_LIMITS.SPEC_SUMMARY_MAX),
    image: clampString(slide.image || '', CMS_LIMITS.IMAGE_MAX),
    updatedBy: uid,
  };
}

export async function saveHeroSlide(
  slide: HeroSlideItem & { sortOrder: number },
  currentSlides: (HeroSlideItem & { sortOrder: number })[],
): Promise<void> {
  const uid = requireAdminUid();
  const path = 'hero_slides';
  try {
    const existingSnap = await getDocs(
      query(collection(db, path), where('sortOrder', '>=', 0)),
    );
    if (existingSnap.empty) {
      const batch = writeBatch(db);
      const merged = currentSlides.some((s) => s.id === slide.id)
        ? currentSlides.map((s) => (s.id === slide.id ? slide : s))
        : [...currentSlides, slide];
      merged.forEach((item, idx) => {
        const p = buildHeroSlidePayload({ ...item, sortOrder: idx }, uid);
        batch.set(doc(db, path, p.id), {
          ...p,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      return;
    }

    const p = buildHeroSlidePayload(slide, uid);
    const ref = doc(db, path, p.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...p,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        sortOrder: p.sortOrder,
        toolId: p.toolId,
        categoryLabel: p.categoryLabel,
        sku: p.sku,
        title: p.title,
        specSummary: p.specSummary,
        image: p.image,
        updatedBy: p.updatedBy,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${path}/${slide.id}`);
  }
}

export async function deleteHeroSlide(
  id: string,
  currentSlides: (HeroSlideItem & { sortOrder: number })[],
): Promise<void> {
  const uid = requireAdminUid();
  const path = 'hero_slides';
  try {
    const existingSnap = await getDocs(
      query(collection(db, path), where('sortOrder', '>=', 0)),
    );
    if (existingSnap.empty) {
      const batch = writeBatch(db);
      currentSlides
        .filter((s) => s.id !== id)
        .forEach((item, idx) => {
          const p = buildHeroSlidePayload({ ...item, sortOrder: idx }, uid);
          batch.set(doc(db, path, p.id), {
            ...p,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });
      await batch.commit();
      return;
    }
    await deleteDoc(doc(db, path, sanitizeId(id)));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${path}/${id}`);
  }
}

function buildDivisionCardPayload(card: CategoryCardData & { sortOrder: number }, uid: string) {
  return {
    id: card.id,
    sortOrder: Math.max(0, Math.min(100, Math.round(card.sortOrder))),
    indexLabel: clampString(card.indexLabel || 'Division', CMS_LIMITS.CATEGORY_LABEL_MAX),
    title: clampString(card.title || 'Division Title', 160),
    subtitle: clampString(card.subtitle || '', 200),
    description: clampString(card.description || 'Division description', 1500),
    image: clampString(card.image || '', CMS_LIMITS.IMAGE_MAX),
    ctaLabel: clampString(card.ctaLabel || 'More Details', 100),
    highlights: card.highlights.slice(0, 6).map((h) => ({
      label: clampString(h.label, 80),
      value: clampString(h.value, 120),
    })),
    updatedBy: uid,
  };
}

export async function saveDivisionCard(
  card: CategoryCardData & { sortOrder: number },
  currentCards: (CategoryCardData & { sortOrder: number })[],
): Promise<void> {
  const uid = requireAdminUid();
  const path = 'division_cards';
  try {
    const existingSnap = await getDocs(
      query(collection(db, path), where('id', 'in', ['cars', 'generators', 'machinery'])),
    );
    if (existingSnap.empty) {
      const batch = writeBatch(db);
      currentCards
        .map((c) => (c.id === card.id ? card : c))
        .forEach((item, idx) => {
          const p = buildDivisionCardPayload({ ...item, sortOrder: idx }, uid);
          batch.set(doc(db, path, p.id), {
            ...p,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });
      await batch.commit();
      return;
    }

    const p = buildDivisionCardPayload(card, uid);
    const ref = doc(db, path, p.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...p,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        sortOrder: p.sortOrder,
        indexLabel: p.indexLabel,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        image: p.image,
        ctaLabel: p.ctaLabel,
        highlights: p.highlights,
        updatedBy: p.updatedBy,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${path}/${card.id}`);
  }
}

function buildToolInventoryPayload(tool: ToolItem & { sortOrder: number }, uid: string) {
  return {
    id: sanitizeId(tool.id, 'tool'),
    sortOrder: Math.max(0, Math.min(1000, Math.round(tool.sortOrder))),
    sku: clampString(tool.sku || 'VK-001', CMS_LIMITS.SKU_MAX),
    name: clampString(tool.name || 'Tool Item', CMS_LIMITS.TITLE_MAX),
    category: tool.category,
    categoryLabel: clampString(tool.categoryLabel || 'Parts', CMS_LIMITS.CATEGORY_LABEL_MAX),
    image: clampString(tool.image || '', CMS_LIMITS.IMAGE_MAX),
    shortDesc: clampString(tool.shortDesc || '', 600),
    fullDesc: clampString(tool.fullDesc || '', 1500),
    price: Math.max(0, Number(tool.price) || 0),
    availability: tool.availability,
    warranty: clampString(tool.warranty || '', 200),
    specs: tool.specs.slice(0, 10).map((s) => ({
      label: clampString(s.label, 80),
      value: clampString(s.value, 140),
    })),
    applications: tool.applications
      .map((a) => clampString(a, 240))
      .filter(Boolean)
      .slice(0, 10),
    updatedBy: uid,
  };
}

export async function saveToolInventoryItem(
  tool: ToolItem & { sortOrder: number },
  currentTools: (ToolItem & { sortOrder: number })[],
): Promise<void> {
  const uid = requireAdminUid();
  const path = 'tool_inventory';
  try {
    const existingSnap = await getDocs(
      query(collection(db, path), where('category', 'in', ['cars', 'generators', 'machinery'])),
    );
    if (existingSnap.empty) {
      const batch = writeBatch(db);
      const merged = currentTools.some((t) => t.id === tool.id)
        ? currentTools.map((t) => (t.id === tool.id ? tool : t))
        : [...currentTools, tool];
      merged.forEach((item, idx) => {
        const p = buildToolInventoryPayload({ ...item, sortOrder: idx }, uid);
        batch.set(doc(db, path, p.id), {
          ...p,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      return;
    }

    const p = buildToolInventoryPayload(tool, uid);
    const ref = doc(db, path, p.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...p,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        sortOrder: p.sortOrder,
        sku: p.sku,
        name: p.name,
        category: p.category,
        categoryLabel: p.categoryLabel,
        image: p.image,
        shortDesc: p.shortDesc,
        fullDesc: p.fullDesc,
        price: p.price,
        availability: p.availability,
        warranty: p.warranty,
        specs: p.specs,
        applications: p.applications,
        updatedBy: p.updatedBy,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${path}/${tool.id}`);
  }
}

export async function deleteToolInventoryItem(
  id: string,
  currentTools: (ToolItem & { sortOrder: number })[],
): Promise<void> {
  const uid = requireAdminUid();
  const path = 'tool_inventory';
  try {
    const existingSnap = await getDocs(
      query(collection(db, path), where('category', 'in', ['cars', 'generators', 'machinery'])),
    );
    if (existingSnap.empty) {
      const batch = writeBatch(db);
      currentTools
        .filter((t) => t.id !== id)
        .forEach((item, idx) => {
          const p = buildToolInventoryPayload({ ...item, sortOrder: idx }, uid);
          batch.set(doc(db, path, p.id), {
            ...p,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });
      await batch.commit();
      return;
    }
    await deleteDoc(doc(db, path, sanitizeId(id)));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${path}/${id}`);
  }
}

function buildPromoBannerPayload(
  banner: CarPromoBanner & { sortOrder: number; page: 'cars' | 'generators' },
  uid: string,
) {
  return {
    id: sanitizeId(banner.id, 'banner'),
    page: banner.page,
    sortOrder: Math.max(0, Math.min(1000, Math.round(banner.sortOrder))),
    title: clampString(banner.title || 'Banner Title', 180),
    subtitle: clampString(banner.subtitle || '', CMS_LIMITS.SUBTITLE_MAX),
    image: clampString(banner.image || '', CMS_LIMITS.IMAGE_MAX),
    enquiryTopic: clampString(banner.enquiryTopic || banner.title, CMS_LIMITS.ENQUIRY_TOPIC_MAX),
    updatedBy: uid,
  };
}

export async function savePromoBanner(
  banner: CarPromoBanner & { sortOrder: number; page: 'cars' | 'generators' },
  currentBanners: (CarPromoBanner & { sortOrder: number; page: 'cars' | 'generators' })[],
): Promise<void> {
  const uid = requireAdminUid();
  const path = 'promo_banners';
  try {
    const existingSnap = await getDocs(
      query(collection(db, path), where('page', '==', banner.page)),
    );
    if (existingSnap.empty) {
      const batch = writeBatch(db);
      const merged = currentBanners.some((b) => b.id === banner.id)
        ? currentBanners.map((b) => (b.id === banner.id ? banner : b))
        : [...currentBanners, banner];
      merged.forEach((item, idx) => {
        const p = buildPromoBannerPayload({ ...item, sortOrder: idx }, uid);
        batch.set(doc(db, path, p.id), {
          ...p,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      return;
    }

    const p = buildPromoBannerPayload(banner, uid);
    const ref = doc(db, path, p.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...p,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        page: p.page,
        sortOrder: p.sortOrder,
        title: p.title,
        subtitle: p.subtitle,
        image: p.image,
        enquiryTopic: p.enquiryTopic,
        updatedBy: p.updatedBy,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${path}/${banner.id}`);
  }
}

export async function deletePromoBanner(
  id: string,
  page: 'cars' | 'generators',
  currentBanners: (CarPromoBanner & { sortOrder: number; page: 'cars' | 'generators' })[],
): Promise<void> {
  const uid = requireAdminUid();
  const path = 'promo_banners';
  try {
    const existingSnap = await getDocs(
      query(collection(db, path), where('page', '==', page)),
    );
    if (existingSnap.empty) {
      const batch = writeBatch(db);
      currentBanners
        .filter((b) => b.id !== id)
        .forEach((item, idx) => {
          const p = buildPromoBannerPayload({ ...item, sortOrder: idx }, uid);
          batch.set(doc(db, path, p.id), {
            ...p,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });
      await batch.commit();
      return;
    }
    await deleteDoc(doc(db, path, sanitizeId(id)));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${path}/${id}`);
  }
}

function buildCarMakePayload(make: CarMakeEntry & { sortOrder: number }, uid: string) {
  return {
    id: sanitizeId(make.id, 'make'),
    sortOrder: Math.max(0, Math.min(1000, Math.round(make.sortOrder))),
    brand: clampString(make.brand || 'Brand', CMS_LIMITS.BRAND_MAX),
    models: make.models
      .map((m) => clampString(m, 100))
      .filter(Boolean)
      .slice(0, CMS_LIMITS.MODELS_MAX_COUNT),
    updatedBy: uid,
  };
}

export async function saveCarMake(
  make: CarMakeEntry & { sortOrder: number },
  currentMakes: (CarMakeEntry & { sortOrder: number })[],
): Promise<void> {
  const uid = requireAdminUid();
  const path = 'car_makes';
  try {
    const existingSnap = await getDocs(
      query(collection(db, path), where('sortOrder', '>=', 0)),
    );
    if (existingSnap.empty) {
      const batch = writeBatch(db);
      const merged = currentMakes.some((m) => m.id === make.id)
        ? currentMakes.map((m) => (m.id === make.id ? make : m))
        : [...currentMakes, make];
      merged.forEach((item, idx) => {
        const p = buildCarMakePayload({ ...item, sortOrder: idx }, uid);
        batch.set(doc(db, path, p.id), {
          ...p,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      return;
    }

    const p = buildCarMakePayload(make, uid);
    const ref = doc(db, path, p.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...p,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        sortOrder: p.sortOrder,
        brand: p.brand,
        models: p.models,
        updatedBy: p.updatedBy,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${path}/${make.id}`);
  }
}

export async function deleteCarMake(
  id: string,
  currentMakes: (CarMakeEntry & { sortOrder: number })[],
): Promise<void> {
  const uid = requireAdminUid();
  const path = 'car_makes';
  try {
    const existingSnap = await getDocs(
      query(collection(db, path), where('sortOrder', '>=', 0)),
    );
    if (existingSnap.empty) {
      const batch = writeBatch(db);
      currentMakes
        .filter((m) => m.id !== id)
        .forEach((item, idx) => {
          const p = buildCarMakePayload({ ...item, sortOrder: idx }, uid);
          batch.set(doc(db, path, p.id), {
            ...p,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });
      await batch.commit();
      return;
    }
    await deleteDoc(doc(db, path, sanitizeId(id)));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${path}/${id}`);
  }
}

function buildCatalogProductPayload(product: CatalogProductData, uid: string) {
  return {
    id: sanitizeId(product.id, 'product'),
    page: product.page,
    sortOrder: Math.max(0, Math.min(5000, Math.round(product.sortOrder))),
    title: clampString(product.title || 'Product Title', 180),
    subsystem: clampString(product.subsystem || '', CMS_LIMITS.SUBSYSTEM_MAX),
    tab: clampString(product.tab || 'catalog', 60),
    iconKey: clampString(product.iconKey || 'wrench', 40),
    image: clampString(product.image || '', CMS_LIMITS.IMAGE_MAX),
    cover: Boolean(product.cover),
    summary: clampString(product.summary || 'Product description', CMS_LIMITS.SUMMARY_MAX),
    components: product.components
      .map((c) => clampString(c, 220))
      .filter(Boolean)
      .slice(0, CMS_LIMITS.COMPONENTS_MAX_COUNT),
    updatedBy: uid,
  };
}

export async function saveCatalogProduct(
  product: CatalogProductData,
  currentProducts: CatalogProductData[],
): Promise<void> {
  const uid = requireAdminUid();
  const path = 'catalog_products';
  try {
    const existingSnap = await getDocs(
      query(collection(db, path), where('page', '==', product.page)),
    );
    if (existingSnap.empty) {
      const batch = writeBatch(db);
      const merged = currentProducts.some((c) => c.id === product.id)
        ? currentProducts.map((c) => (c.id === product.id ? product : c))
        : [...currentProducts, product];
      merged.forEach((item, idx) => {
        const p = buildCatalogProductPayload({ ...item, sortOrder: idx }, uid);
        batch.set(doc(db, path, p.id), {
          ...p,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      return;
    }

    const p = buildCatalogProductPayload(product, uid);
    const ref = doc(db, path, p.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...p,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        page: p.page,
        sortOrder: p.sortOrder,
        title: p.title,
        subsystem: p.subsystem,
        tab: p.tab,
        iconKey: p.iconKey,
        image: p.image,
        cover: p.cover,
        summary: p.summary,
        components: p.components,
        updatedBy: p.updatedBy,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${path}/${product.id}`);
  }
}

export async function deleteCatalogProduct(
  id: string,
  page: 'cars' | 'generators' | 'machinery',
  currentProducts: CatalogProductData[],
): Promise<void> {
  const uid = requireAdminUid();
  const path = 'catalog_products';
  try {
    const existingSnap = await getDocs(
      query(collection(db, path), where('page', '==', page)),
    );
    if (existingSnap.empty) {
      const batch = writeBatch(db);
      currentProducts
        .filter((c) => c.id !== id)
        .forEach((item, idx) => {
          const p = buildCatalogProductPayload({ ...item, sortOrder: idx }, uid);
          batch.set(doc(db, path, p.id), {
            ...p,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });
      await batch.commit();
      return;
    }
    await deleteDoc(doc(db, path, sanitizeId(id)));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${path}/${id}`);
  }
}

export async function savePageGroups(
  page: 'cars' | 'generators' | 'machinery',
  groups: CarCatalogTab[],
): Promise<void> {
  const cleanGroups = groups
    .map((g) => ({
      id: sanitizeId(g.id, ''),
      label: clampString(g.label, 60),
    }))
    .filter((g) => Boolean(g.id && g.label))
    .slice(0, CMS_LIMITS.ITEMS_MAX_COUNT);

  if (cleanGroups.length === 0) {
    throw new Error('At least one product group is required.');
  }

  const sectionHeading =
    page === 'cars'
      ? 'Car Spare Parts Product Groups'
      : page === 'generators'
        ? 'Generator Spare Parts Product Groups'
        : 'Heavy Machinery Product Groups';

  await saveSiteSection({
    id: `${page}-groups`,
    page,
    eyebrow: '',
    heading: sectionHeading,
    description: '',
    secondaryHeading: '',
    secondaryText: '',
    image: '',
    stats: [],
    items: cleanGroups.map((g) => ({
      id: g.id,
      title: g.label,
      summary: '',
    })),
  });
}

export async function saveCarGroups(groups: CarCatalogTab[]): Promise<void> {
  return savePageGroups('cars', groups);
}

export async function deleteCatalogGroupAndHandleProducts(
  page: 'cars' | 'generators' | 'machinery',
  groupId: string,
  groups: CarCatalogTab[],
  currentProducts: CatalogProductData[],
  mode: 'reassign' | 'delete-products',
  reassignToGroupId?: string,
): Promise<void> {
  const uid = requireAdminUid();
  const remainingGroups = groups.filter((g) => g.id !== groupId);
  if (remainingGroups.length === 0) {
    throw new Error('Cannot delete the last remaining group.');
  }

  const fallbackGroupId =
    reassignToGroupId && remainingGroups.some((g) => g.id === reassignToGroupId)
      ? reassignToGroupId
      : remainingGroups[0].id;

  const path = 'catalog_products';
  try {
    const existingSnap = await getDocs(
      query(collection(db, path), where('page', '==', page)),
    );

    if (existingSnap.empty) {
      const affected = currentProducts.some((p) => p.tab === groupId);
      if (affected) {
        const batch = writeBatch(db);
        const nextProducts =
          mode === 'delete-products'
            ? currentProducts.filter((p) => p.tab !== groupId)
            : currentProducts.map((p) =>
                p.tab === groupId ? { ...p, tab: fallbackGroupId } : p,
              );
        nextProducts.forEach((item, idx) => {
          const payload = buildCatalogProductPayload({ ...item, sortOrder: idx }, uid);
          batch.set(doc(db, path, payload.id), {
            ...payload,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });
        await batch.commit();
      }
    } else {
      const matchingDocs = existingSnap.docs.filter((d) => d.data().tab === groupId);
      if (matchingDocs.length > 0) {
        const batch = writeBatch(db);
        matchingDocs.forEach((d) => {
          if (mode === 'delete-products') {
            batch.delete(d.ref);
          } else {
            batch.update(d.ref, {
              tab: clampString(fallbackGroupId, 60),
              updatedBy: uid,
              updatedAt: serverTimestamp(),
            });
          }
        });
        await batch.commit();
      }
    }

    await savePageGroups(page, remainingGroups);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${path}/${page}-group-${groupId}`);
  }
}

export async function resetPageGroupsToDefaults(
  page: 'cars' | 'generators' | 'machinery',
): Promise<void> {
  requireAdminUid();
  const sectionId = `${page}-groups`;
  const path = `site_sections/${sectionId}`;
  try {
    const ref = doc(db, 'site_sections', sectionId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await deleteDoc(ref);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function resetCatalogProductsToDefaults(
  page: 'cars' | 'generators' | 'machinery',
): Promise<void> {
  requireAdminUid();
  const path = 'catalog_products';
  try {
    const snap = await getDocs(query(collection(db, path), where('page', '==', page)));
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${path}/${page}`);
  }
}

export async function resetPromoBannersToDefaults(
  page: 'cars' | 'generators',
): Promise<void> {
  requireAdminUid();
  const path = 'promo_banners';
  try {
    const snap = await getDocs(query(collection(db, path), where('page', '==', page)));
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${path}/${page}`);
  }
}

export async function resetCarMakesToDefaults(): Promise<void> {
  requireAdminUid();
  const path = 'car_makes';
  try {
    const snap = await getDocs(query(collection(db, path), where('sortOrder', '>=', 0)));
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function resetHeroSlidesToDefaults(): Promise<void> {
  requireAdminUid();
  const path = 'hero_slides';
  try {
    const snap = await getDocs(query(collection(db, path), where('sortOrder', '>=', 0)));
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function resetDivisionCardsToDefaults(): Promise<void> {
  requireAdminUid();
  const path = 'division_cards';
  try {
    const snap = await getDocs(
      query(collection(db, path), where('id', 'in', ['cars', 'generators', 'machinery'])),
    );
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function resetToolInventoryToDefaults(): Promise<void> {
  requireAdminUid();
  const path = 'tool_inventory';
  try {
    const snap = await getDocs(
      query(collection(db, path), where('category', 'in', ['cars', 'generators', 'machinery'])),
    );
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ---------------- ADMIN RBAC MANAGEMENT ----------------

export async function fetchAdminsList(): Promise<AdminUserRecord[]> {
  const path = 'admins';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        uid: String(data.uid || d.id),
        role: 'admin',
        addedBy: String(data.addedBy || ''),
      };
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function addAdminUid(targetUid: string): Promise<void> {
  const uid = requireAdminUid();
  const cleanId = sanitizeId(targetUid, '');
  if (!cleanId) {
    throw new Error('Please enter a valid Firebase User UID (alphanumeric, -, _).');
  }
  const path = `admins/${cleanId}`;
  try {
    await setDoc(doc(db, 'admins', cleanId), {
      uid: cleanId,
      role: 'admin',
      addedBy: uid,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function removeAdminUid(targetUid: string): Promise<void> {
  requireAdminUid();
  const cleanId = sanitizeId(targetUid, '');
  const path = `admins/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'admins', cleanId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ---------------- TECHNICAL INQUIRIES & ADMIN NOTIFICATIONS ----------------

export interface CreateTechnicalInquiryInput {
  contactName: string;
  mobileNo: string;
  equipmentDivision: EquipmentDivisionOption;
  partName: string;
  toolSkuSerial?: string;
  technicalDetails: string;
  adminMobileNo?: string;
}

export async function submitTechnicalInquiry(
  input: CreateTechnicalInquiryInput,
): Promise<{ id: string; ticketCode: string; adminMobileNo: string }> {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const ticketCode = `VK-${randomDigits}`;
  const id = sanitizeId(`inq-${Date.now()}-${randomDigits}`, `inq-${Date.now()}`);
  const path = `technical_inquiries/${id}`;

  const adminMobileNo = clampString(
    input.adminMobileNo?.trim() || DEFAULT_ADMIN_MOBILE_NO,
    CMS_LIMITS.INQUIRY_MOBILE_MAX,
  );

  const payload = {
    id,
    ticketCode,
    title: 'New Inquiry Mail' as const,
    contactName: clampString(input.contactName, CMS_LIMITS.INQUIRY_NAME_MAX),
    mobileNo: clampString(input.mobileNo, CMS_LIMITS.INQUIRY_MOBILE_MAX),
    equipmentDivision: input.equipmentDivision,
    partName: clampString(input.partName, CMS_LIMITS.INQUIRY_PART_MAX),
    toolSkuSerial: clampString(input.toolSkuSerial || '', CMS_LIMITS.INQUIRY_SKU_MAX),
    technicalDetails: clampString(input.technicalDetails, CMS_LIMITS.INQUIRY_DETAILS_MAX),
    adminMobileNo,
    status: 'unread' as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'technical_inquiries', id), payload);
    return { id, ticketCode, adminMobileNo };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export function subscribeTechnicalInquiries(
  onUpdate: (items: TechnicalInquiryRecord[]) => void,
  onError?: (err: unknown) => void,
): () => void {
  const path = 'technical_inquiries';
  const q = query(collection(db, path), where('status', 'in', ['unread', 'read']));

  return onSnapshot(
    q,
    (snap) => {
      const records: TechnicalInquiryRecord[] = snap.docs
        .map((d) => {
          const data = d.data();
          const ts = data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now();
          return {
            id: d.id,
            ticketCode: String(data.ticketCode || ''),
            title: 'New Inquiry Mail' as const,
            contactName: String(data.contactName || ''),
            mobileNo: String(data.mobileNo || ''),
            equipmentDivision:
              (data.equipmentDivision as EquipmentDivisionOption) || 'Car Spare Parts',
            partName: String(data.partName || ''),
            toolSkuSerial: String(data.toolSkuSerial || ''),
            technicalDetails: String(data.technicalDetails || ''),
            adminMobileNo: String(data.adminMobileNo || DEFAULT_ADMIN_MOBILE_NO),
            status: (data.status === 'read' ? 'read' : 'unread') as 'unread' | 'read',
            createdAtMs: ts,
          };
        })
        .sort((a, b) => b.createdAtMs - a.createdAtMs);
      onUpdate(records);
    },
    (err) => {
      if (onError) {
        onError(err);
      } else {
        try {
          handleFirestoreError(err, OperationType.LIST, path);
        } catch (e) {
          console.error(e);
        }
      }
    },
  );
}

export async function markTechnicalInquiryRead(inquiryId: string): Promise<void> {
  requireAdminUid();
  const cleanId = sanitizeId(inquiryId, '');
  if (!cleanId) return;
  const path = `technical_inquiries/${cleanId}`;
  try {
    await updateDoc(doc(db, 'technical_inquiries', cleanId), {
      status: 'read',
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function markAllTechnicalInquiriesRead(
  inquiries: TechnicalInquiryRecord[],
): Promise<void> {
  requireAdminUid();
  const unread = inquiries.filter((i) => i.status === 'unread');
  if (unread.length === 0) return;
  const path = 'technical_inquiries';
  try {
    const batch = writeBatch(db);
    unread.forEach((item) => {
      batch.update(doc(db, path, sanitizeId(item.id)), {
        status: 'read',
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteTechnicalInquiry(inquiryId: string): Promise<void> {
  requireAdminUid();
  const cleanId = sanitizeId(inquiryId, '');
  if (!cleanId) return;
  const path = `technical_inquiries/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'technical_inquiries', cleanId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
