/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useMemo, useState } from 'react';
import { CategoryTriad } from './components/CategoryTriad';
import { CompanySection } from './components/CompanySection';
import { CookieBanner, CookiePreferences } from './components/CookieBanner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { HeroMarquee } from './components/HeroMarquee';
import { LiveChatBubble } from './components/LiveChatBubble';
import { Navbar } from './components/Navbar';
import { QuoteDrawer } from './components/QuoteDrawer';
import { TechnicalSupport } from './components/TechnicalSupport';
import { ToolDetailModal } from './components/ToolDetailModal';
import { HeroSlideItem, ToolCategory, ToolItem } from './data/inventory';
import { useMainPageCms } from './lib/useStorefrontCms';

const COOKIE_STORAGE_KEY = 'my_car_parts_cookie_consent';
const QUOTE_STORAGE_KEY = 'my_car_parts_quote_ids';

export default function App() {
  const { sections, heroSlides, divisionCards, toolInventory } = useMainPageCms();
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [quoteIds, setQuoteIds] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem(QUOTE_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [quoteDrawerOpen, setQuoteDrawerOpen] = useState(false);
  const [chatExternalPrompt, setChatExternalPrompt] = useState<string | null>(null);
  const [cookieBannerVisible, setCookieBannerVisible] = useState<boolean>(() => {
    try {
      return !window.localStorage.getItem(COOKIE_STORAGE_KEY);
    } catch {
      return true;
    }
  });

  const saveQuoteIds = useCallback((updater: (prev: string[]) => string[]) => {
    setQuoteIds((prev) => {
      const next = updater(prev);
      try {
        window.localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const quoteItems = useMemo(
    () => toolInventory.filter((item) => quoteIds.includes(item.id)),
    [quoteIds, toolInventory],
  );

  const handleNavigateCategory = useCallback((category: ToolCategory) => {
    if (category === 'cars') {
      window.location.href = './pages/car-parts.html';
    } else if (category === 'generators') {
      window.location.href = './pages/generator-parts.html';
    } else {
      window.location.href = './pages/heavy-machinery-parts.html';
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

  const handleInspectSlide = useCallback(
    (slide: HeroSlideItem) => {
      const found =
        toolInventory.find((t) => t.id === slide.toolId) || toolInventory[0] || null;
      if (found) {
        setSelectedTool(found);
      }
    },
    [toolInventory],
  );

  const handleToggleQuote = useCallback(
    (tool: ToolItem) => {
      saveQuoteIds((prev) =>
        prev.includes(tool.id) ? prev.filter((id) => id !== tool.id) : [...prev, tool.id],
      );
    },
    [saveQuoteIds],
  );

  const handleRemoveQuoteItem = useCallback(
    (id: string) => {
      saveQuoteIds((prev) => prev.filter((item) => item !== id));
    },
    [saveQuoteIds],
  );

  const handleClearQuote = useCallback(() => {
    saveQuoteIds(() => []);
  }, [saveQuoteIds]);

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
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#0D1015] text-slate-100">
        <Navbar
          quoteCount={quoteItems.length}
          onSelectCategory={handleNavigateCategory}
          onOpenQuote={() => setQuoteDrawerOpen(true)}
        />

        <main className="flex-1">
          <HeroMarquee
            section={sections['main-hero']}
            slides={heroSlides}
            onExploreCatalog={handleExploreCatalog}
            onInspectSlide={handleInspectSlide}
            onOpenSupport={handleOpenSupport}
          />

          <CategoryTriad cards={divisionCards} />

          <CompanySection section={sections['main-company']} />

          <TechnicalSupport
            section={sections['main-support']}
            onOpenChatWithTopic={(topic) => setChatExternalPrompt(topic)}
          />
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
    </ErrorBoundary>
  );
}
