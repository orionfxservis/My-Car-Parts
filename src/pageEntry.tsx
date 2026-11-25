import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ToolCategory } from './data/inventory';
import { AdminPanelApp } from './pages/AdminPanelApp';
import { CarPartsCatalogApp } from './pages/CarPartsCatalogApp';
import { GeneratorPartsCatalogApp } from './pages/GeneratorPartsCatalogApp';
import { HeavyMachineryCatalogApp } from './pages/HeavyMachineryCatalogApp';

type PageMode = ToolCategory | 'admin';

function resolveCategory(): PageMode {
  const fromBody = document.body.dataset.category;
  if (
    fromBody === 'cars' ||
    fromBody === 'generators' ||
    fromBody === 'machinery' ||
    fromBody === 'admin'
  ) {
    return fromBody;
  }
  const path = window.location.pathname.toLowerCase();
  if (path.includes('admin')) return 'admin';
  if (path.includes('generator')) return 'generators';
  if (path.includes('machinery')) return 'machinery';
  return 'cars';
}

const category = resolveCategory();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {category === 'admin' ? (
      <AdminPanelApp />
    ) : category === 'cars' ? (
      <CarPartsCatalogApp />
    ) : category === 'generators' ? (
      <GeneratorPartsCatalogApp />
    ) : (
      <HeavyMachineryCatalogApp />
    )}
  </StrictMode>,
);
