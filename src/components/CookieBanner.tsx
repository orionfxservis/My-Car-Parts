import { useState } from 'react';
import { X } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieBannerProps {
  visible: boolean;
  onDismiss: (prefs: CookiePreferences) => void;
}

export function CookieBanner({ visible, onDismiss }: CookieBannerProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [preferencesEnabled, setPreferencesEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  if (!visible) return null;

  const handleAcceptAll = () => {
    setSettingsOpen(false);
    onDismiss({
      essential: true,
      preferences: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    setSettingsOpen(false);
    onDismiss({
      essential: true,
      preferences: false,
      analytics: false,
      marketing: false,
    });
  };

  const handleSaveSettings = () => {
    setSettingsOpen(false);
    onDismiss({
      essential: true,
      preferences: preferencesEnabled,
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
    });
  };

  return (
    <>
      <div
        role="region"
        aria-label="Cookies and local storage consent"
        className="fixed inset-x-0 bottom-0 z-40 bg-[#F7F6F2] text-slate-950 border-t-2 border-amber-500 shadow-2xl"
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-4 sm:py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">
          <div className="max-w-3xl">
            <h2 className="text-sm sm:text-base font-bold text-slate-950">
              Cookies and local storage
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
              We use essential storage for sign-in and site preferences. Optional analytics
              and marketing storage is used only if you accept. You can change this choice
              anytime.
            </p>
            <button
              type="button"
              onClick={() => setPolicyOpen(true)}
              className="mt-1.5 inline-block text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-600 hover:underline underline-offset-4 transition-colors cursor-pointer"
            >
              Cookie Policy
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className={`px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-md border-2 border-amber-500 transition-colors cursor-pointer whitespace-nowrap ${
                settingsOpen
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-transparent text-slate-950 hover:bg-amber-500 active:bg-amber-500'
              }`}
            >
              Cookie settings
            </button>
            <button
              type="button"
              onClick={handleRejectAll}
              className="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-md border-2 border-amber-500 text-slate-950 bg-transparent hover:bg-amber-500 active:bg-amber-500 transition-colors cursor-pointer whitespace-nowrap"
            >
              Reject all
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-md border-2 border-amber-500 bg-amber-500 hover:bg-amber-400 hover:border-amber-400 text-slate-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[#F7F6F2] text-slate-950 rounded-2xl border-2 border-amber-500 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-300/80 flex items-start justify-between gap-4">
              <div>
                <h3 id="cookie-settings-title" className="text-xl font-bold text-slate-950">
                  Cookie settings
                </h3>
                <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">
                  Choose optional categories. Strictly necessary cookies stay on for security
                  and core site function.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close cookie settings"
                className="p-1.5 rounded-md text-slate-600 hover:text-slate-950 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Checkboxes */}
            <div className="px-6 py-5 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-950">Strictly necessary</p>
                  <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                    Always on: required for security and core site function.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  aria-label="Strictly necessary cookies (always active)"
                  className="mt-1 h-4 w-4 rounded accent-slate-400 cursor-not-allowed opacity-60 shrink-0"
                />
              </div>

              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <span className="block text-sm font-bold text-slate-950">Preferences</span>
                  <span className="block text-xs sm:text-sm text-slate-700 mt-0.5">
                    Remember cookie choice and UI preferences.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferencesEnabled}
                  onChange={(e) => setPreferencesEnabled(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-amber-500 cursor-pointer shrink-0"
                />
              </label>

              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <span className="block text-sm font-bold text-slate-950">Analytics</span>
                  <span className="block text-xs sm:text-sm text-slate-700 mt-0.5">
                    Optional usage measurement, not shipped until wired and consented.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-amber-500 cursor-pointer shrink-0"
                />
              </label>

              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <span className="block text-sm font-bold text-slate-950">Marketing</span>
                  <span className="block text-xs sm:text-sm text-slate-700 mt-0.5">
                    Advertising cookies: none ship on public pages in the current release.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={marketingEnabled}
                  onChange={(e) => setMarketingEnabled(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-amber-500 cursor-pointer shrink-0"
                />
              </label>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-300/80 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2.5 text-sm font-semibold rounded-md border-2 border-amber-500 text-slate-950 bg-transparent hover:bg-amber-500 transition-colors cursor-pointer whitespace-nowrap"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-6 py-2.5 text-sm font-semibold rounded-md border-2 border-amber-500 bg-amber-500 hover:bg-amber-400 hover:border-amber-400 text-slate-950 transition-colors cursor-pointer whitespace-nowrap"
              >
                Save settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Policy Modal */}
      {policyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-policy-modal-title"
          onClick={() => setPolicyOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#F7F6F2] text-slate-950 rounded-2xl border-2 border-amber-500 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-300/80">
              <div>
                <h3 id="cookie-policy-modal-title" className="text-lg font-bold text-slate-950">
                  Cookie Policy
                </h3>
                <p className="text-xs text-slate-700 mt-0.5">
                  My Car Parts Ltd. · Effective November 2026
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPolicyOpen(false)}
                aria-label="Close cookie policy"
                className="p-1.5 rounded-md text-slate-600 hover:text-slate-950 hover:bg-slate-200/70 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <div>
                <h4 className="font-semibold text-slate-950">1. Essential Storage</h4>
                <p className="mt-1">
                  Essential cookies and local storage preserve your selected equipment quote
                  items, active filters, and your consent choice.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-950">
                  2. Optional Analytics &amp; Marketing
                </h4>
                <p className="mt-1">
                  Optional analytics and marketing storage are disabled by default and are
                  only activated if you choose &ldquo;Accept all&rdquo; or enable them in
                  Cookie settings.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-300/80 flex justify-end">
              <button
                type="button"
                onClick={() => setPolicyOpen(false)}
                className="px-5 py-2 text-xs font-semibold rounded-md border-2 border-amber-500 bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
