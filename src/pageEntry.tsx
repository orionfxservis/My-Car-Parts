import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ToolCategory } from './data/inventory';
import { CarPartsCatalogApp } from './pages/CarPartsCatalogApp';
import { GeneratorPartsCatalogApp } from './pages/GeneratorPartsCatalogApp';
import { HeavyMachineryCatalogApp } from './pages/HeavyMachineryCatalogApp';

function resolveCategory(): ToolCategory {
  const fromBody = document.body.dataset.category;
  if (fromBody === 'cars' || fromBody === 'generators' || fromBody === 'machinery') {
    return fromBody;
  }
  const path = window.location.pathname.toLowerCase();
  if (path.includes('generator')) return 'generators';
  if (path.includes('machinery')) return 'machinery';
  return 'cars';
}

const category = resolveCategory();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {category === 'cars' ? (
      <CarPartsCatalogApp />
    ) : category === 'generators' ? (
      <GeneratorPartsCatalogApp />
    ) : (
      <HeavyMachineryCatalogApp />
    )}
  </StrictMode>,
);
