// Validation constants synchronized with firebase-blueprint.json & firestore.rules
export const CMS_LIMITS = {
  ID_PATTERN: /^[a-zA-Z0-9_-]+$/,
  ID_MAX: 128,
  EYEBROW_MAX: 240,
  HEADING_MAX: 300,
  DESCRIPTION_MAX: 2500,
  IMAGE_MAX: 350000,
  TITLE_MAX: 200,
  SUBTITLE_MAX: 400,
  SUMMARY_MAX: 1200,
  SKU_MAX: 60,
  CATEGORY_LABEL_MAX: 120,
  SPEC_SUMMARY_MAX: 240,
  SUBSYSTEM_MAX: 160,
  ENQUIRY_TOPIC_MAX: 240,
  BRAND_MAX: 80,
  MODELS_MAX_COUNT: 60,
  COMPONENTS_MAX_COUNT: 15,
  STATS_MAX_COUNT: 6,
  ITEMS_MAX_COUNT: 25,
  INQUIRY_NAME_MAX: 120,
  INQUIRY_MOBILE_MAX: 32,
  INQUIRY_PART_MAX: 180,
  INQUIRY_SKU_MAX: 80,
  INQUIRY_DETAILS_MAX: 2000,
  AVAILABILITY_MAX: 40,
  COMPATIBILITY_MAX: 400,
  WARRANTY_MAX: 200,
  GALLERY_IMAGES_MAX_COUNT: 10,
  GALLERY_IMAGE_MAX: 72000,
  GALLERY_TOTAL_CHARS_MAX: 850000,
} as const;

export function sanitizeId(raw: string, fallback = 'item'): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, CMS_LIMITS.ID_MAX);
  return cleaned && CMS_LIMITS.ID_PATTERN.test(cleaned) ? cleaned : fallback;
}

/**
 * Firebase Auth UIDs are case-sensitive; validate against ID_PATTERN without lowercasing.
 */
export function sanitizeUid(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > CMS_LIMITS.ID_MAX) return '';
  return CMS_LIMITS.ID_PATTERN.test(trimmed) ? trimmed : '';
}

export function clampString(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

/**
 * Resolves asset paths consistently across root (`index.html`, basePath=".")
 * and `/pages/*.html` (`basePath=".."`), while leaving http(s) and data URLs untouched.
 */
export function resolveAssetUrl(src: string, basePath: '.' | '..' = '.'): string {
  if (!src) return '';
  const trimmed = src.trim();
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Handle bundled or copied src/assets paths
  const srcAssetsIdx = trimmed.indexOf('src/assets/');
  if (srcAssetsIdx !== -1) {
    return `${basePath}/${trimmed.slice(srcAssetsIdx)}`;
  }

  // Handle public / Vite-emitted assets/... paths
  const assetsIdx = trimmed.indexOf('assets/');
  if (assetsIdx !== -1) {
    return `${basePath}/${trimmed.slice(assetsIdx)}`;
  }

  if (trimmed.startsWith('./')) {
    return `${basePath}/${trimmed.slice(2)}`;
  }
  if (trimmed.startsWith('../')) {
    return `${basePath}/${trimmed.slice(3)}`;
  }
  if (trimmed.startsWith('/')) {
    return `${basePath}${trimmed}`;
  }
  return trimmed;
}

/**
 * Compresses an uploaded image File into a crisp data URL sized safely below
 * Firestore's per-document limits so every product card can hold its own custom photo.
 */
export function compressImageToDataUrl(
  file: File,
  maxDimension = 880,
  maxChars = 260000,
): Promise<{ dataUrl: string; approxKb: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported or corrupted image file.'));
      img.onload = () => {
        let targetWidth = img.width || 800;
        let targetHeight = img.height || 600;

        if (targetWidth > maxDimension || targetHeight > maxDimension) {
          const ratio = Math.min(maxDimension / targetWidth, maxDimension / targetHeight);
          targetWidth = Math.max(1, Math.round(targetWidth * ratio));
          targetHeight = Math.max(1, Math.round(targetHeight * ratio));
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable in this browser.'));
          return;
        }

        // White background preserves product cutout clarity for JPEGs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const tryFormats = [
          { mime: 'image/webp', qualities: [0.85, 0.72, 0.58, 0.45] },
          { mime: 'image/jpeg', qualities: [0.85, 0.72, 0.58, 0.45] },
        ];

        for (const fmt of tryFormats) {
          for (const q of fmt.qualities) {
            const candidate = canvas.toDataURL(fmt.mime, q);
            if (candidate.startsWith(`data:${fmt.mime}`) && candidate.length <= maxChars) {
              resolve({
                dataUrl: candidate,
                approxKb: Math.max(1, Math.round((candidate.length * 0.75) / 1024)),
              });
              return;
            }
          }
        }

        // Last resort downscale
        const smallCanvas = document.createElement('canvas');
        smallCanvas.width = Math.max(1, Math.round(targetWidth * 0.6));
        smallCanvas.height = Math.max(1, Math.round(targetHeight * 0.6));
        const sctx = smallCanvas.getContext('2d');
        if (sctx) {
          sctx.fillStyle = '#FFFFFF';
          sctx.fillRect(0, 0, smallCanvas.width, smallCanvas.height);
          sctx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);
          const fallbackUrl = smallCanvas.toDataURL('image/jpeg', 0.6);
          if (fallbackUrl.length <= maxChars) {
            resolve({
              dataUrl: fallbackUrl,
              approxKb: Math.max(1, Math.round((fallbackUrl.length * 0.75) / 1024)),
            });
            return;
          }
        }

        reject(
          new Error(
            'Image is too large after compression. Please choose a smaller image or paste an image URL.',
          ),
        );
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
