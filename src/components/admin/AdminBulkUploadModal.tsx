import { ChangeEvent, useState } from 'react';
import { ImagePlus, Plus, Trash2, Upload, X } from 'lucide-react';
import { CarCatalogTab } from '../../data/carPartsCatalog';
import { CatalogProductData, saveBulkCatalogProducts } from '../../lib/cmsService';
import { CMS_LIMITS, compressImageToDataUrl, resolveAssetUrl, sanitizeId } from '../../lib/cmsValidation';

export interface BulkProductDraftRow {
  rowKey: string;
  title: string;
  tab: string;
  brand: string;
  sku: string;
  price: string;
  availability: string;
  compatibility: string;
  summary: string;
  componentsText: string;
  image: string;
  images: string[];
}

function createEmptyRow(defaultTab: string, index: number): BulkProductDraftRow {
  return {
    rowKey: `bulk-row-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    title: '',
    tab: defaultTab,
    brand: '',
    sku: '',
    price: '',
    availability: 'In Stock',
    compatibility: '',
    summary: '',
    componentsText: '',
    image: '',
    images: [],
  };
}

interface AdminBulkUploadModalProps {
  open: boolean;
  page: 'cars' | 'generators' | 'machinery';
  groups: CarCatalogTab[];
  defaultGroupId: string;
  existingProducts: CatalogProductData[];
  onClose: () => void;
  onSuccess: (uploadedCount: number) => Promise<void>;
}

export function AdminBulkUploadModal({
  open,
  page,
  groups,
  defaultGroupId,
  existingProducts,
  onClose,
  onSuccess,
}: AdminBulkUploadModalProps) {
  const initialTab = defaultGroupId || groups[0]?.id || 'car-parts';
  const [rows, setRows] = useState<BulkProductDraftRow[]>(() =>
    Array.from({ length: 10 }, (_, idx) => createEmptyRow(initialTab, idx)),
  );
  const [sharedGroup, setSharedGroup] = useState<string>(initialTab);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!open) return null;

  const updateRow = (rowKey: string, patch: Partial<BulkProductDraftRow>) => {
    setRows((prev) => prev.map((r) => (r.rowKey === rowKey ? { ...r, ...patch } : r)));
  };

  const handleApplySharedGroup = (groupId: string) => {
    setSharedGroup(groupId);
    setRows((prev) => prev.map((r) => ({ ...r, tab: groupId })));
  };

  const handleAddMoreRows = (count = 5) => {
    setRows((prev) => [
      ...prev,
      ...Array.from({ length: count }, (_, idx) => createEmptyRow(sharedGroup, prev.length + idx)),
    ]);
  };

  const handleRemoveRow = (rowKey: string) => {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.rowKey !== rowKey)));
  };

  const handleRowImagesUpload = async (rowKey: string, e: ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files || []);
    e.target.value = '';
    if (fileList.length === 0) return;
    setErrorMsg('');

    const targetRow = rows.find((r) => r.rowKey === rowKey);
    const existingImages = targetRow ? targetRow.images : [];
    const remainingSlots = Math.max(0, CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT - existingImages.length);

    if (remainingSlots <= 0) {
      setErrorMsg(`Maximum ${CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT} images per product card.`);
      return;
    }

    try {
      const nextImages = [...existingImages];
      for (const file of fileList.slice(0, remainingSlots)) {
        const { dataUrl } = await compressImageToDataUrl(file, 760, CMS_LIMITS.GALLERY_IMAGE_MAX);
        const totalChars =
          nextImages.reduce((sum, s) => sum + s.length, 0) + (nextImages[0]?.length || 0);
        if (totalChars + dataUrl.length > CMS_LIMITS.GALLERY_TOTAL_CHARS_MAX) {
          const tighter = await compressImageToDataUrl(file, 580, 48000);
          nextImages.push(tighter.dataUrl);
        } else {
          nextImages.push(dataUrl);
        }
      }
      updateRow(rowKey, {
        images: nextImages,
        image: nextImages[0] || '',
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to compress product image(s).');
    }
  };

  const handleRemoveRowImage = (rowKey: string, imgIdx: number) => {
    const targetRow = rows.find((r) => r.rowKey === rowKey);
    if (!targetRow) return;
    const nextImages = targetRow.images.filter((_, i) => i !== imgIdx);
    updateRow(rowKey, {
      images: nextImages,
      image: nextImages[0] || '',
    });
  };

  const filledRows = rows.filter((r) => r.title.trim().length > 0);

  const handleSaveBatch = async () => {
    setErrorMsg('');
    if (filledRows.length === 0) {
      setErrorMsg('Enter at least one Product Title before saving.');
      return;
    }

    setSaving(true);
    try {
      const timestampBase = Date.now();
      const newProducts: CatalogProductData[] = filledRows.map((row, idx) => {
        const cleanTitle = row.title.trim();
        const slugId = sanitizeId(
          `${page}-${cleanTitle}-${timestampBase + idx}`,
          `${page}-item-${timestampBase + idx}`,
        );
        const parsedPrice = Number(row.price);
        const componentList = row.componentsText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .slice(0, 15);

        const gallery = (
          row.images.length > 0 ? row.images : row.image.trim() ? [row.image.trim()] : []
        ).slice(0, CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT);

        return {
          id: slugId,
          page,
          sortOrder: existingProducts.length + idx,
          title: cleanTitle,
          subsystem:
            page === 'cars'
              ? ''
              : page === 'generators'
                ? 'Generator Subsystem'
                : 'Heavy Machinery Subsystem',
          tab: row.tab || sharedGroup,
          iconKey: 'wrench',
          image: gallery[0] || row.image.trim(),
          images: gallery,
          cover: false,
          summary:
            row.summary.trim() ||
            `${cleanTitle} — verified replacement spare part available for immediate enquiry & order.`,
          components:
            componentList.length > 0
              ? componentList
              : ['OEM & certified aftermarket fitment specification'],
          brand: row.brand.trim(),
          sku: row.sku.trim(),
          price: !Number.isNaN(parsedPrice) && parsedPrice > 0 ? parsedPrice : 0,
          availability: row.availability.trim() || 'In Stock',
          compatibility: row.compatibility.trim(),
          warranty: 'OEM Fitment Verified · 30-Day Return Policy',
        };
      });

      const savedCount = await saveBulkCatalogProducts(page, newProducts, existingProducts);
      setRows(Array.from({ length: 10 }, (_, idx) => createEmptyRow(sharedGroup, idx)));
      await onSuccess(savedCount);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Bulk upload failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-upload-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-2 sm:my-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-4 bg-slate-50 border-b border-slate-200">
          <div>
            <h3 id="bulk-upload-modal-title" className="text-base sm:text-lg font-bold text-slate-950">
              Bulk Upload Products (Starts at 10 Slots — Up to 10 Photos Per Product)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Fill any number of products (1 to 10+ or click Add More Rows). Upload 1–10 images per
              product card and leave optional fields blank to auto-fill defaults.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bulk upload modal"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Toolbar: Default Group & Row Adder */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="bulk-shared-group"
                className="text-xs font-semibold text-slate-800 whitespace-nowrap"
              >
                Default Product Group:
              </label>
              <select
                id="bulk-shared-group"
                value={sharedGroup}
                onChange={(e) => handleApplySharedGroup(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:border-amber-500"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                ({rows.length} upload slots · {filledRows.length} filled)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddMoreRows(1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>+1 Row</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddMoreRows(5)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>+5 More Rows</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-md bg-red-50 border border-red-300 text-xs font-medium text-red-900">
              {errorMsg}
            </div>
          )}

          {/* Product Upload Slots List */}
          <div className="max-h-[55vh] overflow-y-auto space-y-3 pr-1">
            {rows.map((row, idx) => {
              const rowGallery =
                row.images.length > 0 ? row.images : row.image.trim() ? [row.image.trim()] : [];
              const canUploadMore = rowGallery.length < CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT;
              return (
                <div
                  key={row.rowKey}
                  className="border border-slate-200 rounded-lg p-3.5 bg-white space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                      Product Slot #{idx + 1} · {rowGallery.length}/{CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT} Photos
                    </span>
                    <div className="flex items-center gap-2">
                      <select
                        value={row.tab}
                        onChange={(e) => updateRow(row.rowKey, { tab: e.target.value })}
                        aria-label={`Product ${idx + 1} group`}
                        className="px-2.5 py-1 text-[11px] border border-slate-300 rounded bg-white"
                      >
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={rows.length <= 1}
                        onClick={() => handleRemoveRow(row.rowKey)}
                        aria-label={`Remove slot ${idx + 1}`}
                        className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    {/* Multi-Image Thumbnails + Upload (Max 10) */}
                    <div className="md:col-span-3 flex flex-col gap-1.5">
                      {rowGallery.length > 0 ? (
                        <div className="grid grid-cols-5 gap-1 p-1.5 rounded border border-slate-200 bg-slate-50">
                          {rowGallery.map((thumb, tIdx) => (
                            <div
                              key={`${tIdx}-${thumb.slice(0, 18)}`}
                              className="relative aspect-square rounded border border-slate-200 bg-white overflow-hidden flex items-center justify-center group"
                            >
                              <img
                                src={resolveAssetUrl(thumb, '..')}
                                alt={`${row.title || `Slot ${idx + 1}`} photo ${tIdx + 1}`}
                                className="max-h-full max-w-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveRowImage(row.rowKey, tIdx)}
                                aria-label={`Remove photo ${tIdx + 1}`}
                                className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-slate-950/60 text-white flex items-center justify-center cursor-pointer transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-full h-16 rounded border border-slate-200 bg-slate-50 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                          <ImagePlus className="w-4 h-4 text-slate-300" aria-hidden="true" />
                          <span>0 / 10 photos</span>
                        </div>
                      )}
                      <label
                        className={`w-full inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-semibold rounded ${
                          canUploadMore
                            ? 'text-slate-800 bg-slate-100 hover:bg-slate-200 cursor-pointer'
                            : 'text-slate-400 bg-slate-100 cursor-not-allowed'
                        }`}
                      >
                        <Upload className="w-3 h-3" aria-hidden="true" />
                        <span>
                          {canUploadMore
                            ? `Upload Photos (${rowGallery.length}/10)`
                            : '10/10 Photos Max'}
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={!canUploadMore}
                          onChange={(e) => handleRowImagesUpload(row.rowKey, e)}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    {/* Product Fields */}
                    <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={row.title}
                          onChange={(e) => updateRow(row.rowKey, { title: e.target.value })}
                          placeholder="Product Title * (e.g. Air Filter DENSO Toyota Corolla)"
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={row.brand}
                          onChange={(e) => updateRow(row.rowKey, { brand: e.target.value })}
                          placeholder="Brand (e.g. DENSO / OEM)"
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={row.sku}
                          onChange={(e) => updateRow(row.rowKey, { sku: e.target.value })}
                          placeholder="SKU"
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="number"
                          min={0}
                          value={row.price}
                          onChange={(e) => updateRow(row.rowKey, { price: e.target.value })}
                          placeholder="Price Rs"
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={row.compatibility}
                          onChange={(e) => updateRow(row.rowKey, { compatibility: e.target.value })}
                          placeholder="Car Compatibility (e.g. Toyota Corolla 2008-2026 XLi/GLi/Altis)"
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={row.summary}
                          onChange={(e) => updateRow(row.rowKey, { summary: e.target.value })}
                          placeholder="Short Description (optional)"
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-4">
                        <input
                          type="text"
                          value={
                            row.image.startsWith('data:')
                              ? `(${rowGallery.length} Uploaded Photo${rowGallery.length === 1 ? '' : 's'} Ready)`
                              : row.image
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            updateRow(row.rowKey, {
                              image: val,
                              images: val.trim() ? [val.trim()] : [],
                            });
                          }}
                          placeholder="Or paste primary image URL (optional)"
                          disabled={row.image.startsWith('data:')}
                          className="w-full px-3 py-1 text-[11px] font-mono border border-slate-200 rounded bg-slate-50 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Save Bar */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-600">
              Ready to upload <strong className="text-slate-950">{filledRows.length}</strong>{' '}
              product{filledRows.length === 1 ? '' : 's'} (blank slots ignored).
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || filledRows.length === 0}
                onClick={handleSaveBatch}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 rounded-md cursor-pointer"
              >
                {saving
                  ? 'Uploading Products...'
                  : `Upload ${filledRows.length} Product${filledRows.length === 1 ? '' : 's'}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
