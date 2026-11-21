/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useMemo, useState } from 'react';
import { CategoryTriad } from './components/CategoryTriad';
import { CompanySection } from './components/CompanySection';
import { CookieBanner, CookiePreferences } from './components/CookieBanner';
import { Footer } from './components/Footer';
import { HeroMarquee } from './components/HeroMarquee';
import { LiveChatBubble } from './components/LiveChatBubble';
import { Navbar } from './components/Navbar';
import { QuoteDrawer } from './components/QuoteDrawer';
import { TechnicalSupport } from './components/TechnicalSupport';
import { ToolDetailModal } from './components/ToolDetailModal';
import { ToolsCatalog } from './components/ToolsCatalog';
import { HeroSlideItem, TOOL_INVENTORY, ToolCategory, ToolItem } from './data/inventory';

const COOKIE_STORAGE_KEY = 'my_car_parts_cookie_consent';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [quoteIds, setQuoteIds] = useState<string[]>([]);
  const [quoteDrawerOpen, setQuoteDrawerOpen] = useState(false);
  const [chatExternalPrompt, setChatExternalPrompt] = useState<string | null>(null);
  const [cookieBannerVisible, setCookieBannerVisible] = useState<boolean>(() => {
    try {
      return !window.localStorage.getItem(COOKIE_STORAGE_KEY);
    } catch {
      return true;
    }
  });

  const quoteItems = useMemo(
    () => TOOL_INVENTORY.filter((item) => quoteIds.includes(item.id)),
    [quoteIds],
  );

  const handleSelectCategoryAndScroll = useCallback((category: ToolCategory) => {
    setActiveCategory(category);
    const el = document.getElementById('tools-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleExploreCatalog = useCallback(() => {
    const el = document.getElementById('categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleOpenSupport = useCallback(() => {
    const el = document.getElementById('technical-support');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleInspectSlide = useCallback((slide: HeroSlideItem) => {
    const found = TOOL_INVENTORY.find((t) => t.id === slide.toolId);
    if (found) {
      setSelectedTool(found);
    }
  }, []);

  const handleToggleQuote = useCallback((tool: ToolItem) => {
    setQuoteIds((prev) =>
      prev.includes(tool.id) ? prev.filter((id) => id !== tool.id) : [...prev, tool.id],
    );
  }, []);

  const handleRemoveQuoteItem = useCallback((id: string) => {
    setQuoteIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const handleClearQuote = useCallback(() => {
    setQuoteIds([]);
  }, []);

  const handleConsumePrompt = useCallback(() => {
    setChatExternalPrompt(null);
  }, []);

  const handleCookieDismiss = useCallback((prefs: CookiePreferences) => {
    try {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage errors in restricted browsing modes
    }
    setCookieBannerVisible(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0D1015] text-slate-100">
      <Navbar
        quoteCount={quoteItems.length}
        onSelectCategory={handleSelectCategoryAndScroll}
        onOpenQuote={() => setQuoteDrawerOpen(true)}
      />

      <main className="flex-1">
        <HeroMarquee
          onExploreCatalog={handleExploreCatalog}
          onInspectSlide={handleInspectSlide}
          onOpenSupport={handleOpenSupport}
        />

        <CategoryTriad
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategoryAndScroll}
        />

        <ToolsCatalog
          activeCategory={activeCategory}
          onChangeCategory={setActiveCategory}
          quoteIds={quoteIds}
          onToggleQuote={handleToggleQuote}
          onInspectTool={setSelectedTool}
        />

        <CompanySection />

        <TechnicalSupport onOpenChatWithTopic={(topic) => setChatExternalPrompt(topic)} />
      </main>

      <Footer />

      <ToolDetailModal
        tool={selectedTool}
        inQuote={selectedTool ? quoteIds.includes(selectedTool.id) : false}
        onClose={() => setSelectedTool(null)}
        onToggleQuote={handleToggleQuote}
      />

      <QuoteDrawer
        open={quoteDrawerOpen}
        items={quoteItems}
        onClose={() => setQuoteDrawerOpen(false)}
        onRemoveItem={handleRemoveQuoteItem}
        onClearItems={handleClearQuote}
      />

      <LiveChatBubble
        externalPrompt={chatExternalPrompt}
        onConsumeExternalPrompt={handleConsumePrompt}
        cookieBannerVisible={cookieBannerVisible}
      />

      <CookieBanner visible={cookieBannerVisible} onDismiss={handleCookieDismiss} />
    </div>
  );
}
