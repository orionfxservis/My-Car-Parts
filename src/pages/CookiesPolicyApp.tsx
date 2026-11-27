import { useCallback, useState } from 'react';
import { Cookie } from 'lucide-react';
import { CookieBanner, CookiePreferences } from '../components/CookieBanner';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

const COOKIE_STORAGE_KEY = 'my_car_parts_cookie_consent';
const WEBSITE_URL = 'https://orionfxservis.github.io/My-Car-Parts/';

export function CookiesPolicyApp() {
  const [cookieBannerVisible, setCookieBannerVisible] = useState<boolean>(() => {
    try {
      return !window.localStorage.getItem(COOKIE_STORAGE_KEY);
    } catch {
      return true;
    }
  });

  const handleCookieDismiss = useCallback((prefs: CookiePreferences) => {
    try {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage errors
    }
    setCookieBannerVisible(false);
  }, []);

  return (
    <ErrorBoundary>
      <div id="top" className="min-h-screen flex flex-col bg-white text-slate-900">
        <Navbar
          basePath=".."
          centerTitle="Cookies Policy"
          backToMainHref="../index.html"
          hideEnquiry
          quoteCount={0}
          onSelectCategory={() => {}}
          onOpenQuote={() => {}}
        />

        <main className="flex-1 bg-white">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
            {/* Document Header */}
            <header className="pb-8 border-b border-slate-200 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
                <Cookie className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span>Browser Storage &amp; Preferences</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Cookies Policy
              </h1>

              <p className="text-sm font-semibold text-slate-700">
                Last Updated: 27 November 2026
              </p>

              <div className="pt-2 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <p>
                  Welcome to <strong className="text-slate-950 font-semibold">My Car Parts</strong>.
                </p>
                <p>
                  This Cookies Policy explains how My Car Parts uses cookies and similar
                  technologies when you visit our website:
                </p>
                <p>
                  <a
                    href={WEBSITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs sm:text-sm text-[#0284C7] hover:underline break-all"
                  >
                    {WEBSITE_URL}
                  </a>
                </p>
                <p>
                  We respect your privacy and aim to be transparent about how information may be
                  collected and used through our website.
                </p>
                <p>
                  By using our website, you acknowledge this policy. Where required by applicable
                  law, we will request your consent before placing non-essential cookies on your
                  device.
                </p>
              </div>
            </header>

            {/* Numbered Sections */}
            <div className="divide-y divide-slate-200">
              {/* Section 1 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  1. What Are Cookies?
                </h2>
                <p>
                  Cookies are small text files stored on your computer, smartphone, tablet, or other
                  device when you visit a website.
                </p>
                <p>
                  They help websites remember information about visitors, maintain functionality,
                  improve performance, and provide a better browsing experience.
                </p>
                <p>Cookies may be temporary or persistent:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>
                    <strong className="text-slate-950 font-semibold">Session Cookies:</strong>{' '}
                    Usually expire when you close your browser.
                  </li>
                  <li>
                    <strong className="text-slate-950 font-semibold">Persistent Cookies:</strong>{' '}
                    Remain on your device until they expire or are deleted.
                  </li>
                </ul>
              </section>

              {/* Section 2 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  2. Why We Use Cookies
                </h2>
                <p>My Car Parts may use cookies and similar technologies to:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Ensure essential website functions operate correctly.</li>
                  <li>Improve website navigation and performance.</li>
                  <li>Remember visitor preferences.</li>
                  <li>Understand how visitors interact with our website.</li>
                  <li>Identify technical problems.</li>
                  <li>Improve our products, services, and customer experience.</li>
                  <li>Support website security and prevent misuse.</li>
                </ul>
                <p>
                  The specific cookies used depend on the website features and third-party services
                  enabled.
                </p>
              </section>

              {/* Section 3 */}
              <section className="py-7 space-y-4 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  3. Types of Cookies We May Use
                </h2>

                <div className="space-y-2 pt-1">
                  <h3 className="text-base font-bold text-slate-900">3.1 Essential Cookies</h3>
                  <p>These cookies are necessary for basic website functionality.</p>
                  <p>They may support:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Website navigation.</li>
                    <li>Security and protection.</li>
                    <li>Form functionality.</li>
                    <li>Session management, where applicable.</li>
                    <li>Basic website operations.</li>
                  </ul>
                  <p>
                    Essential cookies generally cannot be disabled through our website without
                    affecting certain functions.
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <h3 className="text-base font-bold text-slate-900">3.2 Functional Cookies</h3>
                  <p>
                    Functional cookies help remember visitor preferences and improve the browsing
                    experience.
                  </p>
                  <p>They may remember:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Language preferences.</li>
                    <li>Display settings.</li>
                    <li>Previously selected options.</li>
                    <li>Other website preferences.</li>
                  </ul>
                  <p>These cookies are used only where the relevant features are implemented.</p>
                </div>

                <div className="space-y-2 pt-1">
                  <h3 className="text-base font-bold text-slate-900">
                    3.3 Analytics and Performance Cookies
                  </h3>
                  <p>
                    Analytics cookies may help us understand how visitors use our website.
                  </p>
                  <p>
                    Depending on the analytics services enabled, they may collect information such
                    as:
                  </p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Number of visitors.</li>
                    <li>Pages viewed.</li>
                    <li>Time spent on the website.</li>
                    <li>Browser and device information.</li>
                    <li>General navigation patterns.</li>
                    <li>Website performance and error information.</li>
                  </ul>
                  <p>
                    We may use this information to improve website content, functionality, and
                    performance.
                  </p>
                  <p>Analytics cookies will be used subject to applicable consent requirements.</p>
                </div>

                <div className="space-y-2 pt-1">
                  <h3 className="text-base font-bold text-slate-900">
                    3.4 Advertising and Marketing Cookies
                  </h3>
                  <p>If advertising or marketing services are introduced, cookies may be used to:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Measure advertising performance.</li>
                    <li>Understand interactions with promotional content.</li>
                    <li>Measure marketing campaigns.</li>
                    <li>Support relevant advertising.</li>
                  </ul>
                  <p>
                    We do not claim that advertising or marketing cookies are currently active on
                    our website.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  4. Third-Party Cookies
                </h2>
                <p>Certain website features may depend on external services.</p>
                <p>
                  Depending on their configuration, these services may place their own cookies or
                  use similar technologies.
                </p>
                <p>Examples may include:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Website analytics providers.</li>
                  <li>Social media platforms.</li>
                  <li>Embedded content providers.</li>
                  <li>External communication services.</li>
                  <li>Advertising platforms.</li>
                </ul>
                <p>Third-party services operate under their own privacy and cookie policies.</p>
                <p>
                  My Car Parts does not control all cookies placed by external services. Visitors
                  should review the relevant third-party policies for further information.
                </p>
              </section>

              {/* Section 5 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  5. How Long Do Cookies Remain?
                </h2>
                <p>
                  The storage duration of cookies depends on their purpose and the service that
                  creates them.
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Session cookies are generally removed when you close your browser.</li>
                  <li>
                    Persistent cookies remain until their expiration date or until you manually
                    delete them.
                  </li>
                </ul>
                <p>
                  We aim to retain information only for periods reasonably necessary for the
                  relevant purpose and applicable legal requirements.
                </p>
              </section>

              {/* Section 6 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  6. Managing Your Cookie Preferences
                </h2>
                <p>You can manage cookies through your internet browser settings.</p>
                <p>Most browsers allow you to:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>View cookies stored on your device.</li>
                  <li>Delete existing cookies.</li>
                  <li>Block all cookies.</li>
                  <li>Block cookies from selected websites.</li>
                  <li>Receive notifications when cookies are stored.</li>
                </ul>
                <p>
                  Please note that disabling certain cookies may affect the functionality or
                  performance of some website features.
                </p>
              </section>

              {/* Section 7 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">7. Cookie Consent</h2>
                <p>
                  Where required by applicable law, we will request your consent before using
                  non-essential cookies.
                </p>
                <p>Where a cookie preference tool is available, you may be able to:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>
                    <strong className="text-slate-950 font-semibold">Accept All:</strong> Allow all
                    cookie categories.
                  </li>
                  <li>
                    <strong className="text-slate-950 font-semibold">Reject Non-Essential:</strong>{' '}
                    Allow only cookies necessary for website operation.
                  </li>
                  <li>
                    <strong className="text-slate-950 font-semibold">Cookie Settings:</strong> Choose
                    which optional cookie categories to allow.
                  </li>
                </ul>
                <p>
                  You may change or withdraw your preferences through the available cookie controls,
                  where provided.
                </p>
                <p>
                  Essential cookies may remain active when necessary to provide a service requested
                  by the visitor or to operate the website.
                </p>
              </section>

              {/* Section 8 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  8. Personal Information and Cookies
                </h2>
                <p>
                  Some cookies and similar technologies may collect information that can be
                  associated with an individual.
                </p>
                <p>
                  Any personal information collected through these technologies will be handled in
                  accordance with our{' '}
                  <a
                    href="./privacy-policy.html"
                    className="font-semibold text-[#0284C7] hover:underline"
                  >
                    Privacy Policy
                  </a>{' '}
                  and applicable data protection requirements.
                </p>
                <p>
                  We aim to use such information for legitimate website, security, service, and
                  improvement purposes.
                </p>
              </section>

              {/* Section 9 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  9. Your Privacy Choices
                </h2>
                <p>You have control over cookies stored on your device.</p>
                <p>
                  You can restrict or remove cookies through your browser settings and use our
                  cookie preference controls where available.
                </p>
                <p>
                  If you disable cookies, some website features may not function as intended.
                </p>
              </section>

              {/* Section 10 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  10. Changes to This Cookies Policy
                </h2>
                <p>
                  We may update this Cookies Policy to reflect changes in our website, services,
                  technology, or legal requirements.
                </p>
                <p>
                  Any updates will be published on this page with a revised Last Updated date.
                </p>
                <p>We encourage visitors to review this policy periodically.</p>
              </section>

              {/* Section 11 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">11. Contact Us</h2>
                <p>
                  If you have questions about this Cookies Policy or how cookies are used on our
                  website, please contact us through the official contact details published on our
                  website.
                </p>
                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-1.5">
                  <p className="font-bold text-slate-950">My Car Parts</p>
                  <p>
                    Website:{' '}
                    <a
                      href={WEBSITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs sm:text-sm text-[#0284C7] hover:underline break-all"
                    >
                      {WEBSITE_URL}
                    </a>
                  </p>
                  <p className="font-bold text-slate-950 pt-1">
                    Cars, Generators &amp; Heavy Machinery Parts
                  </p>
                  <p className="text-slate-600 pt-0.5">Thank you for visiting My Car Parts.</p>
                </div>
              </section>
            </div>
          </div>
        </main>

        <Footer basePath=".." compact />

        <CookieBanner visible={cookieBannerVisible} onDismiss={handleCookieDismiss} />
      </div>
    </ErrorBoundary>
  );
}
