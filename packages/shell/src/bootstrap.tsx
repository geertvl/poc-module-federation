import React from 'react';
import ReactDOM from 'react-dom/client';
import type { NavItem, RouteDefinition } from '@poc-mf/shell-contracts';
import { loadEagerManifests, getLazyModuleConfigs } from './manifest-loader';
import { ShellApp } from './ShellApp';

async function bootstrap() {
  const lazyConfigs = getLazyModuleConfigs();

  // 1. Load manifests only for non-lazy modules at boot time.
  //    Lazy modules will be fetched on first navigation to their basePath.
  const manifests = await loadEagerManifests();

  // 2. Aggregate routes from eager modules.
  const allRoutes: RouteDefinition[] = manifests.flatMap((m) => m.routes);

  // 3. Aggregate nav items from eager manifests + static nav items declared
  //    in shell-config.json for lazy modules, then sort by order.
  const allNavItems: NavItem[] = [
    ...manifests.flatMap((m) => m.navigationItems),
    ...lazyConfigs.flatMap((c) => c.navigationItems ?? []),
  ].sort((a, b) => a.order - b.order);

  // 4. Mount the shell. Lazy module configs are forwarded so ShellApp can
  //    register wildcard routes that trigger on-demand loading.
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ShellApp
        routes={allRoutes}
        navItems={allNavItems}
        lazyModuleConfigs={lazyConfigs}
      />
    </React.StrictMode>
  );
}

bootstrap().catch((err) => {
  console.error('Shell bootstrap failed:', err);
  document.getElementById('root')!.innerHTML = `
    <div style="padding:40px;font-family:sans-serif;color:#dc2626;">
      <h2>Shell failed to start</h2>
      <p style="margin-top:8px;color:#6b7280;">Check the browser console for details.</p>
    </div>
  `;
});
