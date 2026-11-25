/**
 * Security Rule Verification Payloads ("Dirty Dozen") against firestore.rules.
 * Documents negative-assertion test vectors covering auth, email verification,
 * schema keys, path IDs, array bounds, and immutable fields.
 */

export const DIRTY_DOZEN_PAYLOADS = [
  {
    name: '1. Unauthenticated product create',
    auth: null,
    path: '/catalog_products/unauth-item',
    op: 'create',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '2. Non-admin signed-in user update',
    auth: { uid: 'user-123', email: 'visitor@example.com', email_verified: true },
    path: '/catalog_products/gen-fuel-filters',
    op: 'update',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '3. Unverified admin email spoof attack',
    auth: { uid: 'spoof-1', email: 'orionfxservis@gmail.com', email_verified: false },
    path: '/site_sections/main-hero',
    op: 'update',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '4. Shadow ghost field injection on CatalogProduct',
    auth: { uid: 'admin-1', email: 'orionfxservis@gmail.com', email_verified: true },
    path: '/catalog_products/brake-system',
    op: 'create',
    data: { ghostField: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '5. Oversized image payload (> 350000 chars)',
    auth: { uid: 'admin-1', email: 'orionfxservis@gmail.com', email_verified: true },
    path: '/catalog_products/brake-system',
    op: 'update',
    data: { imageSize: 400000 },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '6. Invalid document ID poisoning',
    auth: { uid: 'admin-1', email: 'orionfxservis@gmail.com', email_verified: true },
    path: '/catalog_products/bad..id$%',
    op: 'create',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '7. Client-forged timestamp bypass',
    auth: { uid: 'admin-1', email: 'orionfxservis@gmail.com', email_verified: true },
    path: '/promo_banners/banner-1',
    op: 'create',
    data: { updatedAt: '2020-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '8. Impersonated updatedBy UID',
    auth: { uid: 'admin-1', email: 'orionfxservis@gmail.com', email_verified: true },
    path: '/hero_slides/slide-1',
    op: 'create',
    data: { updatedBy: 'other-uid' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '9. Immutable createdAt tampering on update',
    auth: { uid: 'admin-1', email: 'orionfxservis@gmail.com', email_verified: true },
    path: '/division_cards/cars',
    op: 'update',
    data: { createdAt: 'request.time' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '10. Unbounded array injection (> 15 components)',
    auth: { uid: 'admin-1', email: 'orionfxservis@gmail.com', email_verified: true },
    path: '/catalog_products/brake-system',
    op: 'update',
    data: { componentsCount: 25 },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '11. Self-assigned admin privilege escalation',
    auth: { uid: 'user-123', email: 'visitor@example.com', email_verified: true },
    path: '/admins/user-123',
    op: 'create',
    data: { uid: 'user-123', role: 'admin' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '12. Unauthorized list query on /admins',
    auth: { uid: 'user-123', email: 'visitor@example.com', email_verified: true },
    path: '/admins',
    op: 'list',
    expected: 'PERMISSION_DENIED',
  },
] as const;
