import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ToolCategory } from './data/inventory';
import { AdminPanelApp } from './pages/AdminPanelApp';
import { CarPartsCatalogApp } from './pages/CarPartsCatalogApp';
import { CookiesPolicyApp } from './pages/CookiesPolicyApp';
import { GeneratorPartsCatalogApp } from './pages/GeneratorPartsCatalogApp';
import { HeavyMachineryCatalogApp } from './pages/HeavyMachineryCatalogApp';
import { PrivacyPolicyApp } from './pages/PrivacyPolicyApp';
import { TermsConditionsApp } from './pages/TermsConditionsApp';
import { TermsOfServiceApp } from './pages/TermsOfServiceApp';

type PageMode = ToolCategory | 'admin' | 'conditions' | 'terms' | 'cookies' | 'privacy';

function resolveCategory(): PageMode {
  const fromBody = document.body.dataset.category;
  if (
    fromBody === 'cars' ||
    fromBody === 'generators' ||
    fromBody === 'machinery' ||
    fromBody === 'admin' ||
    fromBody === 'conditions' ||
    fromBody === 'terms' ||
    fromBody === 'cookies' ||
    fromBody === 'privacy'
  ) {
    return fromBody;
  }
  const path = window.location.pathname.toLowerCase();
  if (path.includes('admin')) return 'admin';
  if (path.includes('condition')) return 'conditions';
  if (path.includes('terms')) return 'terms';
  if (path.includes('cookie')) return 'cookies';
  if (path.includes('privacy')) return 'privacy';
  if (path.includes('generator')) return 'generators';
  if (path.includes('machinery')) return 'machinery';
  return 'cars';
}

const category = resolveCategory();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {category === 'admin' ? (
      <AdminPanelApp />
    ) : category === 'conditions' ? (
      <TermsConditionsApp />
    ) : category === 'terms' ? (
      <TermsOfServiceApp />
    ) : category === 'cookies' ? (
      <CookiesPolicyApp />
    ) : category === 'privacy' ? (
      <PrivacyPolicyApp />
    ) : category === 'cars' ? (
      <CarPartsCatalogApp />
    ) : category === 'generators' ? (
      <GeneratorPartsCatalogApp />
    ) : (
      <HeavyMachineryCatalogApp />
    )}
  </StrictMode>,
);
