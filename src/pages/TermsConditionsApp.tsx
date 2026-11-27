import { useCallback, useState } from 'react';
import { Scale } from 'lucide-react';
import { CookieBanner, CookiePreferences } from '../components/CookieBanner';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

const COOKIE_STORAGE_KEY = 'my_car_parts_cookie_consent';
const WEBSITE_URL = 'https://orionfxservis.github.io/My-Car-Parts/';

export function TermsConditionsApp() {
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
          centerTitle="Terms & Conditions"
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
                <Scale className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span>Commercial Terms &amp; Legal Notice</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Terms &amp; Conditions
              </h1>

              <p className="text-sm font-semibold text-slate-700">
                Last Updated: 26 November 2026
              </p>

              <div className="pt-2 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <p>
                  Welcome to <strong className="text-slate-950 font-semibold">My Car Parts</strong>.
                  These Terms &amp; Conditions govern your access to and use of our website:
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
                  By accessing or using this website, you agree to these Terms &amp; Conditions. If
                  you do not agree, please discontinue using the website.
                </p>
              </div>
            </header>

            {/* Numbered Sections */}
            <div className="divide-y divide-slate-200">
              {/* Section 1 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  1. About My Car Parts
                </h2>
                <p>
                  My Car Parts provides information and assistance relating to automotive and
                  industrial spare parts, including:
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Car Spare Parts</li>
                  <li>Industrial Generator Parts</li>
                  <li>Heavy Machinery Parts</li>
                </ul>
                <p>
                  Our website is intended to help customers explore available parts, make enquiries,
                  request quotations, and contact us regarding their requirements.
                </p>
              </section>

              {/* Section 2 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  2. Use of the Website
                </h2>
                <p>You agree to use this website only for lawful purposes.</p>
                <p>You must not:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Use the website for fraudulent or unlawful activities.</li>
                  <li>Submit false, misleading, or inaccurate information.</li>
                  <li>Attempt to damage, disrupt, or gain unauthorized access to the website.</li>
                  <li>Copy, reproduce, or commercially exploit website content without permission.</li>
                  <li>Upload malicious software, harmful code, or unauthorized material.</li>
                </ul>
                <p>We reserve the right to restrict access to users who violate these conditions.</p>
              </section>

              {/* Section 3 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  3. Product Information and Availability
                </h2>
                <p>
                  We make reasonable efforts to provide accurate product descriptions, images,
                  specifications, and other information.
                </p>
                <p>However:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Product images may differ slightly from actual products.</li>
                  <li>Product specifications and descriptions may change.</li>
                  <li>Availability is subject to confirmation.</li>
                  <li>Some parts may require special sourcing or ordering.</li>
                  <li>
                    We do not guarantee that every displayed or advertised item is currently in
                    stock.
                  </li>
                </ul>
                <p>
                  Customers should confirm product details and availability before placing an order.
                </p>
              </section>

              {/* Section 4 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  4. Product Compatibility
                </h2>
                <p>
                  Customers are responsible for providing accurate vehicle, generator, or machinery
                  information when requesting parts.
                </p>
                <p>This may include:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Vehicle make, model, and manufacturing year.</li>
                  <li>Engine type or engine number, where relevant.</li>
                  <li>Generator brand, model, and specifications.</li>
                  <li>Machinery brand, model, serial number, or part number.</li>
                </ul>
                <p>We recommend confirming compatibility with our team before purchasing.</p>
                <p>
                  My Car Parts cannot be held responsible for incorrect purchases resulting from
                  incomplete or inaccurate information supplied by customers, subject to applicable
                  consumer protection laws.
                </p>
              </section>

              {/* Section 5 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  5. Prices and Quotations
                </h2>
                <p>
                  Prices displayed on the website, if any, are subject to change without prior
                  notice.
                </p>
                <p>A quotation provided to a customer may depend on:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Product availability.</li>
                  <li>Product specifications and compatibility.</li>
                  <li>Supplier pricing.</li>
                  <li>Import costs, taxes, and other applicable charges.</li>
                  <li>Delivery location and transportation costs.</li>
                </ul>
                <p>
                  A quotation is not a confirmed order unless accepted by My Car Parts in writing or
                  through an agreed ordering process.
                </p>
                <p>
                  The final price, applicable charges, and payment arrangements will be communicated
                  before order confirmation.
                </p>
              </section>

              {/* Section 6 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  6. Orders and Confirmation
                </h2>
                <p>
                  Submitting an enquiry or order request does not automatically mean that an order
                  has been accepted.
                </p>
                <p>
                  An order will be considered confirmed only after My Car Parts communicates its
                  acceptance and confirms the relevant product, price, availability, and other
                  applicable conditions.
                </p>
                <p>We reserve the right to decline or cancel an order where:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>The requested product is unavailable.</li>
                  <li>Product information or pricing contains an error.</li>
                  <li>The customer provides inaccurate information.</li>
                  <li>A supplier cannot fulfil the requirement.</li>
                  <li>There are reasonable grounds to suspect fraudulent activity.</li>
                </ul>
                <p>
                  Any applicable refund or cancellation arrangements will be handled in accordance
                  with the agreed transaction terms and applicable laws.
                </p>
              </section>

              {/* Section 7 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">7. Payments</h2>
                <p>
                  Payment methods, payment deadlines, and other payment arrangements will be
                  communicated to customers during the ordering process.
                </p>
                <p>Customers must follow the confirmed payment instructions.</p>
                <p>Unless otherwise agreed in writing:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>
                    Customers should not make payments to unauthorized individuals or accounts.
                  </li>
                  <li>Proof of payment may be requested.</li>
                  <li>
                    Additional delivery, transportation, or applicable charges will be communicated
                    before order confirmation.
                  </li>
                </ul>
              </section>

              {/* Section 8 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  8. Delivery and Shipping
                </h2>
                <p>
                  Delivery arrangements, estimated delivery times, and transportation charges will
                  be communicated when an order is confirmed.
                </p>
                <p>Delivery times may be affected by:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Product availability.</li>
                  <li>Supplier processing times.</li>
                  <li>Courier or transportation services.</li>
                  <li>Customs or import procedures.</li>
                  <li>Weather conditions or other circumstances beyond our reasonable control.</li>
                </ul>
                <p>
                  Any delivery date provided is an estimate unless expressly confirmed as guaranteed
                  in writing.
                </p>
                <p>
                  Customers should provide accurate delivery information and remain available to
                  receive their orders.
                </p>
              </section>

              {/* Section 9 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  9. Returns, Exchanges and Refunds
                </h2>
                <p>
                  Return, exchange, and refund eligibility will depend on the product, its
                  condition, the reason for the request, and the agreed sales terms.
                </p>
                <p>
                  Customers should inspect products upon delivery and report any incorrect, damaged,
                  or defective items as soon as reasonably possible.
                </p>
                <p>Depending on the circumstances, we may review requests involving:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Incorrect products supplied.</li>
                  <li>Products damaged during delivery.</li>
                  <li>Verified manufacturing defects.</li>
                  <li>Products that do not match the confirmed order.</li>
                </ul>
                <p>
                  Products that have been installed, modified, damaged through misuse, or returned
                  without authorization may not qualify for a return, subject to applicable law.
                </p>
                <p>
                  Any applicable manufacturer warranty or written warranty will be governed by its
                  stated conditions.
                </p>
                <p>
                  Nothing in this section limits any consumer rights that cannot legally be
                  excluded.
                </p>
              </section>

              {/* Section 10 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  10. Product Warranties
                </h2>
                <p>
                  Product warranties, where available, are subject to the manufacturer&apos;s or
                  supplier&apos;s warranty terms.
                </p>
                <p>Not every spare part carries a manufacturer warranty.</p>
                <p>
                  Customers should confirm warranty coverage, duration, exclusions, and claim
                  procedures before purchasing.
                </p>
                <p>
                  My Car Parts does not provide an independent warranty unless one is expressly
                  stated in writing.
                </p>
              </section>

              {/* Section 11 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  11. Third-Party Brands and Manufacturers
                </h2>
                <p>
                  This website may refer to vehicle manufacturers, generator brands, machinery
                  manufacturers, suppliers, or other third-party trademarks.
                </p>
                <p>All trademarks and brand names belong to their respective owners.</p>
                <p>
                  Their appearance on this website is for identification and product compatibility
                  purposes only.
                </p>
                <p>
                  Unless expressly stated, My Car Parts does not claim to be an authorized dealer,
                  distributor, or representative of any third-party manufacturer.
                </p>
              </section>

              {/* Section 12 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  12. Intellectual Property
                </h2>
                <p>
                  All website content, including text, graphics, logos, images, design elements, and
                  other materials, is protected by applicable intellectual property laws.
                </p>
                <p>
                  You may view and use the website for personal or legitimate business enquiry
                  purposes.
                </p>
                <p>
                  You may not reproduce, modify, distribute, publish, or commercially use website
                  materials without prior written permission from the relevant rights holder.
                </p>
              </section>

              {/* Section 13 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  13. Third-Party Websites and Services
                </h2>
                <p>
                  Our website may contain links to third-party websites, services, or platforms.
                </p>
                <p>
                  These external websites operate independently and may have their own terms and
                  privacy policies.
                </p>
                <p>
                  My Car Parts is not responsible for the content, availability, security, or
                  practices of third-party websites.
                </p>
                <p>Accessing external links is at your own discretion.</p>
              </section>

              {/* Section 14 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  14. Limitation of Liability
                </h2>
                <p>
                  To the extent permitted by applicable law, My Car Parts shall not be liable for
                  indirect or consequential losses arising from the use of this website or reliance
                  on information published on it.
                </p>
                <p>We are not responsible for losses resulting from:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Incorrect product compatibility information supplied by customers.</li>
                  <li>Delays caused by third-party suppliers or transportation providers.</li>
                  <li>Temporary website interruptions or technical issues.</li>
                  <li>Unauthorized access beyond our reasonable control.</li>
                  <li>Misuse, improper installation, or modification of purchased parts.</li>
                </ul>
                <p>
                  Nothing in these Terms excludes or limits liability where such exclusion or
                  limitation is prohibited by law.
                </p>
              </section>

              {/* Section 15 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  15. Website Availability
                </h2>
                <p>
                  We aim to keep the website accessible and functional. However, we do not guarantee
                  uninterrupted availability.
                </p>
                <p>
                  We may update, modify, suspend, or discontinue any part of the website without
                  prior notice where reasonably necessary.
                </p>
              </section>

              {/* Section 16 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  16. Privacy and Personal Information
                </h2>
                <p>
                  When you contact us or submit an enquiry, we may collect information such as your
                  name, phone number, email address, delivery details, and product requirements.
                </p>
                <p>
                  This information will be handled in accordance with our{' '}
                  <a
                    href="./privacy-policy.html"
                    className="font-semibold text-[#0284C7] hover:underline"
                  >
                    Privacy Policy
                  </a>{' '}
                  and applicable data protection requirements.
                </p>
                <p>
                  We do not intend for customers to submit unnecessary sensitive or confidential
                  information through website forms.
                </p>
              </section>

              {/* Section 17 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  17. Changes to These Terms
                </h2>
                <p>We reserve the right to update or revise these Terms &amp; Conditions at any time.</p>
                <p>
                  Updated terms will be published on this page with a revised Last Updated date.
                </p>
                <p>
                  Your continued use of the website after changes are published indicates acceptance
                  of the updated terms, to the extent permitted by applicable law.
                </p>
              </section>

              {/* Section 18 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  18. Governing Law and Disputes
                </h2>
                <p>
                  These Terms &amp; Conditions shall be governed by the laws applicable in the
                  jurisdiction where My Car Parts operates.
                </p>
                <p>
                  Any disputes will first be addressed through good-faith communication between the
                  customer and My Car Parts.
                </p>
                <p>
                  Where a dispute cannot be resolved amicably, it will be handled by the competent
                  courts or dispute-resolution authorities having jurisdiction under applicable law.
                </p>
              </section>

              {/* Section 19 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">19. Contact Us</h2>
                <p>
                  If you have questions about these Terms &amp; Conditions, product information,
                  quotations, or orders, please contact My Car Parts through the contact details
                  published on our website.
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
                    Thank you for choosing My Car Parts.
                  </p>
                  <p className="text-slate-600 pt-0.5">
                    Cars, Generators &amp; Heavy Machinery Parts
                  </p>
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
