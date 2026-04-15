import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { ModuleManifest } from '@poc-mf/shell-contracts';
import { loadModuleManifest, type ModuleConfig } from './manifest-loader';

interface Props {
  config: ModuleConfig;
}

/**
 * Renders a module's routes lazily — the remote script and manifest are only
 * fetched when the user first navigates to this module's basePath.
 *
 * While loading: shows a spinner.
 * On error: shows an error message (does not crash the shell).
 * Once loaded: renders the module's routes as nested <Routes>.
 */
export function LazyModuleRoutes({ config }: Props) {
  const [manifest, setManifest] = useState<ModuleManifest | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    loadModuleManifest(config).then((m) => {
      if (m) setManifest(m);
      else setFailed(true);
    });
  // config.id is stable for the lifetime of this component instance
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.id]);

  if (failed) {
    return (
      <div style={errorStyles.wrapper}>
        <p style={errorStyles.title}>Failed to load module "{config.id}"</p>
        <p style={errorStyles.sub}>Check the browser console for details.</p>
      </div>
    );
  }

  if (!manifest) {
    return <ModuleLoader />;
  }

  const basePath = config.basePath ?? '';

  return (
    <Suspense fallback={<ModuleLoader />}>
      <Routes>
        {manifest.routes.map((route) => {
          // Convert absolute paths to relative ones for the nested <Routes>.
          // e.g. "/inventory/:id" with basePath "/inventory" → ":id"
          //      "/inventory"     with basePath "/inventory" → index route
          const relative = route.path.startsWith(basePath)
            ? route.path.slice(basePath.length).replace(/^\//, '')
            : route.path;

          return (
            <Route
              key={route.path}
              {...(relative ? { path: relative } : { index: true })}
              element={<route.component />}
            />
          );
        })}
      </Routes>
    </Suspense>
  );
}

function ModuleLoader() {
  return (
    <div style={loaderStyles.wrapper}>
      <div style={loaderStyles.spinner} />
      <p style={{ color: '#6b7280', marginTop: 12 }}>Loading module…</p>
    </div>
  );
}

const loaderStyles: Record<string, React.CSSProperties> = {
  wrapper: {
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

const errorStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: 300,
  },
  title: { fontSize: 18, color: '#dc2626', margin: 0 },
  sub: { color: '#6b7280', marginTop: 8 },
};
