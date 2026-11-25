import { ChangeEvent, useId, useState } from 'react';
import { Image as ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';
import { compressImageToDataUrl, resolveAssetUrl } from '../../lib/cmsValidation';

interface ImageFieldEditorProps {
  label?: string;
  value: string;
  onChange: (nextValue: string) => void;
  helperText?: string;
}

export function ImageFieldEditor({
  label = 'Card / Section Image',
  value,
  onChange,
  helperText = 'Upload a photo (auto-optimized) or paste an image URL / asset path.',
}: ImageFieldEditorProps) {
  const inputId = useId();
  const fileId = useId();
  const [uploading, setUploading] = useState(false);
  const [uploadInfo, setUploadInfo] = useState('');
  const [uploadError, setUploadError] = useState('');

  const previewSrc = resolveAssetUrl(value, '..');

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    setUploadError('');
    setUploadInfo('');
    try {
      const { dataUrl, approxKb } = await compressImageToDataUrl(file);
      onChange(dataUrl);
      setUploadInfo(`Optimized to ${approxKb} KB — ready to save`);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-800">
          {label}
        </label>
        {uploadInfo && (
          <span className="text-[11px] font-medium text-emerald-700">{uploadInfo}</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3.5 items-start">
        {/* Live Thumbnail Preview */}
        <div className="w-full sm:w-36 aspect-[4/3] rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
          {previewSrc ? (
            <img
              src={previewSrc}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain p-1.5"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-slate-400 text-[11px]">
              <ImageIcon className="w-5 h-5" aria-hidden="true" />
              <span>No image</span>
            </div>
          )}
        </div>

        {/* Upload + URL Controls */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor={fileId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{uploading ? 'Optimizing...' : 'Upload Image'}</span>
            </label>
            <input
              id={fileId}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />

            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setUploadInfo('');
                  setUploadError('');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 bg-white border border-slate-200 hover:border-red-300 rounded-md transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <input
            id={inputId}
            type="text"
            value={value.startsWith('data:') ? '[Uploaded Optimized Image]' : value}
            onChange={(e) => {
              const next = e.target.value;
              if (next !== '[Uploaded Optimized Image]') {
                setUploadInfo('');
                onChange(next);
              }
            }}
            placeholder="Paste https://... image URL or ../assets/..."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/25"
          />

          <p className="text-[11px] text-slate-500">{helperText}</p>
          {uploadError && (
            <p className="text-xs font-medium text-red-600">{uploadError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
