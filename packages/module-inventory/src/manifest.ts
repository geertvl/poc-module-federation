import { lazy } from 'react';
import type { ModuleManifest } from '@poc-mf/shell-contracts';

/**
 * Inventory module manifest.
 *
 * POC DEMO POINT: This module adds its own routes and nav items here.
 * The shell discovers them automatically — no shell changes needed.
 *
 * To prove the concept live:
 *   1. Add a new route to this array (e.g. /inventory/reports)
 *   2. Save and wait for hot-reload of this module
 *   3. Reload the shell — the new route is available, no shell code changed
 */
export const manifest: ModuleManifest = {
  id: 'inventory',
  version: '0.8.0',

  navigationItems: [
    {
      id: 'inventory',
      label: 'Inventory',
      icon: 'Package',
      path: '/inventory',
      order: 20,
    },
  ],

  routes: [
    {
      path: '/inventory',
      component: lazy(() => import('./pages/InventoryList')),
    },
    {
      path: '/inventory/:sku',
      component: lazy(() => import('./pages/InventoryDetail')),
    },
  ],
};
