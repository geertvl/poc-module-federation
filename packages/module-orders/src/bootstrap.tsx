/**
 * Standalone bootstrap — only used when running the orders module on its own
 * (localhost:3001). When loaded by the shell, the shell mounts route components
 * directly; this file is never called.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
