import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Car,
  Check,
  CheckCheck,
  Cog,
  Copy,
  ExternalLink,
  HardHat,
  Home,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { AdminCatalogPageManager } from '../components/admin/AdminCatalogPageManager';
import { AdminMainPageManager } from '../components/admin/AdminMainPageManager';
import { CarMakeEntry, CarPromoBanner } from '../data/carPartsCatalog';
import { CategoryCardData, HeroSlideItem, ToolItem } from '../data/inventory';
import {
  AdminUserRecord,
  CatalogProductData,
  DEFAULT_SITE_SECTIONS,
  SiteSectionData,
  TechnicalInquiryRecord,
  addAdminUid,
  deleteTechnicalInquiry,
  fetchAdminsList,
  fetchCarMakes,
  fetchCatalogProducts,
  fetchDivisionCards,
  fetchHeroSlides,
  fetchPromoBanners,
  fetchSiteSections,
  fetchToolInventory,
  getPageGroupsFromSections,
  markAllTechnicalInquiriesRead,
  markTechnicalInquiryRead,
  removeAdminUid,
  subscribeTechnicalInquiries,
} from '../lib/cmsService';
import { useFirebaseAuth } from '../lib/useFirebaseAuth';

type AdminPageTab = 'main' | 'cars' | 'generators' | 'machinery' | 'admins';

