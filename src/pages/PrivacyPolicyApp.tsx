import { useCallback, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { CookieBanner, CookiePreferences } from '../components/CookieBanner';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

const COOKIE_STORAGE_KEY = 'my_car_parts_cookie_consent';
const WEBSITE_URL = 'https://orionfxservis.github.io/My-Car-Parts/';

export function PrivacyPolicyApp() {
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
          centerTitle="Privacy Policy"
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
                <ShieldCheck className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span>Data Protection &amp; Privacy</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Privacy Policy
              </h1>

              <p className="text-sm font-semibold text-slate-700">
                Last Updated: 26 November 2026
              </p>

              <div className="pt-2 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <p>
                  At <strong className="text-slate-950 font-semibold">My Car Parts</strong>, we
                  respect your privacy and are committed to protecting the personal information you
                  share with us.
                </p>
                <p>
                  This Privacy Policy explains how we collect, use, store, protect, and disclose
                  information when you visit or interact with our website:
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
                  By using our website and services, you acknowledge that you have read and
                  understood this Privacy Policy.
                </p>
              </div>
            </header>

            {/* Numbered Sections */}
            <div className="divide-y divide-slate-200">
              {/* Section 1 */}
              <section className="py-7 space-y-4 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  1. Information We Collect
                </h2>
                <p>
                  We may collect information that you voluntarily provide when using our website or
                  contacting our team.
                </p>

                <div className="space-y-2 pt-1">
                  <h3 className="text-base font-bold text-slate-900">1.1 Personal Information</h3>
                  <p>This may include:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Full name.</li>
                    <li>Phone number.</li>
                    <li>Email address.</li>
                    <li>Business or company name.</li>
                    <li>City, location, or delivery address.</li>
                    <li>Other contact information you choose to provide.</li>
                  </ul>
                </div>

                <div className="space-y-2 pt-1">
                  <h3 className="text-base font-bold text-slate-900">
                    1.2 Product and Enquiry Information
                  </h3>
                  <p>
                    When requesting product information, availability, or quotations, you may
                    provide:
                  </p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Vehicle make, model, and manufacturing year.</li>
                    <li>Generator brand, model, and specifications.</li>
                    <li>Heavy machinery brand and model.</li>
                    <li>Product or part numbers.</li>
                    <li>Required quantities.</li>
                    <li>Product images or reference documents.</li>
                    <li>Details about your specific requirements.</li>
                  </ul>
                </div>

                <div className="space-y-2 pt-1">
                  <h3 className="text-base font-bold text-slate-900">
                    1.3 Automatically Collected Information
                  </h3>
                  <p>
                    When you visit our website, certain technical information may be collected
                    automatically, depending on the website configuration and services enabled.
                  </p>
                  <p>This may include:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>IP address.</li>
                    <li>Browser type and version.</li>
                    <li>Device type.</li>
                    <li>Operating system.</li>
                    <li>Pages visited.</li>
                    <li>Date and time of visits.</li>
                    <li>General website usage information.</li>
                    <li>Referral sources.</li>
                  </ul>
                  <p>
                    This information may help us understand website performance, improve security,
                    and enhance the visitor experience.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  2. How We Use Your Information
                </h2>
                <p>We may use collected information for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Responding to customer enquiries.</li>
                  <li>Providing product information and specifications.</li>
                  <li>Checking product availability.</li>
                  <li>Preparing quotations.</li>
                  <li>Processing and managing confirmed orders.</li>
                  <li>Communicating about deliveries and customer requests.</li>
                  <li>Providing customer support.</li>
                  <li>Improving our website and services.</li>
                  <li>Maintaining website security.</li>
                  <li>Preventing fraudulent or unauthorized activities.</li>
                  <li>Meeting applicable legal and regulatory obligations.</li>
                </ul>
                <p>
                  We only intend to use personal information for legitimate business purposes and
                  other purposes permitted by applicable law.
                </p>
              </section>

              {/* Section 3 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  3. Product Enquiries and Customer Communication
                </h2>
                <p>
                  If you submit an enquiry about car spare parts, industrial generator parts, or
                  heavy machinery parts, we may use the information you provide to respond to your
                  request.
                </p>
                <p>We may contact you through:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Telephone calls.</li>
                  <li>Email.</li>
                  <li>WhatsApp.</li>
                  <li>Other communication channels you provide or authorize.</li>
                </ul>
                <p>
                  We may retain enquiry information for reasonable business record-keeping and
                  follow-up purposes, subject to applicable retention requirements.
                </p>
              </section>

              {/* Section 4 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  4. Cookies and Similar Technologies
                </h2>
                <p>
                  Our website may use cookies and similar technologies to improve functionality and
                  understand website usage.
                </p>
                <p>These technologies may help us:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Maintain essential website functions.</li>
                  <li>Remember visitor preferences.</li>
                  <li>Understand website traffic.</li>
                  <li>Monitor website performance.</li>
                  <li>Improve the browsing experience.</li>
                </ul>
                <p>
                  The cookies and technologies used depend on the website configuration and
                  third-party services enabled.
                </p>
                <p>
                  For more information, please review our{' '}
                  <strong className="text-slate-950 font-semibold">Cookies Policy</strong>.
                </p>
              </section>

              {/* Section 5 */}
              <section className="py-7 space-y-4 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  5. Sharing of Personal Information
                </h2>
                <p>
                  We do not sell or rent customers&apos; personal information as part of our ordinary
                  business operations.
                </p>
                <p>We may share relevant information in limited circumstances, including:</p>

                <div className="space-y-1.5 pt-1">
                  <h3 className="text-base font-bold text-slate-900">5.1 Service Providers</h3>
                  <p>
                    We may share information with service providers who help us operate our website,
                    manage communications, process transactions, or provide other business services.
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="text-base font-bold text-slate-900">
                    5.2 Suppliers and Business Partners
                  </h3>
                  <p>
                    Where necessary to fulfil a customer&apos;s request, we may share relevant product
                    or order information with suppliers, distributors, manufacturers, or logistics
                    providers.
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="text-base font-bold text-slate-900">5.3 Legal Requirements</h3>
                  <p>
                    We may disclose information when required by applicable law, a valid legal
                    request, a court order, or a competent regulatory authority.
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="text-base font-bold text-slate-900">5.4 Business Protection</h3>
                  <p>
                    We may use or disclose relevant information where reasonably necessary to
                    protect our rights, customers, website, business operations, or security.
                  </p>
                </div>

                <p>
                  We aim to limit shared information to what is reasonably necessary for the
                  relevant purpose.
                </p>
              </section>

              {/* Section 6 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  6. Data Storage and Security
                </h2>
                <p>
                  We take reasonable measures to protect personal information against unauthorized
                  access, misuse, loss, alteration, or disclosure.
                </p>
                <p>
                  Depending on the services used, information may be stored or processed through:
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Website hosting infrastructure.</li>
                  <li>Business communication systems.</li>
                  <li>Secure third-party service providers.</li>
                  <li>Customer enquiry or order management systems.</li>
                </ul>
                <p>
                  However, no internet transmission or electronic storage method can be guaranteed to
                  be completely secure.
                </p>
                <p>
                  We cannot guarantee absolute security, but we aim to use appropriate safeguards to
                  protect the information we handle.
                </p>
              </section>

              {/* Section 7 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">7. Data Retention</h2>
                <p>
                  We retain personal information only for as long as reasonably necessary for the
                  purposes described in this Privacy Policy.
                </p>
                <p>Retention periods may depend on:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>The nature of the enquiry.</li>
                  <li>Customer and order history.</li>
                  <li>Business record-keeping requirements.</li>
                  <li>Legal or regulatory obligations.</li>
                  <li>The resolution of disputes.</li>
                </ul>
                <p>
                  When information is no longer required, we aim to delete it or securely dispose of
                  it, subject to applicable legal requirements.
                </p>
              </section>

              {/* Section 8 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  8. Third-Party Websites and Services
                </h2>
                <p>
                  Our website may contain links to third-party websites, platforms, or services.
                </p>
                <p>
                  These external services may have their own privacy policies, cookie practices, and
                  security procedures.
                </p>
                <p>
                  My Car Parts does not control the privacy practices of external websites.
                </p>
                <p>
                  We recommend reviewing their privacy policies before sharing personal information
                  with them.
                </p>
              </section>

              {/* Section 9 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  9. International Data Processing
                </h2>
                <p>
                  Some third-party hosting, analytics, communication, or technology providers may
                  process information outside your country of residence.
                </p>
                <p>
                  Where such processing occurs, we aim to use appropriate safeguards and comply with
                  applicable legal requirements.
                </p>
              </section>

              {/* Section 10 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  10. Children&apos;s Privacy
                </h2>
                <p>
                  Our website and services are intended for general customers and businesses.
                </p>
                <p>
                  We do not knowingly collect personal information from children where parental or
                  guardian consent is legally required.
                </p>
                <p>
                  If we become aware that personal information has been collected from a child in
                  circumstances where it should not have been collected, we will take reasonable
                  steps to address the situation.
                </p>
              </section>

              {/* Section 11 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  11. Your Privacy Rights
                </h2>
                <p>Depending on applicable law, you may have the right to:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Request access to your personal information.</li>
                  <li>Request correction of inaccurate information.</li>
                  <li>Request deletion of information where legally permitted.</li>
                  <li>Withdraw consent where processing is based on consent.</li>
                  <li>Object to certain uses of your personal information.</li>
                  <li>Ask questions about how your information is handled.</li>
                </ul>
                <p>
                  To exercise an applicable privacy right, please contact us through the official
                  contact information published on our website.
                </p>
                <p>We may need to verify your identity before responding to certain requests.</p>
              </section>

              {/* Section 12 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  12. Marketing Communications
                </h2>
                <p>
                  If we send promotional messages, product updates, or marketing communications, we
                  will do so in accordance with applicable legal requirements.
                </p>
                <p>You may request to stop receiving marketing communications at any time.</p>
                <p>
                  However, we may still send essential communications relating to an existing
                  enquiry, quotation, order, or business transaction.
                </p>
              </section>

              {/* Section 13 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  13. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our
                  business operations, website features, technology, or applicable legal
                  requirements.
                </p>
                <p>
                  Any updates will be published on this page with a revised Last Updated date.
                </p>
                <p>We encourage visitors to review this page periodically.</p>
              </section>

              {/* Section 14 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">14. Contact Us</h2>
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy or the
                  handling of your personal information, please contact us through the official
                  contact details published on our website.
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
                  <p className="text-slate-600 pt-1">Thank you for trusting My Car Parts.</p>
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
