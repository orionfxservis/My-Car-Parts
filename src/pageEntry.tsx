import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ToolCategory } from './data/inventory';
import { CarPartsCatalogApp } from './pages/CarPartsCatalogApp';
import { CategoryLandingApp } from './pages/CategoryLandingApp';

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
    ) : (
      <CategoryLandingApp category={category} />
    )}
  </StrictMode>,
);
