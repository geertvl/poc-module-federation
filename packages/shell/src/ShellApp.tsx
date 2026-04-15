import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { NavItem, RouteDefinition } from '@poc-mf/shell-contracts';
import { Navigation } from './components/Navigation';
import { LazyModuleRoutes } from './LazyModuleRoutes';
import type { ModuleConfig } from './manifest-loader';

interface ShellAppProps {
  routes: RouteDefinition[];
  navItems: NavItem[];
  lazyModuleConfigs: ModuleConfig[];
}

/**
 * Root shell component.
 *
 * Receives routes and navItems already aggregated from eager module manifests.
 * Lazy modules are represented by wildcard routes that trigger on-demand loading
 * when the user first navigates to their basePath.
 */
export function ShellApp({ routes, navItems, lazyModuleConfigs }: ShellAppProps) {
  return (
    <BrowserRouter>
      <div style={styles.layout}>
        {/* Shell-owned navigation — built entirely from manifest data */}
        <Navigation items={navItems} />

        {/* Main content area — routes registered dynamically from manifests */}
        <main style={styles.main}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Default redirect to the first nav item's path */}
              {navItems.length > 0 && (
                <Route
                  path="/"
                  element={<Navigate to={navItems[0].path} replace />}
                />
              )}

              {/* Eager routes — components already available at boot */}
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                />
              ))}

              {/* Lazy module routes — script + manifest fetched on first visit */}
              {lazyModuleConfigs.map((config) => (
                <Route
                  key={config.id}
                  path={`${config.basePath}/*`}
                  element={<LazyModuleRoutes config={config} />}
                />
              ))}

              {/* Fallback 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

function PageLoader() {
  return (
    <div style={styles.pageLoader}>
      <div style={styles.spinner} />
      <p style={{ color: '#6b7280', marginTop: 12 }}>Loading…</p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={styles.pageLoader}>
      <h2 style={{ fontSize: 24, color: '#374151' }}>404 — Page not found</h2>
      <p style={{ color: '#6b7280', marginTop: 8 }}>
        This route is not registered by any module.
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#f9fafb',
  },
  pageLoader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: 300,
  },
  spinner: {
    width: 36,
    height: 36,
    border: '3px solid #e5e7eb',
    borderTopColor: '#1a6fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
};
