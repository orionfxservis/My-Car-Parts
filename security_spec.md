# Security Specification & Payload-First Verification

## 1. Data Invariants
1. **Admin-Only Content Mutations**: Only verified admin accounts (`request.auth != null && request.auth.token.email_verified == true` AND either `request.auth.token.email == 'orionfxservis@gmail.com'` or an existing `/admins/$(request.auth.uid)` record) may create, update, or delete any CMS document (`site_sections`, `hero_slides`, `division_cards`, `tool_inventory`, `promo_banners`, `car_makes`, `catalog_products`).
2. **Public Storefront Reads (Zero PII)**: Published storefront catalog collections contain only public product titles, summaries, specifications, and image URLs/assets—never user PII—and allow `get` and `list` without exposing `/admins` or unvalidated writes.
3. **Document ID & Field Boundary Enforcement**: Every document ID matches `^[a-zA-Z0-9_\-]+$` (`<= 128` chars), and every string and list field enforces strict type, enum, `.size()`, and `keys().hasOnly(...)` checks.
4. **Immutable Creation & Identity Integrity**: `id` and `createdAt` remain immutable on updates; `updatedBy` strictly matches `request.auth.uid`; `createdAt` and `updatedAt` strictly equal `request.time`.
5. **Privilege Escalation Prevention**: Users cannot write or self-assign entries in `/admins/{userId}`; only the bootstrapped verified owner (`orionfxservis@gmail.com`) may list or manage `/admins/{userId}`.

## 2. "Dirty Dozen" Adversarial Payloads
1. Unauthenticated `create` on `/catalog_products/hacked` -> `PERMISSION_DENIED`.
2. Non-admin authenticated Google user `update` on `/catalog_products/gen-fuel-filters` -> `PERMISSION_DENIED`.
3. Spoofed admin email with `email_verified: false` attempting `create` on `/site_sections/main-hero` -> `PERMISSION_DENIED`.
4. Shadow field injection (`extraAdminFlag: true`) on `/catalog_products/brake-system` -> `PERMISSION_DENIED` (blocked by `keys().hasOnly`).
5. Oversized `image` string (`> 350000` chars) to exhaust storage/bandwidth -> `PERMISSION_DENIED`.
6. Invalid ID poisoning (`/catalog_products/bad..id$%` or `> 128` chars) -> `PERMISSION_DENIED` (blocked by `isValidId`).
7. Timestamp spoofing (`createdAt` or `updatedAt` != `request.time`) -> `PERMISSION_DENIED`.
8. Impersonated `updatedBy` (`updatedBy != request.auth.uid`) -> `PERMISSION_DENIED`.
9. Mutating `createdAt` or `id` during `update` -> `PERMISSION_DENIED`.
10. Unbounded array injection (`components` with `> 15` items or non-string first element) -> `PERMISSION_DENIED`.
11. Self-promotion attempt (`create` on `/admins/<uid>` by regular signed-in user) -> `PERMISSION_DENIED`.
12. Unauthorized `list` on `/admins` by non-bootstrap user -> `PERMISSION_DENIED`.
