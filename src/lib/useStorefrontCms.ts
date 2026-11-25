import { useCallback, useEffect, useState } from 'react';
import {
  CAR_CATALOG_ITEMS,
  CAR_CATALOG_TABS,
  CAR_MAKES_DIRECTORY,
  CAR_PROMO_BANNERS,
  CarCatalogTab,
  CarMakeEntry,
  CarPromoBanner,
  CarSubCategoryItem,
} from '../data/carPartsCatalog';
import {
  GENERATOR_PARTS_CATALOG,
  GENERATOR_PROMO_BANNERS,
  GeneratorPartItem,
} from '../data/generatorPartsCatalog';
import {
  CATEGORY_CARDS,
  CategoryCardData,
  HERO_INVENTORY_SLIDES,
  HeroSlideItem,
  TOOL_INVENTORY,
  ToolItem,
} from '../data/inventory';
import {
  MACHINERY_PARTS_CATALOG,
  MachineryPartItem,
} from '../data/machineryPartsCatalog';
import {
  CatalogProductData,
  DEFAULT_PAGE_GROUPS,
  DEFAULT_SITE_SECTIONS,
  SiteSectionData,
  catalogProductToCarItem,
  catalogProductToGeneratorItem,
  catalogProductToMachineryItem,
  fetchCarGroups,
  fetchCarMakes,
  fetchCatalogProducts,
  fetchDivisionCards,
  fetchHeroSlides,
  fetchPageGroups,
  fetchPromoBanners,
  fetchSiteSections,
  fetchToolInventory,
  getPageGroupsFromSections,
} from './cmsService';

export function useMainPageCms() {
  const [sections, setSections] = useState<Record<string, SiteSectionData>>(
    DEFAULT_SITE_SECTIONS,
  );
  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>(HERO_INVENTORY_SLIDES);
  const [divisionCards, setDivisionCards] = useState<CategoryCardData[]>(CATEGORY_CARDS);
  const [toolInventory, setToolInventory] = useState<ToolItem[]>(TOOL_INVENTORY);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [sec, slides, divs, tools] = await Promise.all([
        fetchSiteSections(),
        fetchHeroSlides(),
        fetchDivisionCards(),
        fetchToolInventory(),
      ]);
      setSections(sec);
      setHeroSlides(slides);
      setDivisionCards(divs);
      setToolInventory(tools);
    } catch {
      // Errors are logged via handleFirestoreError; retain defaults gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { sections, heroSlides, divisionCards, toolInventory, loading, reload };
}

export function useCarPartsCms() {
  const [banners, setBanners] = useState<CarPromoBanner[]>(CAR_PROMO_BANNERS);
  const [makes, setMakes] = useState<CarMakeEntry[]>(CAR_MAKES_DIRECTORY);
  const [items, setItems] = useState<CarSubCategoryItem[]>(CAR_CATALOG_ITEMS);
  const [groups, setGroups] = useState<CarCatalogTab[]>(CAR_CATALOG_TABS);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [liveBanners, liveMakes, liveProducts, liveGroups] = await Promise.all([
        fetchPromoBanners('cars'),
        fetchCarMakes(),
        fetchCatalogProducts('cars'),
        fetchCarGroups(),
      ]);
      setBanners(liveBanners);
      setMakes(liveMakes);
      setItems(liveProducts.map(catalogProductToCarItem));
      setGroups(liveGroups);
    } catch {
      // Retain defaults gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { banners, makes, items, groups, loading, reload };
}

export function useGeneratorPartsCms() {
  const [banners, setBanners] = useState<CarPromoBanner[]>(GENERATOR_PROMO_BANNERS);
  const [items, setItems] = useState<GeneratorPartItem[]>(GENERATOR_PARTS_CATALOG);
  const [groups, setGroups] = useState<CarCatalogTab[]>(DEFAULT_PAGE_GROUPS.generators);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [liveBanners, liveProducts, liveGroups] = await Promise.all([
        fetchPromoBanners('generators'),
        fetchCatalogProducts('generators'),
        fetchPageGroups('generators'),
      ]);
      setBanners(liveBanners);
      setItems(liveProducts.map(catalogProductToGeneratorItem));
      setGroups(liveGroups);
    } catch {
      // Retain defaults gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { banners, items, groups, loading, reload };
}

export function useMachineryPartsCms() {
  const [headerSection, setHeaderSection] = useState<SiteSectionData>(
    DEFAULT_SITE_SECTIONS['machinery-header'],
  );
  const [items, setItems] = useState<MachineryPartItem[]>(MACHINERY_PARTS_CATALOG);
  const [groups, setGroups] = useState<CarCatalogTab[]>(DEFAULT_PAGE_GROUPS.machinery);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [liveSections, liveProducts] = await Promise.all([
        fetchSiteSections(),
        fetchCatalogProducts('machinery'),
      ]);
      if (liveSections['machinery-header']) {
        setHeaderSection(liveSections['machinery-header']);
      }
      setGroups(getPageGroupsFromSections('machinery', liveSections));
      setItems(liveProducts.map(catalogProductToMachineryItem));
    } catch {
      // Retain defaults gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { headerSection, items, groups, loading, reload };
}

export type { CatalogProductData };
