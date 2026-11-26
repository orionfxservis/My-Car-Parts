import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  CarCatalogTab,
  CarMakeEntry,
  CarPromoBanner,
} from '../../data/carPartsCatalog';
import {
  CatalogProductData,
  DEFAULT_PAGE_GROUPS,
  DEFAULT_SITE_SECTIONS,
  SiteSectionData,
  deleteCarMake,
  deleteCatalogGroupAndHandleProducts,
  deleteCatalogProduct,
  deletePromoBanner,
  resetCarMakesToDefaults,
  resetCatalogProductsToDefaults,
  resetPageGroupsToDefaults,
  resetPromoBannersToDefaults,
  saveCarMake,
  saveCatalogProduct,
  savePageGroups,
  savePromoBanner,
  saveSiteSection,
} from '../../lib/cmsService';
import { resolveAssetUrl, sanitizeId } from '../../lib/cmsValidation';
import { AdminBulkUploadModal } from './AdminBulkUploadModal';
import { ImageFieldEditor } from './ImageFieldEditor';
import { ProductGalleryEditor } from './ProductGalleryEditor';

interface AdminCatalogPageManagerProps {
  page: 'cars' | 'generators' | 'machinery';
  banners?: (CarPromoBanner & { sortOrder: number; page: 'cars' | 'generators' })[];
  makes?: (CarMakeEntry & { sortOrder: number })[];
  groups?: CarCatalogTab[];
  headerSection?: SiteSectionData;
  products: CatalogProductData[];
  onRefresh: () => Promise<void>;
}

