import { lazy } from 'react';
import type { ModuleManifest } from '@poc-mf/shell-contracts';

/**
 * THE MANIFEST — the only thing the shell reads from this module at boot time.
 *
 * This file is the complete routing and navigation contract for the Orders module.
 * When the Orders team:
 *   - adds a route    → add an entry to `routes`
 *   - adds a nav item → add an entry to `navigationItems`
 *   - renames a path  → update `path` here
 *
 * In all cases: ZERO changes needed in the shell repository.
 */
export const manifest: ModuleManifest = {
  id: 'orders',
  version: '1.2.0',

  navigationItems: [
    {
      id: 'orders',
      label: 'Orders',
      icon: 'ShoppingCart',
      // This is the canonical URL the user sees — no module prefix, ever.
      path: '/orders',
      // Lower number = higher in the nav. Leave gaps (10, 20, 30) for insertion.
      order: 10,
    },
  ],

  routes: [
    {
      path: '/orders',
      // React.lazy ensures the bundle chunk is only downloaded when the user
      // first navigates to this route — not at boot time.
      component: lazy(() => import('./pages/OrderList')),
    },
    {
      path: '/orders/:id',
      component: lazy(() => import('./pages/OrderDetail')),
    },
  ],
};
