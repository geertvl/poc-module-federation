# POC: Manifest-driven Module Federation

Proof of concept for ADR-001 — Dynamic Navigation in the Module Federation Shell.

## What this demonstrates

- The **shell** has zero hard-coded routes or navigation labels.
- Each **module** exposes a `./manifest` via Module Federation containing its own routes and nav items.
- The shell loads all manifests at boot time and builds the router + navigation dynamically.
- Adding a route in a module **never requires a change in the shell repository**.

## Architecture at a glance

```
packages/
├── shell-contracts/      ← Shared TypeScript interface (ModuleManifest, NavItem, RouteDefinition)
├── shell/                ← Host app  — port 3000
│   ├── shell-config.json ← ONLY place shell "knows" about modules (URL + scope, no routes)
│   └── src/
│       ├── manifest-loader.ts  ← Loads manifests in parallel at boot
│       ├── bootstrap.tsx       ← Aggregates routes + nav, mounts ShellApp
│       └── ShellApp.tsx        ← Registers routes dynamically via React Router
├── module-orders/        ← Remote module — port 3001
│   └── src/manifest.ts   ← Owns /orders and /orders/:id routes + nav item
└── module-inventory/     ← Remote module — port 3002
    └── src/manifest.ts   ← Owns /inventory and /inventory/:sku routes + nav item
```

## Prerequisites

- Node.js 18+
- npm 7+ (workspaces support)

## Running the POC

```bash
# 1. Install all dependencies (run once from the root)
npm install

# 2. Start all three dev servers in parallel
npm run dev
```

This starts:
- **Shell** → http://localhost:3000 ← open this in your browser
- **Orders module** → http://localhost:3001 (also works standalone)
- **Inventory module** → http://localhost:3002 (also works standalone)

> The modules must be running before the shell starts, because the shell fetches
> `remoteEntry.js` from each module at boot time.

## What to look for in the browser

1. Open http://localhost:3000 — the shell loads and discovers both modules.
2. The **navigation sidebar** shows "Orders" and "Inventory" — these labels come from the module manifests, not from the shell.
3. Navigate between pages — the **URL stays clean** (e.g. `/orders/ORD-002`). No module prefix is visible.
4. Each page shows a purple banner confirming **which module rendered it**.
5. Open the **browser DevTools console** — you'll see manifest loading logs from `[ManifestLoader]`.

## The key demo: adding a route with no shell changes

To prove the concept to the team:

**Step 1** — In `packages/module-inventory/src/manifest.ts`, add a new route:
```typescript
routes: [
  { path: '/inventory',           component: lazy(() => import('./pages/InventoryList')) },
  { path: '/inventory/:sku',      component: lazy(() => import('./pages/InventoryDetail')) },
  // ADD THIS:
  { path: '/inventory/reports',   component: lazy(() => import('./pages/InventoryReports')) },
],
```

Also add a nav item:
```typescript
navigationItems: [
  { id: 'inventory', label: 'Inventory', icon: 'Package', path: '/inventory', order: 20 },
  // ADD THIS:
  { id: 'inventory-reports', label: 'Reports', icon: 'BarChart', path: '/inventory/reports', order: 21 },
],
```

**Step 2** — Create the page component `packages/module-inventory/src/pages/InventoryReports.tsx`.

**Step 3** — Reload the shell (http://localhost:3000).

Result: "Reports" appears in the navigation and `/inventory/reports` works — **without touching a single file in the `shell` package**.

## Module Federation key files

| File | What it does |
|------|-------------|
| `shell/src/shell-config.json` | Only shell config: module ID, remote URL, scope. No routes. |
| `shell/src/manifest-loader.ts` | Dynamically loads `remoteEntry.js` + imports `./manifest` from each module |
| `shell/src/bootstrap.tsx` | Aggregates manifests, passes routes + navItems to ShellApp |
| `shell/src/ShellApp.tsx` | Creates `<Routes>` from aggregated routes. Never references module names. |
| `module-*/src/manifest.ts` | Each module's routing contract — the source of truth for its routes and nav |
| `shell-contracts/src/index.ts` | The shared TypeScript interface that ties everything together |

## Running a module standalone

Each module can run independently (useful for development by the module team):

```bash
# Orders module only
cd packages/module-orders && npm run dev
# → http://localhost:3001
```

The module renders with a purple "standalone dev mode" banner so it's clear this is
not the shell context.

## Adding a new module (production workflow)

1. Create a new package following the same structure as `module-orders` or `module-inventory`.
2. Add one entry to `shell/src/shell-config.json`:
   ```json
   { "id": "my-module", "scope": "myModule", "remoteUrl": "https://my-module.example.com/remoteEntry.js" }
   ```
3. That's it. No other shell changes needed.