export function AdminCatalogPageManager({
  page,
  banners = [],
  makes = [],
  groups,
  headerSection,
  products,
  onRefresh,
}: AdminCatalogPageManagerProps) {
  const defaultPageGroups = DEFAULT_PAGE_GROUPS[page];
  const pageGroups = groups && groups.length > 0 ? groups : defaultPageGroups;

  const initialSection =
    page === 'machinery' ? 'header' : 'products';
  const [subTab, setSubTab] = useState<'products' | 'banners' | 'makes' | 'header'>(
    initialSection === 'header' ? 'products' : 'products',
  );
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Editable modals / drafts
  const [editingProduct, setEditingProduct] = useState<CatalogProductData | null>(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [addGroupModalOpen, setAddGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [deletingGroup, setDeletingGroup] = useState<CarCatalogTab | null>(null);
  const [deleteGroupMode, setDeleteGroupMode] = useState<'reassign' | 'delete-products'>('reassign');
  const [reassignGroupId, setReassignGroupId] = useState<string>('');
  const [editingBanner, setEditingBanner] = useState<
    (CarPromoBanner & { sortOrder: number; page: 'cars' | 'generators' }) | null
  >(null);
  const [editingMake, setEditingMake] = useState<(CarMakeEntry & { sortOrder: number }) | null>(
    null,
  );
  const [headerDraft, setHeaderDraft] = useState<SiteSectionData>(
    headerSection ?? DEFAULT_SITE_SECTIONS['machinery-header'],
  );

  useEffect(() => {
    setHeaderDraft(headerSection ?? DEFAULT_SITE_SECTIONS['machinery-header']);
  }, [headerSection]);

  useEffect(() => {
    if (
      groupFilter !== 'all' &&
      !pageGroups.some((g) => g.id === groupFilter)
    ) {
      setGroupFilter('all');
    }
  }, [pageGroups, groupFilter]);

  const notify = (msg: string) => {
    setErrorMsg('');
    setStatusMsg(msg);
  };

  const fail = (err: unknown) => {
    setStatusMsg('');
    setErrorMsg(err instanceof Error ? err.message : 'Operation failed.');
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((item) => {
      if (groupFilter !== 'all' && item.tab !== groupFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subsystem.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q)
      );
    });
  }, [products, groupFilter, searchQuery]);

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    setSaving(true);
    try {
      await saveCatalogProduct(editingProduct, products);
      setEditingProduct(null);
      await onRefresh();
      notify(`Saved product card "${editingProduct.title}".`);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (item: CatalogProductData) => {
    setSaving(true);
    try {
      await deleteCatalogProduct(item.id, page, products);
      await onRefresh();
      notify(`Removed product card "${item.title}".`);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBanner = async () => {
    if (!editingBanner || page === 'machinery') return;
    setSaving(true);
    try {
      await savePromoBanner(editingBanner, banners);
      setEditingBanner(null);
      await onRefresh();
      notify(`Saved promo banner "${editingBanner.title}".`);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBanner = async (banner: CarPromoBanner) => {
    if (page === 'machinery') return;
    setSaving(true);
    try {
      await deletePromoBanner(banner.id, page, banners);
      await onRefresh();
      notify(`Deleted promo banner "${banner.title}".`);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMake = async () => {
    if (!editingMake) return;
    setSaving(true);
    try {
      await saveCarMake(editingMake, makes);
      setEditingMake(null);
      await onRefresh();
      notify(`Saved car brand "${editingMake.brand}".`);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMake = async (make: CarMakeEntry) => {
    setSaving(true);
    try {
      await deleteCarMake(make.id, makes);
      await onRefresh();
      notify(`Removed car brand "${make.brand}".`);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMachineryHeader = async () => {
    setSaving(true);
    try {
      await saveSiteSection(headerDraft);
      await onRefresh();
      notify('Heavy Machinery Page Header & Right Image updated.');
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateGroup = async () => {
    const trimmed = newGroupName.trim().slice(0, 60);
    if (!trimmed) return;
    const generatedId = sanitizeId(trimmed, `group-${Date.now()}`).slice(0, 60);
    if (
      pageGroups.some(
        (g) => g.id === generatedId || g.label.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      fail(new Error(`A group named "${trimmed}" already exists.`));
      return;
    }
    setSaving(true);
    try {
      const nextGroups = [...pageGroups, { id: generatedId, label: trimmed }];
      await savePageGroups(page, nextGroups);
      setNewGroupName('');
      setAddGroupModalOpen(false);
      setGroupFilter(generatedId);
      await onRefresh();
      notify(`Added product group "${trimmed}".`);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDeleteGroup = async () => {
    if (!deletingGroup) return;
    setSaving(true);
    try {
      await deleteCatalogGroupAndHandleProducts(
        page,
        deletingGroup.id,
        pageGroups,
        products,
        deleteGroupMode,
        reassignGroupId,
      );
      const removedLabel = deletingGroup.label;
      if (groupFilter === deletingGroup.id) {
        setGroupFilter('all');
      }
      setDeletingGroup(null);
      await onRefresh();
      notify(`Deleted product group "${removedLabel}".`);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const groupsCustomized =
    pageGroups.length !== defaultPageGroups.length ||
    pageGroups.some(
      (g, i) => g.id !== defaultPageGroups[i]?.id || g.label !== defaultPageGroups[i]?.label,
    );

  const availableSections: { id: 'products' | 'banners' | 'makes' | 'header'; label: string }[] =
    page === 'cars'
      ? [
          { id: 'products', label: `Product Cards (${products.length})` },
          { id: 'banners', label: `Top Promo Banners (${banners.length})` },
          { id: 'makes', label: `Car Brands & Models (${makes.length})` },
        ]
      : page === 'generators'
        ? [
            { id: 'products', label: `Product Cards (${products.length})` },
            { id: 'banners', label: `Top Promo Banners (${banners.length})` },
          ]
        : [
            { id: 'products', label: `Product Cards (${products.length})` },
            { id: 'header', label: 'Page Header & Right Image' },
          ];

  return (
    <div className="space-y-6">
      {/* Separate Section Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        {availableSections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => {
              setSubTab(sec.id);
              setStatusMsg('');
              setErrorMsg('');
            }}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md border transition-colors cursor-pointer ${
              subTab === sec.id
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-950'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {statusMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm font-medium text-red-900">
          {errorMsg}
        </div>
      )}

      {/* PRODUCT CARDS SECTION (Car / Generator / Heavy Machinery) */}
      {subTab === 'products' && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                {page === 'cars'
                  ? 'Car Spare Parts — Product Cards'
                  : page === 'generators'
                    ? 'Industrial Generator Spare Parts — Product Cards'
                    : 'Heavy Machinery Parts — Product Cards'}
              </h3>
              <p className="text-xs text-slate-500">
                Click Edit on any product card to update its image, title, description, or included components.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  try {
                    await resetCatalogProductsToDefaults(page);
                    await onRefresh();
                    notify('Product cards restored to original defaults.');
                  } catch (err) {
                    fail(err);
                  } finally {
                    setSaving(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewGroupName('');
                  setAddGroupModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Groups</span>
              </button>
              <button
                type="button"
                onClick={() => setBulkUploadOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Bulk Upload (10+)</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditingProduct({
                    id: `${page}-item-${Date.now()}`,
                    page,
                    sortOrder: products.length,
                    title: '',
                    subsystem:
                      page === 'cars'
                        ? ''
                        : page === 'generators'
                          ? 'Generator Subsystem'
                          : 'Heavy Machinery Subsystem',
                    tab:
                      groupFilter !== 'all'
                        ? groupFilter
                        : pageGroups[0]?.id || (page === 'cars' ? 'car-parts' : 'catalog'),
                    iconKey: 'wrench',
                    image: '',
                    images: [],
                    cover: false,
                    summary: '',
                    components: ['Genuine / OEM specification spare part'],
                    brand: '',
                    sku: '',
                    price: 0,
                    availability: 'In Stock',
                    compatibility: '',
                    warranty: 'OEM Fitment Verified · 30-Day Return Policy',
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Product Card</span>
              </button>
            </div>
          </div>

          {/* Search & Group Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg p-3.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setGroupFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                  groupFilter === 'all'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Groups ({products.length})
              </button>
              {pageGroups.map((t) => {
                const isActive = groupFilter === t.id;
                return (
                  <div
                    key={t.id}
                    className={`inline-flex items-center rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setGroupFilter(t.id)}
                      className={`${pageGroups.length > 1 ? 'pl-3 pr-2' : 'px-3'} py-1.5 cursor-pointer`}
                    >
                      {t.label}
                    </button>
                    {pageGroups.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const remaining = pageGroups.filter((g) => g.id !== t.id);
                          setReassignGroupId(remaining[0]?.id || '');
                          setDeleteGroupMode('reassign');
                          setDeletingGroup(t);
                        }}
                        aria-label={`Delete group ${t.label}`}
                        title={`Delete group "${t.label}"`}
                        className={`mr-1 p-0.5 rounded cursor-pointer transition-colors ${
                          isActive
                            ? 'text-slate-800 hover:bg-black/15 hover:text-slate-950'
                            : 'text-slate-400 hover:bg-red-100 hover:text-red-600'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                );
              })}
              {groupsCustomized && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await resetPageGroupsToDefaults(page);
                      setGroupFilter('all');
                      await onRefresh();
                      notify('Product groups restored to defaults.');
                    } catch (err) {
                      fail(err);
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:text-slate-950 bg-white border border-slate-200 hover:bg-slate-50 rounded-md cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span>Reset Groups</span>
                </button>
              )}
            </div>

            <div className="relative w-full md:w-64">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search product cards..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((item, idx) => {
              const imgUrl = resolveAssetUrl(item.image, '..');
              const groupLabel = pageGroups.find((t) => t.id === item.tab)?.label || item.tab;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="relative aspect-[4/3] bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden p-2">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={item.title}
                          className={
                            item.cover
                              ? 'w-full h-full object-cover rounded'
                              : 'max-h-full max-w-full object-contain'
                          }
                        />
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">
                          Icon Card ({item.iconKey || 'wrench'})
                        </span>
                      )}
                      {(() => {
                        const count =
                          item.images && item.images.length > 0
                            ? item.images.length
                            : imgUrl
                              ? 1
                              : 0;
                        return count > 1 ? (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono tabular-nums">
                            {count} / 10 Photos
                          </span>
                        ) : null;
                      })()}
                    </div>
                    <div className="p-4 space-y-1.5">
                      <p className="text-[11px] font-semibold text-amber-700 truncate">
                        {page === 'cars'
                          ? groupLabel
                          : pageGroups.length > 1
                            ? `${groupLabel} · ${item.subsystem || 'Catalog Item'}`
                            : item.subsystem || 'Catalog Item'}
                      </p>
                      <h4 className="text-sm font-bold text-slate-950 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct({ ...item, sortOrder: idx })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Edit Card</span>
                    </button>
                    <button
                      type="button"
                      disabled={saving || products.length <= 1}
                      onClick={() => handleDeleteProduct(item)}
                      className="p-1.5 text-slate-500 hover:text-red-600 disabled:opacity-40 cursor-pointer"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROMO BANNERS SECTION (Car Parts & Generator Parts) */}
      {subTab === 'banners' && page !== 'machinery' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Top Promotional &amp; Service Banners
              </h3>
              <p className="text-xs text-slate-500">
                Shown in the scrolling 2-up banner carousel at the top of the page.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  try {
                    await resetPromoBannersToDefaults(page);
                    await onRefresh();
                    notify('Promo banners restored to original defaults.');
                  } catch (err) {
                    fail(err);
                  } finally {
                    setSaving(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditingBanner({
                    id: `${page}-banner-${Date.now()}`,
                    page,
                    sortOrder: banners.length,
                    title: '',
                    subtitle: '',
                    image: '',
                    enquiryTopic: '',
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Banner</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((banner, idx) => (
              <div
                key={banner.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/7] bg-slate-100 overflow-hidden">
                    <img
                      src={resolveAssetUrl(banner.image, '..')}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="text-sm font-bold text-slate-950">{banner.title}</h4>
                    <p className="text-xs text-slate-600">{banner.subtitle}</p>
                    <p className="text-[11px] text-amber-700 font-medium pt-1">
                      Topic: {banner.enquiryTopic}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setEditingBanner({ ...banner, sortOrder: idx })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Edit Banner</span>
                  </button>
                  <button
                    type="button"
                    disabled={saving || banners.length <= 1}
                    onClick={() => handleDeleteBanner(banner)}
                    className="p-1.5 text-slate-500 hover:text-red-600 disabled:opacity-40 cursor-pointer"
                    aria-label={`Delete ${banner.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CAR MAKES & MODELS DIRECTORY (Car Parts Page) */}
      {subTab === 'makes' && page === 'cars' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Shop by Car Brand &amp; Model Directory
              </h3>
              <p className="text-xs text-slate-500">
                Manage car brands and vehicle model names shown directly under the Car Parts banner.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  try {
                    await resetCarMakesToDefaults();
                    await onRefresh();
                    notify('Car brands & models restored to original defaults.');
                  } catch (err) {
                    fail(err);
                  } finally {
                    setSaving(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditingMake({
                    id: `make-${Date.now()}`,
                    sortOrder: makes.length,
                    brand: '',
                    models: [],
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Brand</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {makes.map((make, idx) => (
              <div
                key={make.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-slate-950">{make.brand}</h4>
                    <span className="text-[11px] font-mono text-slate-500">
                      {make.models.length} models
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {make.models.join(', ')}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setEditingMake({ ...make, sortOrder: idx })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-amber-400 hover:text-slate-950 rounded-md cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Edit Models</span>
                  </button>
                  <button
                    type="button"
                    disabled={saving || makes.length <= 1}
                    onClick={() => handleDeleteMake(make)}
                    className="p-1.5 text-slate-500 hover:text-red-600 disabled:opacity-40 cursor-pointer"
                    aria-label={`Delete ${make.brand}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* HEAVY MACHINERY HEADER & RIGHT IMAGE */}
      {subTab === 'header' && page === 'machinery' && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Heavy Machinery Page — Header &amp; Right-Side Feature Image
              </h3>
              <p className="text-xs text-slate-500">
                Updates the top title, intro paragraph, and right-side machinery image on /pages/heavy-machinery-parts.html.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHeaderDraft(DEFAULT_SITE_SECTIONS['machinery-header'])}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Load Defaults</span>
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveMachineryHeader}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{saving ? 'Saving...' : 'Save Header Section'}</span>
              </button>
            </div>
          </div>

          <ImageFieldEditor
            label="Right-Side Feature Image"
            value={headerDraft.image}
            onChange={(img) => setHeaderDraft({ ...headerDraft, image: img })}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Eyebrow</label>
            <input
              type="text"
              value={headerDraft.eyebrow}
              onChange={(e) => setHeaderDraft({ ...headerDraft, eyebrow: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Main Page Headline (H1)
            </label>
            <input
              type="text"
              value={headerDraft.heading}
              onChange={(e) => setHeaderDraft({ ...headerDraft, heading: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Header Description
            </label>
            <textarea
              rows={4}
              value={headerDraft.description}
              onChange={(e) => setHeaderDraft({ ...headerDraft, description: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
            />
          </div>
        </section>
      )}

      {/* PRODUCT CARD EDITOR MODAL */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-950">
                Edit Product Card — Image &amp; Description
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <ProductGalleryEditor
                primaryImage={editingProduct.image}
                images={editingProduct.images || []}
                onChange={(nextPrimary, nextGallery) =>
                  setEditingProduct({
                    ...editingProduct,
                    image: nextPrimary,
                    images: nextGallery,
                  })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        title: e.target.value,
                        id:
                          editingProduct.id.includes('-item-') && e.target.value
                            ? sanitizeId(`${page}-${e.target.value}`, editingProduct.id)
                            : editingProduct.id,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {page === 'cars' ? 'Parts Category Group' : 'Product Group'}
                  </label>
                  <select
                    value={editingProduct.tab}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tab: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:border-amber-500"
                  >
                    {pageGroups.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {page !== 'cars' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Subsystem / Category Label
                    </label>
                    <input
                      type="text"
                      value={editingProduct.subsystem}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, subsystem: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={editingProduct.cover}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, cover: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span>Fill card frame (object-cover)</span>
                  </label>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Brand / Quality
                  </label>
                  <input
                    type="text"
                    value={editingProduct.brand || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, brand: e.target.value })
                    }
                    placeholder="e.g. DENSO / OEM"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    SKU / Part Code
                  </label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, sku: e.target.value })
                    }
                    placeholder="e.g. DA-17801"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Price (Rs / PKR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.price ?? 0}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    placeholder="0 = Quote"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Availability
                  </label>
                  <select
                    value={editingProduct.availability || 'In Stock'}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, availability: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Built to Order">Built to Order</option>
                    <option value="On Order">On Order</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Vehicle Compatibility / Application (Optional)
                </label>
                <input
                  type="text"
                  value={editingProduct.compatibility || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, compatibility: e.target.value })
                  }
                  placeholder="e.g. Toyota Corolla 2008–2026 XLi / GLi / Altis / Grande"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.summary}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, summary: e.target.value })
                  }
                  placeholder="Describe this spare part group, compatibility, and technical standards..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Available Components / Key Features (one per line, max 15)
                </label>
                <textarea
                  rows={4}
                  value={editingProduct.components.join('\n')}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      components: e.target.value.split('\n'),
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Warranty / Return Note (Optional)
                </label>
                <input
                  type="text"
                  value={editingProduct.warranty || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, warranty: e.target.value })
                  }
                  placeholder="e.g. OEM Fitment Verified · 30-Day Return Policy"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving || !editingProduct.title.trim() || !editingProduct.summary.trim()}
                  onClick={handleSaveProduct}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 rounded-md cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Product Card'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BANNER EDITOR MODAL */}
      {editingBanner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setEditingBanner(null)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-950">Edit Promo Banner</h3>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <ImageFieldEditor
                label="Banner Image"
                value={editingBanner.image}
                onChange={(img) => setEditingBanner({ ...editingBanner, image: img })}
              />
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Banner Title *
                </label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  value={editingBanner.subtitle}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, subtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Enquiry Topic
                </label>
                <input
                  type="text"
                  value={editingBanner.enquiryTopic}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, enquiryTopic: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving || !editingBanner.title.trim()}
                  onClick={handleSaveBanner}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 rounded-md cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Banner'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CAR BRAND & MODELS MODAL */}
      {editingMake && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setEditingMake(null)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-950">Edit Car Brand &amp; Models</h3>
              <button
                type="button"
                onClick={() => setEditingMake(null)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  value={editingMake.brand}
                  onChange={(e) =>
                    setEditingMake({
                      ...editingMake,
                      brand: e.target.value,
                      id:
                        editingMake.id.startsWith('make-') && e.target.value
                          ? sanitizeId(e.target.value, editingMake.id)
                          : editingMake.id,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Car Model Names (one per line, max 60)
                </label>
                <textarea
                  rows={10}
                  value={editingMake.models.join('\n')}
                  onChange={(e) =>
                    setEditingMake({ ...editingMake, models: e.target.value.split('\n') })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMake(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving || !editingMake.brand.trim()}
                  onClick={handleSaveMake}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 rounded-md cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Brand & Models'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ADD NEW GROUP MODAL */}
      {addGroupModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setAddGroupModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-950">
                Add Product Group —{' '}
                {page === 'cars'
                  ? 'Car Spare Parts'
                  : page === 'generators'
                    ? 'Generator Spare Parts'
                    : 'Heavy Machinery Parts'}
              </h3>
              <button
                type="button"
                onClick={() => setAddGroupModalOpen(false)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newGroupName.trim()) {
                      e.preventDefault();
                      void handleCreateGroup();
                    }
                  }}
                  placeholder={
                    page === 'cars'
                      ? 'e.g. Tires & Wheels or Hybrid Parts'
                      : page === 'generators'
                        ? 'e.g. AVR & Electronics or Filters'
                        : 'e.g. Undercarriage or Hydraulic Pumps'
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
                {newGroupName.trim() && (
                  <p className="mt-1.5 text-[11px] text-slate-500 font-mono">
                    Group ID: {sanitizeId(newGroupName, 'group')}
                  </p>
                )}
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddGroupModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving || !newGroupName.trim()}
                  onClick={handleCreateGroup}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 rounded-md cursor-pointer"
                >
                  {saving ? 'Adding...' : 'Create Group'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE GROUP CONFIRMATION MODAL */}
      {deletingGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setDeletingGroup(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-950">
                Delete Group &ldquo;{deletingGroup.label}&rdquo;
              </h3>
              <button
                type="button"
                onClick={() => setDeletingGroup(null)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const affectedCount = products.filter((p) => p.tab === deletingGroup.id).length;
                const remainingGroups = pageGroups.filter((g) => g.id !== deletingGroup.id);
                return affectedCount > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <strong>{affectedCount}</strong> product card
                      {affectedCount === 1 ? ' belongs' : 's belong'} to{' '}
                      <strong>{deletingGroup.label}</strong>. Choose what to do with them:
                    </p>
                    <div className="space-y-2.5 bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="deleteGroupMode"
                          checked={deleteGroupMode === 'reassign'}
                          onChange={() => setDeleteGroupMode('reassign')}
                          className="mt-0.5 accent-amber-500"
                        />
                        <div className="flex-1 space-y-2">
                          <span className="font-semibold text-slate-900 block">
                            Move product cards to another group
                          </span>
                          {deleteGroupMode === 'reassign' && (
                            <select
                              value={reassignGroupId}
                              onChange={(e) => setReassignGroupId(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:border-amber-500"
                            >
                              {remainingGroups.map((g) => (
                                <option key={g.id} value={g.id}>
                                  {g.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                        <input
                          type="radio"
                          name="deleteGroupMode"
                          checked={deleteGroupMode === 'delete-products'}
                          onChange={() => setDeleteGroupMode('delete-products')}
                          className="accent-red-600"
                        />
                        <span className="font-semibold text-red-700">
                          Also delete those {affectedCount} product card
                          {affectedCount === 1 ? '' : 's'}
                        </span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Are you sure you want to delete the empty group{' '}
                    <strong className="text-slate-900">{deletingGroup.label}</strong>? This will
                    remove it from the storefront tabs.
                  </p>
                );
              })()}

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeletingGroup(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleConfirmDeleteGroup}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 disabled:opacity-60 rounded-md cursor-pointer"
                >
                  {saving ? 'Deleting...' : 'Delete Group'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK UPLOAD PRODUCTS MODAL (MIN 10 EXPANDABLE SLOTS) */}
      <AdminBulkUploadModal
        open={bulkUploadOpen}
        page={page}
        groups={pageGroups}
        defaultGroupId={
          groupFilter !== 'all' ? groupFilter : pageGroups[0]?.id || 'car-parts'
        }
        existingProducts={products}
        onClose={() => setBulkUploadOpen(false)}
        onSuccess={async (uploadedCount) => {
          setBulkUploadOpen(false);
          await onRefresh();
          notify(`Uploaded ${uploadedCount} product card${uploadedCount === 1 ? '' : 's'}.`);
        }}
      />
    </div>
  );
}
