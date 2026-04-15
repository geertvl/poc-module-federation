import type { ComponentType } from 'react';

/**
 * A single item in the shell's navigation menu.
 * Owned and defined entirely by the module — the shell never hard-codes these.
 */
export interface NavItem {
  /** Unique identifier, e.g. "orders" */
  id: string;
  /** Display label shown in the nav, e.g. "Orders" */
  label: string;
  /** Lucide icon name or any string your icon system uses */
  icon?: string;
  /** The canonical URL path this nav item links to, e.g. "/orders" */
  path: string;
  /**
   * Sort order in the global nav. Lower numbers appear first.
   * Use multiples of 10 (10, 20, 30…) to leave room for insertion.
   */
  order: number;
  /** Optional RBAC permission key. Shell will hide this item if the user lacks it. */
  requiredPermission?: string;
  /** Nested nav items for grouped navigation */
  children?: NavItem[];
}

/**
 * A single route that the module owns.
 * The shell registers these dynamically into React Router — it never hard-codes paths.
 */
export interface RouteDefinition {
  /** React Router path pattern, e.g. "/orders/:id" */
  path: string;
  /**
   * The page component to render. Use React.lazy() in the module so the
   * actual bundle chunk is only loaded when the user navigates here.
   */
  component: ComponentType<any>;
  /** Optional RBAC permission key. Shell will render a 403 if the user lacks it. */
  requiredPermission?: string;
}

/**
 * The full contract each module must expose via Module Federation as "./manifest".
 *
 * This is the ONLY thing the shell needs from a module at boot time.
 * Route paths, navigation labels, icons, permissions — all owned here.
 */
export interface ModuleManifest {
  /** Unique module identifier, matches the id in shell-config.json */
  id: string;
  /** Semver version string — useful for diagnostics and debugging */
  version: string;
  /** Nav items this module contributes to the shell's global navigation */
  navigationItems: NavItem[];
  /** All URL routes this module handles */
  routes: RouteDefinition[];
}
