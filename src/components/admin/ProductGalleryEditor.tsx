import { ChangeEvent, useId, useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { CMS_LIMITS, compressImageToDataUrl, resolveAssetUrl } from '../../lib/cmsValidation';

interface ProductGalleryEditorProps {
  primaryImage: string;
  images: string[];
  onChange: (nextPrimaryImage: string, nextImages: string[]) => void;
}

export function ProductGalleryEditor({
  primaryImage,
  images,
  onChange,
}: ProductGalleryEditorProps) {
  const fileId = useId();
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Merge primaryImage + images cleanly without losing existing card photo
  const normalizedGallery = (() => {
    const clean = images.map((s) => s.trim()).filter(Boolean);
    if (clean.length > 0) return clean.slice(0, CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT);
    if (primaryImage.trim()) return [primaryImage.trim()];
    return [];
  })();

  const remainingSlots = Math.max(0, CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT - normalizedGallery.length);

  const commitGallery = (nextList: string[]) => {
    const clean = nextList.map((s) => s.trim()).filter(Boolean).slice(0, CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT);
    onChange(clean[0] || '', clean);
  };

  const handleFilesSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files || []);
    e.target.value = '';
    if (fileList.length === 0) return;

    if (remainingSlots <= 0) {
      setErrorMsg(`Maximum ${CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT} images reached for this product.`);
      return;
    }

    const toProcess = fileList.slice(0, remainingSlots);
    setUploading(true);
    setErrorMsg('');
    setStatusMsg('');

    try {
      const nextList = [...normalizedGallery];
      let addedCount = 0;

      for (const file of toProcess) {
        // Compress cleanly within per-image budget so all 10 images fit safely inside 1MB Firestore document
        const { dataUrl } = await compressImageToDataUrl(
          file,
          760,
          CMS_LIMITS.GALLERY_IMAGE_MAX,
        );
        const currentTotalChars = nextList.reduce((sum, s) => sum + s.length, 0) + (nextList[0]?.length || 0);
        if (currentTotalChars + dataUrl.length > CMS_LIMITS.GALLERY_TOTAL_CHARS_MAX) {
          // Retry with tighter compression for dense 10-photo sets
          const tighter = await compressImageToDataUrl(file, 580, 48000);
          nextList.push(tighter.dataUrl);
        } else {
          nextList.push(dataUrl);
        }
        addedCount += 1;
      }

      commitGallery(nextList);
      setStatusMsg(
        `Added ${addedCount} image${addedCount === 1 ? '' : 's'} (${nextList.length}/${CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT} total).`,
      );
      if (fileList.length > toProcess.length) {
        setErrorMsg(
          `Only ${toProcess.length} of ${fileList.length} selected files were added (max ${CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT} images per product).`,
        );
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to process selected image(s).');
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setErrorMsg('');
    if (normalizedGallery.length >= CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT) {
      setErrorMsg(`Maximum ${CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT} images allowed.`);
      return;
    }
    commitGallery([...normalizedGallery, trimmed]);
    setUrlInput('');
    setStatusMsg(`Added image URL (${normalizedGallery.length + 1}/${CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT}).`);
  };

  const handleSetMain = (index: number) => {
    if (index <= 0 || index >= normalizedGallery.length) return;
    const selected = normalizedGallery[index];
    const rest = normalizedGallery.filter((_, i) => i !== index);
    commitGallery([selected, ...rest]);
    setStatusMsg('Updated primary card image.');
  };

  const handleRemoveAt = (index: number) => {
    const next = normalizedGallery.filter((_, i) => i !== index);
    commitGallery(next);
    setStatusMsg('');
    setErrorMsg('');
  };

  return (
    <div className="space-y-3 bg-slate-50/70 border border-slate-200 rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold text-slate-900">
            Product Images ({normalizedGallery.length} / {CMS_LIMITS.GALLERY_IMAGES_MAX_COUNT} max)
          </label>
          <p className="text-[11px] text-slate-500">
            Upload 1 to 10 photos (select multiple files at once or add one by one). Image #1 is the card cover photo.
          </p>
        </div>

        <label
          htmlFor={fileId}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            remainingSlots === 0
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>
            {uploading
              ? 'Uploading...'
              : remainingSlots > 0
                ? 'Upload Photos (Max 10)'
                : '10 / 10 Uploaded'}
          </span>
        </label>
        <input
          id={fileId}
          type="file"
          multiple
          accept="image/*"
          disabled={remainingSlots === 0 || uploading}
          onChange={handleFilesSelect}
          className="sr-only"
        />
      </div>

      {/* Paste Image URL Row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddUrl();
            }
          }}
          disabled={remainingSlots === 0}
          placeholder="Or paste https://... image URL and click Add"
          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-amber-500 disabled:bg-slate-100"
        />
        <button
          type="button"
          disabled={remainingSlots === 0 || !urlInput.trim()}
          onClick={handleAddUrl}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 disabled:opacity-50 rounded-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Add URL</span>
        </button>
      </div>

      {statusMsg && <p className="text-[11px] font-medium text-emerald-700">{statusMsg}</p>}
      {errorMsg && <p className="text-[11px] font-medium text-red-600">{errorMsg}</p>}

      {/* Uploaded Images Preview Grid */}
      {normalizedGallery.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {normalizedGallery.map((imgSrc, idx) => (
            <div
              key={`${idx}-${imgSrc.slice(0, 32)}`}
              className={`group relative rounded-lg border bg-white p-1.5 flex flex-col gap-1.5 ${
                idx === 0 ? 'border-amber-500 ring-1 ring-amber-400/40' : 'border-slate-200'
              }`}
            >
              <div className="aspect-[4/3] w-full bg-slate-50 rounded flex items-center justify-center overflow-hidden">
                <img
                  src={resolveAssetUrl(imgSrc, '..')}
                  alt={`Product photo ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between gap-1 text-[10px]">
                <span className="font-mono font-semibold text-slate-700">
                  {idx === 0 ? '#1 Main' : `#${idx + 1}`}
                </span>
                <div className="flex items-center gap-0.5">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetMain(idx)}
                      title="Set as Main Card Photo"
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 cursor-pointer"
                    >
                      <ArrowLeft className="w-2.5 h-2.5" aria-hidden="true" />
                      <span>Main</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveAt(idx)}
                    aria-label={`Remove image ${idx + 1}`}
                    className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-5 rounded-md border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center gap-1 text-slate-400 text-xs">
          <ImageIcon className="w-5 h-5" aria-hidden="true" />
          <span>No photos uploaded yet — upload 1 to 10 product images above</span>
        </div>
      )}
    </div>
  );
}