function AdminPanelWorkspace() {
  const { authReady, user, isAdmin, isBootstrapAdmin, authError, signInWithGoogle, logout } =
    useFirebaseAuth();

  const [activeTab, setActiveTab] = useState<AdminPageTab>('main');
  const [loadingData, setLoadingData] = useState(true);

  // Storefront CMS snapshots loaded into Admin Panel
  const [sections, setSections] = useState<Record<string, SiteSectionData>>(
    DEFAULT_SITE_SECTIONS,
  );
  const [heroSlides, setHeroSlides] = useState<(HeroSlideItem & { sortOrder: number })[]>([]);
  const [divisionCards, setDivisionCards] = useState<
    (CategoryCardData & { sortOrder: number })[]
  >([]);
  const [toolInventory, setToolInventory] = useState<(ToolItem & { sortOrder: number })[]>([]);

  const [carBanners, setCarBanners] = useState<
    (CarPromoBanner & { sortOrder: number; page: 'cars' | 'generators' })[]
  >([]);
  const [carMakes, setCarMakes] = useState<(CarMakeEntry & { sortOrder: number })[]>([]);
  const [carProducts, setCarProducts] = useState<CatalogProductData[]>([]);

  const [genBanners, setGenBanners] = useState<
    (CarPromoBanner & { sortOrder: number; page: 'cars' | 'generators' })[]
  >([]);
  const [genProducts, setGenProducts] = useState<CatalogProductData[]>([]);

  const [machProducts, setMachProducts] = useState<CatalogProductData[]>([]);

  // Extra Admins management (bootstrap owner only)
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  const [newAdminUid, setNewAdminUid] = useState('');
  const [adminMsg, setAdminMsg] = useState('');
  const [uidCopied, setUidCopied] = useState(false);

  // Technical inquiry notifications (New Inquiry Mail)
  const [inquiries, setInquiries] = useState<TechnicalInquiryRecord[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifContainerRef = useRef<HTMLDivElement | null>(null);

  const loadAllCmsData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [
        sec,
        slides,
        divs,
        tools,
        cBanners,
        cMakes,
        cProducts,
        gBanners,
        gProducts,
        mProducts,
      ] = await Promise.all([
        fetchSiteSections(),
        fetchHeroSlides(),
        fetchDivisionCards(),
        fetchToolInventory(),
        fetchPromoBanners('cars'),
        fetchCarMakes(),
        fetchCatalogProducts('cars'),
        fetchPromoBanners('generators'),
        fetchCatalogProducts('generators'),
        fetchCatalogProducts('machinery'),
      ]);
      setSections(sec);
      setHeroSlides(slides);
      setDivisionCards(divs);
      setToolInventory(tools);
      setCarBanners(cBanners);
      setCarMakes(cMakes);
      setCarProducts(cProducts);
      setGenBanners(gBanners);
      setGenProducts(gProducts);
      setMachProducts(mProducts);

      if (isBootstrapAdmin) {
        const list = await fetchAdminsList();
        setAdminUsers(list);
      }
    } finally {
      setLoadingData(false);
    }
  }, [isBootstrapAdmin]);

  useEffect(() => {
    if (authReady && isAdmin) {
      void loadAllCmsData();
    }
  }, [authReady, isAdmin, loadAllCmsData]);

  useEffect(() => {
    if (!authReady || !isAdmin) {
      setInquiries([]);
      return;
    }
    const unsubscribe = subscribeTechnicalInquiries((items) => {
      setInquiries(items);
    });
    return () => unsubscribe();
  }, [authReady, isAdmin]);

  useEffect(() => {
    if (!notifOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notifOpen]);

  // 1. Loading Auth
  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-sm font-medium text-slate-600">Checking admin session...</div>
      </div>
    );
  }

  // 2. Sign-In Gate
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center bg-[#F7F6F2] rounded-xl px-4 py-2.5 border border-slate-200 mx-auto">
            <img
              src="../assets/logo/my-car-parts-logo.png"
              alt="My Car Parts"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Admin Content Management</span>
            </div>
            <h1 className="text-xl font-bold text-slate-950">Sign in to Admin Panel</h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Manage and update images, descriptions, and product cards across the Main Page,
              Car Spare Parts, Industrial Generator Spare Parts, and Heavy Machinery Parts.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 text-left">
              {authError}
            </div>
          )}

          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer"
          >
            <span>Continue with Google Admin Account</span>
          </button>

          <a
            href="../index.html"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Return to Main Storefront</span>
          </a>
        </div>
      </div>
    );
  }

  // 3. Unauthorized Email Gate
  if (!isAdmin) {
    const handleCopyUid = async () => {
      try {
        await navigator.clipboard.writeText(user.uid);
        setUidCopied(true);
        window.setTimeout(() => setUidCopied(false), 2000);
      } catch {
        setUidCopied(false);
      }
    };

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 text-center space-y-5">
          <Lock className="w-10 h-10 text-red-500 mx-auto" aria-hidden="true" />
          <div className="space-y-2">
            <h1 className="text-lg font-bold text-slate-950">Admin Authorization Required</h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Signed in as <strong className="text-slate-900">{user.email}</strong>, which does not
              have admin edit permissions yet.
            </p>
            <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2 text-left">
              <div className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Firebase UID (Case-Sensitive)
                </span>
                <span className="block font-mono text-xs text-slate-900 truncate select-all">
                  {user.uid}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyUid}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded cursor-pointer shrink-0"
              >
                {uidCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy UID</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={logout}
              className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
            >
              Switch Google Account
            </button>
            <a
              href="../index.html"
              className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md text-center"
            >
              Back to Main
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated Admin Dashboard
  const pageTabs: {
    id: AdminPageTab;
    label: string;
    liveHref?: string;
    icon: typeof Home;
  }[] = [
    { id: 'main', label: 'Main Page', liveHref: '../index.html', icon: Home },
    { id: 'cars', label: 'Car Spare Parts', liveHref: './car-parts.html', icon: Car },
    {
      id: 'generators',
      label: 'Generator Spare Parts',
      liveHref: './generator-parts.html',
      icon: Cog,
    },
    {
      id: 'machinery',
      label: 'Heavy Machinery Parts',
      liveHref: './heavy-machinery-parts.html',
      icon: HardHat,
    },
    ...(isBootstrapAdmin
      ? [{ id: 'admins' as const, label: 'Admin Access', icon: ShieldCheck }]
      : []),
  ];

  const activeLiveHref = pageTabs.find((p) => p.id === activeTab)?.liveHref;
  const unreadInquiriesCount = inquiries.filter((item) => item.status === 'unread').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-[#0D1015] text-white border-b border-slate-800">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <a
              href="../index.html"
              className="inline-flex items-center shrink-0 bg-[#F7F6F2] rounded-md px-2.5 py-1 border border-slate-300/80"
            >
              <img
                src="../assets/logo/my-car-parts-logo.png"
                alt="My Car Parts"
                className="h-8 w-auto object-contain"
              />
            </a>
            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <LayoutDashboard className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
              <span className="text-sm font-bold tracking-tight truncate">
                Website &amp; Product Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Notification Bell Icon directly before Admin Email Address */}
            <div className="relative" ref={notifContainerRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                aria-label={`Notifications (${unreadInquiriesCount} unread)`}
                aria-expanded={notifOpen}
                className="relative inline-flex items-center justify-center w-9 h-9 rounded-md border border-slate-700 bg-slate-800/80 text-slate-200 hover:text-amber-400 hover:border-amber-500 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" aria-hidden="true" />
                {unreadInquiriesCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold leading-[18px] text-center tabular-nums shadow-xs">
                    {unreadInquiriesCount > 99 ? '99+' : unreadInquiriesCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div
                  role="dialog"
                  aria-label="New Inquiry Mail Notifications"
                  className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-11 w-[calc(100vw-1.5rem)] sm:w-[420px] max-h-[75vh] bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl flex flex-col overflow-hidden z-50"
                >
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                      <span className="text-xs sm:text-sm font-bold text-slate-950 truncate">
                        New Inquiry Mail ({unreadInquiriesCount} unread)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {unreadInquiriesCount > 0 && (
                        <button
                          type="button"
                          onClick={() => void markAllTechnicalInquiriesRead(inquiries)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded cursor-pointer"
                        >
                          <CheckCheck className="w-3 h-3" aria-hidden="true" />
                          <span>Mark all read</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setNotifOpen(false)}
                        aria-label="Close notifications"
                        className="p-1 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {inquiries.length === 0 ? (
                      <div className="p-8 text-center space-y-1.5">
                        <Bell className="w-7 h-7 text-slate-300 mx-auto" aria-hidden="true" />
                        <p className="text-xs font-semibold text-slate-700">No inquiry notifications yet</p>
                        <p className="text-[11px] text-slate-500">
                          Inquiries sent from the Main Page contact form appear here as New Inquiry Mail.
                        </p>
                      </div>
                    ) : (
                      inquiries.map((inq) => {
                        const isUnread = inq.status === 'unread';
                        const customerWaDigits = inq.mobileNo.replace(/\D/g, '');
                        return (
                          <div
                            key={inq.id}
                            className={`p-4 space-y-2 transition-colors ${
                              isUnread ? 'bg-amber-50/70' : 'bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                {isUnread && (
                                  <span
                                    className="w-2 h-2 rounded-full bg-amber-500 shrink-0"
                                    aria-hidden="true"
                                  />
                                )}
                                <span className="text-xs font-bold text-slate-950 truncate">
                                  {inq.title}
                                </span>
                                <span className="font-mono text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                                  {inq.ticketCode}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 whitespace-nowrap shrink-0">
                                {new Date(inq.createdAtMs).toLocaleString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            <div className="text-xs text-slate-800 space-y-1">
                              <p className="font-semibold text-slate-950">
                                {inq.contactName}{' '}
                                <a
                                  href={`tel:${inq.mobileNo.replace(/\s+/g, '')}`}
                                  className="inline-flex items-center gap-1 font-mono text-[11px] text-sky-700 hover:underline ml-1"
                                >
                                  <Phone className="w-3 h-3" aria-hidden="true" />
                                  <span>{inq.mobileNo}</span>
                                </a>
                              </p>
                              <p className="text-[11px] text-slate-600">
                                <span className="font-semibold text-slate-800">
                                  {inq.equipmentDivision}
                                </span>{' '}
                                · Part: <span className="font-semibold text-slate-900">{inq.partName}</span>
                                {inq.toolSkuSerial ? ` · SKU: ${inq.toolSkuSerial}` : ''}
                              </p>
                              <p className="text-xs text-slate-700 leading-relaxed bg-white/90 border border-slate-200 rounded-md p-2">
                                {inq.technicalDetails}
                              </p>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-1">
                              <div className="flex items-center gap-2">
                                {customerWaDigits && (
                                  <a
                                    href={`https://wa.me/${customerWaDigits}?text=${encodeURIComponent(
                                      `Hello ${inq.contactName}, regarding your inquiry (${inq.ticketCode}) for ${inq.partName}:`,
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded cursor-pointer"
                                  >
                                    <MessageCircle className="w-3 h-3" aria-hidden="true" />
                                    <span>WhatsApp Reply</span>
                                  </a>
                                )}
                                {isUnread && (
                                  <button
                                    type="button"
                                    onClick={() => void markTechnicalInquiryRead(inq.id)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                                  >
                                    <Check className="w-3 h-3" aria-hidden="true" />
                                    <span>Mark Read</span>
                                  </button>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => void deleteTechnicalInquiry(inq.id)}
                                aria-label={`Delete inquiry ${inq.ticketCode}`}
                                className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="hidden md:inline-block text-xs text-slate-300 truncate max-w-[200px]">
              {user.email}
            </span>
            {activeLiveHref && (
              <a
                href={activeLiveHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap"
              >
                <span>View Page</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}
            <a
              href="../index.html"
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 rounded-md whitespace-nowrap"
            >
              Back to Main
            </a>
            <button
              type="button"
              onClick={logout}
              aria-label="Sign out"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6">
        {/* Top-Level Page Selector (Strictly Separated by Page) */}
        <div
          role="tablist"
          aria-label="Website pages"
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3"
        >
          {pageTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-950 font-semibold'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {loadingData ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-sm text-slate-500">
            Loading live website sections and product cards...
          </div>
        ) : (
          <>
            {activeTab === 'main' && (
              <AdminMainPageManager
                sections={sections}
                heroSlides={heroSlides}
                divisionCards={divisionCards}
                toolInventory={toolInventory}
                onRefresh={loadAllCmsData}
              />
            )}

            {activeTab === 'cars' && (
              <AdminCatalogPageManager
                page="cars"
                banners={carBanners}
                makes={carMakes}
                groups={getPageGroupsFromSections('cars', sections)}
                products={carProducts}
                onRefresh={loadAllCmsData}
              />
            )}

            {activeTab === 'generators' && (
              <AdminCatalogPageManager
                page="generators"
                banners={genBanners}
                groups={getPageGroupsFromSections('generators', sections)}
                products={genProducts}
                onRefresh={loadAllCmsData}
              />
            )}

            {activeTab === 'machinery' && (
              <AdminCatalogPageManager
                page="machinery"
                headerSection={sections['machinery-header']}
                groups={getPageGroupsFromSections('machinery', sections)}
                products={machProducts}
                onRefresh={loadAllCmsData}
              />
            )}

            {activeTab === 'admins' && isBootstrapAdmin && (
              <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 max-w-2xl">
                <div>
                  <h2 className="text-base font-bold text-slate-950">Admin Access Control</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Primary owner ({user.email}) always has admin permissions. You may grant
                    additional verified Google users access by adding their Firebase UID below.
                  </p>
                </div>

                {adminMsg && (
                  <p className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-md">
                    {adminMsg}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newAdminUid}
                    onChange={(e) => setNewAdminUid(e.target.value)}
                    placeholder="Paste Firebase User UID..."
                    className="flex-1 px-3 py-2 text-xs font-mono border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await addAdminUid(newAdminUid);
                        setNewAdminUid('');
                        setAdminMsg('Admin UID added.');
                        await loadAllCmsData();
                      } catch (err) {
                        setAdminMsg(err instanceof Error ? err.message : 'Failed to add UID.');
                      }
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Grant Admin</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
                  {adminUsers.length === 0 ? (
                    <p className="p-4 text-xs text-slate-500">
                      No additional admin UIDs registered.
                    </p>
                  ) : (
                    adminUsers.map((adm) => (
                      <div
                        key={adm.uid}
                        className="p-3.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <span className="font-mono text-slate-800 truncate">{adm.uid}</span>
                        <button
                          type="button"
                          onClick={async () => {
                            await removeAdminUid(adm.uid);
                            setAdminMsg('Admin UID removed.');
                            await loadAllCmsData();
                          }}
                          className="p-1 text-slate-500 hover:text-red-600 cursor-pointer"
                          aria-label={`Remove ${adm.uid}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export function AdminPanelApp() {
  return (
    <ErrorBoundary>
      <AdminPanelWorkspace />
    </ErrorBoundary>
  );
}
