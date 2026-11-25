import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { CategoryCardData, HeroSlideItem, ToolCategory, ToolItem } from '../../data/inventory';
import {
  DEFAULT_SITE_SECTIONS,
  SiteSectionData,
  deleteHeroSlide,
  deleteToolInventoryItem,
  resetDivisionCardsToDefaults,
  resetHeroSlidesToDefaults,
  resetToolInventoryToDefaults,
  saveDivisionCard,
  saveHeroSlide,
  saveSiteSection,
  saveToolInventoryItem,
} from '../../lib/cmsService';
import { resolveAssetUrl, sanitizeId } from '../../lib/cmsValidation';
import { ImageFieldEditor } from './ImageFieldEditor';

type MainSubSection =
  | 'hero-section'
  | 'hero-slides'
  | 'division-cards'
  | 'tool-inventory'
  | 'company-support';

interface AdminMainPageManagerProps {
  sections: Record<string, SiteSectionData>;
  heroSlides: HeroSlideItem[];
  divisionCards: CategoryCardData[];
  toolInventory: ToolItem[];
  onRefresh: () => Promise<void>;
}

export function AdminMainPageManager({
  sections,
  heroSlides,
  divisionCards,
  toolInventory,
  onRefresh,
}: AdminMainPageManagerProps) {
  const [subTab, setSubTab] = useState<MainSubSection>('hero-section');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Local drafts for sections
  const [heroDraft, setHeroDraft] = useState<SiteSectionData>(
    sections['main-hero'] ?? DEFAULT_SITE_SECTIONS['main-hero'],
  );
  const [companyDraft, setCompanyDraft] = useState<SiteSectionData>(
    sections['main-company'] ?? DEFAULT_SITE_SECTIONS['main-company'],
  );
  const [supportDraft, setSupportDraft] = useState<SiteSectionData>(
    sections['main-support'] ?? DEFAULT_SITE_SECTIONS['main-support'],
  );

  useEffect(() => {
    setHeroDraft(sections['main-hero'] ?? DEFAULT_SITE_SECTIONS['main-hero']);
    setCompanyDraft(sections['main-company'] ?? DEFAULT_SITE_SECTIONS['main-company']);
    setSupportDraft(sections['main-support'] ?? DEFAULT_SITE_SECTIONS['main-support']);
  }, [sections]);

  // Active item modals
  const [editingSlide, setEditingSlide] = useState<(HeroSlideItem & { sortOrder: number }) | null>(
    null,
  );
  const [editingDivision, setEditingDivision] = useState<
    (CategoryCardData & { sortOrder: number }) | null
  >(null);
  const [editingTool, setEditingTool] = useState<(ToolItem & { sortOrder: number }) | null>(null);

  const notify = (msg: string) => {
    setErrorMsg('');
    setStatusMsg(msg);
  };

  const fail = (err: unknown) => {
    setStatusMsg('');
    setErrorMsg(err instanceof Error ? err.message : 'Save failed.');
  };

  const handleSaveHeroSection = async () => {
    setSaving(true);
    try {
      await saveSiteSection(heroDraft);
      await onRefresh();
      notify('Main Page Hero & Overview updated.');
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCompanySupport = async (target: 'company' | 'support') => {
    setSaving(true);
    try {
      await saveSiteSection(target === 'company' ? companyDraft : supportDraft);
      await onRefresh();
      notify(
        target === 'company'
          ? 'About / Company section updated.'
          : 'Technical Support Desk section updated.',
      );
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSlide = async () => {
    if (!editingSlide) return;
    setSaving(true);
    try {
      const mapped = heroSlides.map((s, idx) => ({ ...s, sortOrder: idx }));
      await saveHeroSlide(editingSlide, mapped);
      setEditingSlide(null);
      await onRefresh();
      notify('Hero showcase slide saved.');
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    setSaving(true);
    try {
      const mapped = heroSlides.map((s, idx) => ({ ...s, sortOrder: idx }));
      await deleteHeroSlide(id, mapped);
      await onRefresh();
      notify('Hero showcase slide deleted.');
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDivision = async () => {
    if (!editingDivision) return;
    setSaving(true);
    try {
      const mapped = divisionCards.map((c, idx) => ({ ...c, sortOrder: idx }));
      await saveDivisionCard(editingDivision, mapped);
      setEditingDivision(null);
      await onRefresh();
      notify(`Division card "${editingDivision.title}" saved.`);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTool = async () => {
    if (!editingTool) return;
    setSaving(true);
    try {
      const mapped = toolInventory.map((t, idx) => ({ ...t, sortOrder: idx }));
      await saveToolInventoryItem(editingTool, mapped);
      setEditingTool(null);
      await onRefresh();
      notify(`Tool specification "${editingTool.name}" saved.`);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTool = async (id: string) => {
    setSaving(true);
    try {
      const mapped = toolInventory.map((t, idx) => ({ ...t, sortOrder: idx }));
      await deleteToolInventoryItem(id, mapped);
      await onRefresh();
      notify('Tool item deleted.');
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const subTabs: { id: MainSubSection; label: string }[] = [
    { id: 'hero-section', label: 'Hero Text & Overview' },
    { id: 'hero-slides', label: `Hero Slides & Marquee (${heroSlides.length})` },
    { id: 'division-cards', label: `Division Cards (${divisionCards.length})` },
    { id: 'tool-inventory', label: `Featured Tool Cards (${toolInventory.length})` },
    { id: 'company-support', label: 'Company & Tech Support' },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation keeping all Main Page sections clearly separated */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        {subTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setSubTab(t.id);
              setStatusMsg('');
              setErrorMsg('');
            }}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md border transition-colors cursor-pointer ${
              subTab === t.id
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-950'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {statusMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm font-medium text-red-900">
          {errorMsg}
        </div>
      )}

      {/* 1A. Hero Banner & Overview */}
      {subTab === 'hero-section' && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Main Page — Hero Header &amp; Buyer Overview
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Controls the top headline, intro copy, 3 engineering metrics, and overview section.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHeroDraft(DEFAULT_SITE_SECTIONS['main-hero'])}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Load Defaults</span>
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveHeroSection}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 rounded-md cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{saving ? 'Saving...' : 'Save Hero Section'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Top Eyebrow Tagline
              </label>
              <input
                type="text"
                value={heroDraft.eyebrow}
                onChange={(e) => setHeroDraft({ ...heroDraft, eyebrow: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/25"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Main Hero Headline (H1)
              </label>
              <input
                type="text"
                value={heroDraft.heading}
                onChange={(e) => setHeroDraft({ ...heroDraft, heading: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/25"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Main Hero Description
              </label>
              <textarea
                rows={3}
                value={heroDraft.description}
                onChange={(e) => setHeroDraft({ ...heroDraft, description: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/25"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-800 mb-2">Hero Metrics (3 Columns)</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {heroDraft.stats.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const nextStats = [...heroDraft.stats];
                        nextStats[idx] = { ...st, value: e.target.value };
                        setHeroDraft({ ...heroDraft, stats: nextStats });
                      }}
                      placeholder="Value"
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => {
                        const nextStats = [...heroDraft.stats];
                        nextStats[idx] = { ...st, label: e.target.value };
                        setHeroDraft({ ...heroDraft, stats: nextStats });
                      }}
                      placeholder="Label"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Buyer Overview Heading (Below Marquee)
                </label>
                <input
                  type="text"
                  value={heroDraft.secondaryHeading}
                  onChange={(e) =>
                    setHeroDraft({ ...heroDraft, secondaryHeading: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/25"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Buyer Overview Description
                </label>
                <textarea
                  rows={4}
                  value={heroDraft.secondaryText}
                  onChange={(e) => setHeroDraft({ ...heroDraft, secondaryText: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/25"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 1B. Hero Showcase & Marquee Slides */}
      {subTab === 'hero-slides' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Hero Showcase &amp; Continuous Marquee Slides
              </h3>
              <p className="text-xs text-slate-500">
                Edit slide images, titles, SKUs, and specification summaries on the main banner.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  try {
                    await resetHeroSlidesToDefaults();
                    await onRefresh();
                    notify('Hero slides reset to original defaults.');
                  } catch (err) {
                    fail(err);
                  } finally {
                    setSaving(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditingSlide({
                    id: `slide-${Date.now()}`,
                    sortOrder: heroSlides.length,
                    toolId: toolInventory[0]?.id || 'vk-car-torque',
                    categoryLabel: 'Car Spare Parts',
                    sku: 'VK-NEW-01',
                    title: '',
                    specSummary: '',
                    image: '',
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Slide</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                    <img
                      src={resolveAssetUrl(slide.image, '..')}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="text-[11px] font-semibold text-amber-700">
                      {slide.categoryLabel} · {slide.sku}
                    </p>
                    <h4 className="text-sm font-bold text-slate-950">{slide.title}</h4>
                    <p className="text-xs text-slate-600">{slide.specSummary}</p>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/70">
                  <button
                    type="button"
                    onClick={() => setEditingSlide({ ...slide, sortOrder: idx })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:border-amber-500 rounded-md cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Edit Image &amp; Text</span>
                  </button>
                  <button
                    type="button"
                    disabled={saving || heroSlides.length <= 1}
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 disabled:opacity-40 cursor-pointer"
                    aria-label={`Delete ${slide.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 1C. Core Division Cards */}
      {subTab === 'division-cards' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Core Equipment &amp; Tooling Division Cards
              </h3>
              <p className="text-xs text-slate-500">
                Manage the 3 main showcase cards linking to Car Parts, Generator Parts, and Heavy Machinery Parts.
              </p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  await resetDivisionCardsToDefaults();
                  await onRefresh();
                  notify('Division cards reset to original defaults.');
                } catch (err) {
                  fail(err);
                } finally {
                  setSaving(false);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {divisionCards.map((card, idx) => (
              <div
                key={card.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] bg-slate-50 border-b border-slate-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={resolveAssetUrl(card.image, '..')}
                      alt={card.title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <p className="text-xs font-semibold text-amber-700">{card.indexLabel}</p>
                    <h4 className="text-base font-bold text-slate-950">{card.title}</h4>
                    <p className="text-xs font-medium text-slate-500">{card.subtitle}</p>
                    <p className="text-xs text-slate-700 leading-relaxed line-clamp-4">
                      {card.description}
                    </p>
                  </div>
                </div>
                <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/70">
                  <button
                    type="button"
                    onClick={() => setEditingDivision({ ...card, sortOrder: idx })}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Edit Division Image &amp; Description</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 1D. Featured Tool Cards */}
      {subTab === 'tool-inventory' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Featured Product &amp; Tooling Specification Cards
              </h3>
              <p className="text-xs text-slate-500">
                Displayed when visitors click Inspect Specs on the Main Page or add tools to a quote.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  try {
                    await resetToolInventoryToDefaults();
                    await onRefresh();
                    notify('Tool inventory reset to original defaults.');
                  } catch (err) {
                    fail(err);
                  } finally {
                    setSaving(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditingTool({
                    id: `tool-${Date.now()}`,
                    sku: 'VK-NEW-100',
                    name: '',
                    category: 'cars',
                    categoryLabel: 'Car Spare Parts',
                    image: '',
                    shortDesc: '',
                    fullDesc: '',
                    price: 500,
                    availability: 'In Stock',
                    warranty: '3-Year Warranty',
                    specs: [{ label: 'Rating', value: 'Industrial Grade' }],
                    applications: ['Commercial workshop maintenance'],
                    sortOrder: toolInventory.length,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Tool Card</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {toolInventory.map((tool, idx) => (
              <div
                key={tool.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                    <img
                      src={resolveAssetUrl(tool.image, '..')}
                      alt={tool.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-amber-700">{tool.categoryLabel}</span>
                      <span className="font-mono text-slate-500">{tool.sku}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-950">{tool.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-3">{tool.shortDesc}</p>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/70">
                  <button
                    type="button"
                    onClick={() => setEditingTool({ ...tool, sortOrder: idx })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:border-amber-500 rounded-md cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Edit Product</span>
                  </button>
                  <button
                    type="button"
                    disabled={saving || toolInventory.length <= 1}
                    onClick={() => handleDeleteTool(tool.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 disabled:opacity-40 cursor-pointer"
                    aria-label={`Delete ${tool.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 1E. About Company & Technical Support Desk */}
      {subTab === 'company-support' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Section Card */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-950">About / Company Section</h3>
                <p className="text-xs text-slate-500">Main page company overview and 3 standards.</p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveCompanySupport('company')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save Company</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Eyebrow</label>
              <input
                type="text"
                value={companyDraft.eyebrow}
                onChange={(e) => setCompanyDraft({ ...companyDraft, eyebrow: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Heading</label>
              <input
                type="text"
                value={companyDraft.heading}
                onChange={(e) => setCompanyDraft({ ...companyDraft, heading: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Primary Paragraph
              </label>
              <textarea
                rows={3}
                value={companyDraft.description}
                onChange={(e) => setCompanyDraft({ ...companyDraft, description: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Secondary Paragraph
              </label>
              <textarea
                rows={3}
                value={companyDraft.secondaryText}
                onChange={(e) =>
                  setCompanyDraft({ ...companyDraft, secondaryText: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold text-slate-800">Engineering Standards</p>
              {companyDraft.items.map((std, idx) => (
                <div
                  key={std.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={std.code || ''}
                      onChange={(e) => {
                        const next = [...companyDraft.items];
                        next[idx] = { ...std, code: e.target.value };
                        setCompanyDraft({ ...companyDraft, items: next });
                      }}
                      className="w-16 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded"
                    />
                    <input
                      type="text"
                      value={std.title}
                      onChange={(e) => {
                        const next = [...companyDraft.items];
                        next[idx] = { ...std, title: e.target.value };
                        setCompanyDraft({ ...companyDraft, items: next });
                      }}
                      className="flex-1 px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={std.summary}
                    onChange={(e) => {
                      const next = [...companyDraft.items];
                      next[idx] = { ...std, summary: e.target.value };
                      setCompanyDraft({ ...companyDraft, items: next });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Technical Support Section Card */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-950">Technical Support Desk</h3>
                <p className="text-xs text-slate-500">Heading copy and technical guide cards.</p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveCompanySupport('support')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save Support</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Eyebrow</label>
              <input
                type="text"
                value={supportDraft.eyebrow}
                onChange={(e) => setSupportDraft({ ...supportDraft, eyebrow: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Heading</label>
              <input
                type="text"
                value={supportDraft.heading}
                onChange={(e) => setSupportDraft({ ...supportDraft, heading: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Admin Notification Mobile No
              </label>
              <input
                type="tel"
                value={supportDraft.secondaryHeading || '+92 300 2183149'}
                onChange={(e) =>
                  setSupportDraft({ ...supportDraft, secondaryHeading: e.target.value })
                }
                placeholder="+92 300 2183149"
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Receives &ldquo;New Inquiry Mail&rdquo; mobile dispatches from the main page contact form.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={supportDraft.description}
                onChange={(e) =>
                  setSupportDraft({ ...supportDraft, description: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold text-slate-800">Technical Documentation Cards</p>
              {supportDraft.items.map((guide, idx) => (
                <div
                  key={guide.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={guide.category || ''}
                      onChange={(e) => {
                        const next = [...supportDraft.items];
                        next[idx] = { ...guide, category: e.target.value };
                        setSupportDraft({ ...supportDraft, items: next });
                      }}
                      placeholder="Category"
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                    />
                    <input
                      type="text"
                      value={guide.code || ''}
                      onChange={(e) => {
                        const next = [...supportDraft.items];
                        next[idx] = { ...guide, code: e.target.value };
                        setSupportDraft({ ...supportDraft, items: next });
                      }}
                      placeholder="Doc Code"
                      className="px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <input
                    type="text"
                    value={guide.title}
                    onChange={(e) => {
                      const next = [...supportDraft.items];
                      next[idx] = { ...guide, title: e.target.value };
                      setSupportDraft({ ...supportDraft, items: next });
                    }}
                    placeholder="Title"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded"
                  />
                  <textarea
                    rows={2}
                    value={guide.summary}
                    onChange={(e) => {
                      const next = [...supportDraft.items];
                      next[idx] = { ...guide, summary: e.target.value };
                      setSupportDraft({ ...supportDraft, items: next });
                    }}
                    placeholder="Summary"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Slide Edit Modal */}
      {editingSlide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setEditingSlide(null)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-950">Edit Hero Slide</h3>
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <ImageFieldEditor
                label="Slide Image"
                value={editingSlide.image}
                onChange={(img) => setEditingSlide({ ...editingSlide, image: img })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Category Label
                  </label>
                  <input
                    type="text"
                    value={editingSlide.categoryLabel}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, categoryLabel: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">SKU</label>
                  <input
                    type="text"
                    value={editingSlide.sku}
                    onChange={(e) => setEditingSlide({ ...editingSlide, sku: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Slide Title
                </label>
                <input
                  type="text"
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Specification Summary
                </label>
                <input
                  type="text"
                  value={editingSlide.specSummary}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, specSummary: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveSlide}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Slide'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Division Card Edit Modal */}
      {editingDivision && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setEditingDivision(null)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-950">
                Edit Division Card — {editingDivision.title}
              </h3>
              <button
                type="button"
                onClick={() => setEditingDivision(null)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <ImageFieldEditor
                label="Division Card Image"
                value={editingDivision.image}
                onChange={(img) => setEditingDivision({ ...editingDivision, image: img })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Index Label
                  </label>
                  <input
                    type="text"
                    value={editingDivision.indexLabel}
                    onChange={(e) =>
                      setEditingDivision({ ...editingDivision, indexLabel: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={editingDivision.title}
                    onChange={(e) =>
                      setEditingDivision({ ...editingDivision, title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editingDivision.subtitle}
                  onChange={(e) =>
                    setEditingDivision({ ...editingDivision, subtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editingDivision.description}
                  onChange={(e) =>
                    setEditingDivision({ ...editingDivision, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-800">Key Highlights</p>
                {editingDivision.highlights.map((hl, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={hl.label}
                      onChange={(e) => {
                        const next = [...editingDivision.highlights];
                        next[idx] = { ...hl, label: e.target.value };
                        setEditingDivision({ ...editingDivision, highlights: next });
                      }}
                      className="px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                    />
                    <input
                      type="text"
                      value={hl.value}
                      onChange={(e) => {
                        const next = [...editingDivision.highlights];
                        next[idx] = { ...hl, value: e.target.value };
                        setEditingDivision({ ...editingDivision, highlights: next });
                      }}
                      className="px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded"
                    />
                  </div>
                ))}
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDivision(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveDivision}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Division Card'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tool Spec Edit Modal */}
      {editingTool && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setEditingTool(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-950">
                Edit Featured Product / Tool Card
              </h3>
              <button
                type="button"
                onClick={() => setEditingTool(null)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <ImageFieldEditor
                label="Product Image"
                value={editingTool.image}
                onChange={(img) => setEditingTool({ ...editingTool, image: img })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">SKU</label>
                  <input
                    type="text"
                    value={editingTool.sku}
                    onChange={(e) => setEditingTool({ ...editingTool, sku: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Category
                  </label>
                  <select
                    value={editingTool.category}
                    onChange={(e) => {
                      const cat = e.target.value as ToolCategory;
                      const labelMap: Record<ToolCategory, string> = {
                        cars: 'Car Spare Parts',
                        generators: 'Industrial Generator Spare Parts',
                        machinery: 'Heavy Machinery Parts',
                      };
                      setEditingTool({
                        ...editingTool,
                        category: cat,
                        categoryLabel: labelMap[cat],
                      });
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
                  >
                    <option value="cars">Car Spare Parts</option>
                    <option value="generators">Industrial Generator Spare Parts</option>
                    <option value="machinery">Heavy Machinery Parts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Availability
                  </label>
                  <select
                    value={editingTool.availability}
                    onChange={(e) =>
                      setEditingTool({
                        ...editingTool,
                        availability: e.target.value as 'In Stock' | 'Built to Order',
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Built to Order">Built to Order</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editingTool.name}
                    onChange={(e) =>
                      setEditingTool({
                        ...editingTool,
                        name: e.target.value,
                        id:
                          editingTool.id.startsWith('tool-') && e.target.value
                            ? sanitizeId(`tool-${e.target.value}`, editingTool.id)
                            : editingTool.id,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Price (Rs)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingTool.price}
                    onChange={(e) =>
                      setEditingTool({ ...editingTool, price: Number(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingTool.shortDesc}
                  onChange={(e) => setEditingTool({ ...editingTool, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={editingTool.fullDesc}
                  onChange={(e) => setEditingTool({ ...editingTool, fullDesc: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Applications (one per line)
                </label>
                <textarea
                  rows={3}
                  value={editingTool.applications.join('\n')}
                  onChange={(e) =>
                    setEditingTool({
                      ...editingTool,
                      applications: e.target.value.split('\n'),
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveTool}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
