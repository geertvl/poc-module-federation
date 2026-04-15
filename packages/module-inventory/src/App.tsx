import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { manifest } from './manifest';

export function App() {
  return (
    <div>
      <div style={styles.standaloneBar}>
        📦 Inventory Module — standalone dev mode (localhost:3002)
      </div>
      <Suspense fallback={<div style={styles.loading}>Loading…</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          {manifest.routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </Suspense>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  standaloneBar: {
    background: '#7c3aed',
    color: 'white',
    padding: '8px 16px',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  loading: { padding: 40, textAlign: 'center', color: '#6b7280' },
};
