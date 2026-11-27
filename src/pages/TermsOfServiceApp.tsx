import { useCallback, useState } from 'react';
import { FileText } from 'lucide-react';
import { CookieBanner, CookiePreferences } from '../components/CookieBanner';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

const COOKIE_STORAGE_KEY = 'my_car_parts_cookie_consent';
const WEBSITE_URL = 'https://orionfxservis.github.io/My-Car-Parts/';

export function TermsOfServiceApp() {
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
          centerTitle="Terms of Service"
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
                <FileText className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span>Legal &amp; Commercial Policy</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Terms of Service
              </h1>

              <p className="text-sm font-semibold text-slate-700">
                Last Updated: 26 November 2026
              </p>

              <div className="pt-2 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <p>
                  Welcome to <strong className="text-slate-950 font-semibold">My Car Parts</strong>.
                </p>
                <p>
                  These Terms of Service govern your access to and use of the My Car Parts website:
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
                  By visiting our website, browsing our product categories, submitting an enquiry, or
                  using any of our services, you agree to these Terms of Service.
                </p>
                <p>
                  If you do not agree with these terms, please do not use our website or services.
                </p>
              </div>
            </header>

            {/* Numbered Sections */}
            <div className="divide-y divide-slate-200">
              {/* Section 1 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">1. Our Services</h2>
                <p>
                  My Car Parts provides product information, customer assistance, and enquiry
                  services for automotive and industrial spare parts.
                </p>
                <p>Our main product categories include:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>
                    <strong className="text-slate-950 font-semibold">Car Spare Parts:</strong>{' '}
                    Components and replacement parts for cars and other vehicles.
                  </li>
                  <li>
                    <strong className="text-slate-950 font-semibold">
                      Industrial Generator Parts:
                    </strong>{' '}
                    Spare parts and components for industrial generators and power equipment.
                  </li>
                  <li>
                    <strong className="text-slate-950 font-semibold">Heavy Machinery Parts:</strong>{' '}
                    Components for excavators, construction equipment, and other heavy machinery.
                  </li>
                </ul>
                <p>Our services may include:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Browsing product categories and available parts.</li>
                  <li>Requesting product information and specifications.</li>
                  <li>Submitting product availability enquiries.</li>
                  <li>Requesting quotations.</li>
                  <li>Contacting our team for assistance.</li>
                  <li>Discussing product sourcing and order requirements.</li>
                </ul>
                <p>
                  Specific services may vary depending on product availability and business
                  arrangements.
                </p>
              </section>

              {/* Section 2 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  2. Eligibility to Use Our Services
                </h2>
                <p>By using our website and services, you confirm that:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>You are legally capable of entering into an agreement.</li>
                  <li>The information you provide is accurate and complete.</li>
                  <li>You will use our services for lawful purposes.</li>
                  <li>You will not misuse our website or interfere with its operation.</li>
                </ul>
                <p>
                  If you use our services on behalf of a company or organization, you confirm that
                  you are authorized to represent that organization.
                </p>
              </section>

              {/* Section 3 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  3. Customer Enquiries and Requests
                </h2>
                <p>
                  Customers may contact us to enquire about products, prices, availability,
                  compatibility, and other requirements.
                </p>
                <p>
                  When submitting an enquiry, you should provide accurate information, including
                  relevant product details.
                </p>
                <p>For better assistance, customers may provide:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Vehicle make, model, and year.</li>
                  <li>Generator brand, model, and specifications.</li>
                  <li>Machinery brand and model.</li>
                  <li>Part number or product reference.</li>
                  <li>Quantity required.</li>
                  <li>Contact information.</li>
                </ul>
                <p>
                  Submitting an enquiry does not create a confirmed purchase, reservation, or supply
                  agreement.
                </p>
                <p>
                  Our team may contact you to clarify your requirements or provide further
                  information.
                </p>
              </section>

              {/* Section 4 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  4. Quotations and Service Requests
                </h2>
                <p>
                  We may provide quotations based on the information supplied by customers.
                </p>
                <p>
                  Quotations may include product prices, availability, estimated delivery
                  arrangements, and other applicable charges.
                </p>
                <p>A quotation:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Is subject to product and supplier availability.</li>
                  <li>May have a specified validity period.</li>
                  <li>May change if the product specifications or requested quantities change.</li>
                  <li>Does not guarantee stock reservation unless expressly confirmed.</li>
                </ul>
                <p>
                  A service request or quotation becomes a confirmed order only after acceptance by
                  both parties through an agreed process.
                </p>
              </section>

              {/* Section 5 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  5. Customer Responsibilities
                </h2>
                <p>Customers are responsible for:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Providing correct product and equipment information.</li>
                  <li>Confirming that requested parts meet their requirements.</li>
                  <li>Reviewing quotations and order details before acceptance.</li>
                  <li>Providing accurate contact and delivery information.</li>
                  <li>Following agreed payment and collection arrangements.</li>
                  <li>Using purchased products according to manufacturer instructions.</li>
                </ul>
                <p>
                  Customers should consult a qualified mechanic, technician, or equipment specialist
                  where professional installation or compatibility advice is required.
                </p>
              </section>

              {/* Section 6 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  6. Communication and Customer Support
                </h2>
                <p>
                  We may communicate with customers through available contact channels, including
                  email, telephone, WhatsApp, or other communication methods published on our website.
                </p>
                <p>Our team will make reasonable efforts to respond to enquiries.</p>
                <p>
                  Response times may vary depending on enquiry volume, supplier communication, and
                  product requirements.
                </p>
                <p>
                  We do not guarantee immediate responses or continuous customer support
                  availability.
                </p>
              </section>

              {/* Section 7 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  7. Product Sourcing and Availability
                </h2>
                <p>
                  Some products may need to be sourced from suppliers or manufacturers.
                </p>
                <p>
                  Availability, sourcing timelines, and delivery estimates may depend on third
                  parties.
                </p>
                <p>
                  We will communicate relevant information when available, but we cannot guarantee
                  that every requested product can be sourced or supplied.
                </p>
                <p>
                  Alternative products may be suggested where appropriate, but customers must approve
                  any substitution before an order is finalized.
                </p>
              </section>

              {/* Section 8 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  8. Payments and Commercial Arrangements
                </h2>
                <p>
                  Payment methods, payment schedules, delivery charges, and other commercial
                  conditions will be communicated before order confirmation.
                </p>
                <p>
                  Customers agree to follow the payment arrangements confirmed for their orders.
                </p>
                <p>
                  No payment should be made to an individual or account unless it has been officially
                  authorized by My Car Parts.
                </p>
                <p>
                  Any applicable taxes, transportation costs, or additional charges will be
                  communicated as part of the relevant quotation or order confirmation.
                </p>
              </section>

              {/* Section 9 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  9. Cancellations, Returns and Refunds
                </h2>
                <p>
                  Cancellation, return, exchange, and refund requests will be considered according to
                  the applicable sales agreement, product condition, and relevant legal
                  requirements.
                </p>
                <p>
                  Customers should contact us promptly if they need to cancel an order or report a
                  problem with a supplied product.
                </p>
                <p>
                  Special-order products, installed parts, modified products, and products with
                  specific supplier restrictions may be subject to additional conditions.
                </p>
                <p>
                  Nothing in these Terms of Service removes any consumer rights that cannot legally
                  be excluded.
                </p>
              </section>

              {/* Section 10 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  10. Website and Service Availability
                </h2>
                <p>
                  We aim to provide a reliable website and customer enquiry experience.
                </p>
                <p>However, we do not guarantee that:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>The website will always be available.</li>
                  <li>All website features will operate without interruption.</li>
                  <li>Product information will always be current.</li>
                  <li>Every enquiry will result in a quotation or successful supply.</li>
                </ul>
                <p>
                  We may update, maintain, modify, or temporarily suspend website features when
                  necessary.
                </p>
              </section>

              {/* Section 11 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  11. Prohibited Activities
                </h2>
                <p>You must not:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Use our services for fraudulent or illegal purposes.</li>
                  <li>Submit false enquiries or misleading information.</li>
                  <li>Attempt to access restricted website systems.</li>
                  <li>Introduce viruses, malware, or harmful code.</li>
                  <li>Interfere with website operations or security.</li>
                  <li>Use automated systems to collect website information without permission.</li>
                  <li>Copy or commercially exploit our website content without authorization.</li>
                  <li>Harass, threaten, or abuse our staff or representatives.</li>
                </ul>
                <p>
                  We may restrict or refuse access to our services where misuse is identified.
                </p>
              </section>

              {/* Section 12 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  12. Intellectual Property
                </h2>
                <p>
                  The website&apos;s original content, design, graphics, logos, text, and other
                  materials are protected by applicable intellectual property laws.
                </p>
                <p>You may use the website for personal or legitimate business purposes.</p>
                <p>
                  You may not reproduce, distribute, modify, publish, or commercially exploit
                  protected website materials without appropriate authorization.
                </p>
                <p>
                  Third-party product names, trademarks, and brand identities remain the property of
                  their respective owners.
                </p>
              </section>

              {/* Section 13 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  13. Third-Party Services
                </h2>
                <p>Our website may contain links to external websites or services.</p>
                <p>
                  These services may be operated by independent third parties and may have separate
                  terms, policies, and security practices.
                </p>
                <p>
                  My Car Parts does not control or guarantee the availability, accuracy, or
                  reliability of third-party services.
                </p>
              </section>

              {/* Section 14 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  14. Privacy and Data Handling
                </h2>
                <p>
                  When you use our services, we may collect information that you voluntarily provide,
                  such as:
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Name.</li>
                  <li>Phone number.</li>
                  <li>Email address.</li>
                  <li>Product requirements.</li>
                  <li>Enquiry details.</li>
                  <li>Delivery or business information.</li>
                </ul>
                <p>
                  We use this information to respond to enquiries, provide quotations, communicate
                  with customers, and manage relevant business transactions.
                </p>
                <p>
                  Personal information will be handled in accordance with our Privacy Policy and
                  applicable laws.
                </p>
              </section>

              {/* Section 15 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  15. Limitation of Responsibility
                </h2>
                <p>
                  To the extent permitted by law, My Car Parts is not responsible for losses
                  resulting from:
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Incorrect information supplied by customers.</li>
                  <li>Improper installation or use of purchased parts.</li>
                  <li>Delays caused by suppliers, manufacturers, or delivery providers.</li>
                  <li>Temporary website interruptions.</li>
                  <li>Unavailability of requested products.</li>
                  <li>Unauthorized use of third-party services.</li>
                </ul>
                <p>
                  This section does not exclude liability that cannot legally be excluded under
                  applicable law.
                </p>
              </section>

              {/* Section 16 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  16. Suspension or Termination of Services
                </h2>
                <p>We may suspend or refuse access to our website or services if:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>These Terms of Service are violated.</li>
                  <li>A user engages in fraudulent or unlawful activity.</li>
                  <li>Website security or operations are threatened.</li>
                  <li>We are required to do so by law.</li>
                </ul>
                <p>Customers may stop using our website and services at any time.</p>
                <p>
                  Any existing confirmed order or outstanding obligation will remain subject to its
                  agreed terms and applicable law.
                </p>
              </section>

              {/* Section 17 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  17. Changes to These Terms
                </h2>
                <p>We may revise these Terms of Service from time to time.</p>
                <p>Any changes will be published on this page with an updated revision date.</p>
                <p>
                  Your continued use of our website or services after the revised terms are published
                  constitutes acceptance of the updated terms, to the extent permitted by law.
                </p>
              </section>

              {/* Section 18 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  18. Governing Law
                </h2>
                <p>
                  These Terms of Service will be interpreted in accordance with the applicable laws
                  of the jurisdiction in which My Car Parts operates.
                </p>
                <p>
                  Any disputes should first be addressed through good-faith communication.
                </p>
                <p>
                  If a dispute cannot be resolved amicably, it may be referred to the competent courts
                  or relevant dispute-resolution authorities under applicable law.
                </p>
              </section>

              {/* Section 19 */}
              <section className="py-7 space-y-3 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  19. Contact Information
                </h2>
                <p>
                  For questions about our services, product enquiries, quotations, or these Terms of
                  Service, please contact us through the official contact information published on our
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
                  <p className="text-slate-600 pt-1">Thank you for choosing My Car Parts.</p>
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
