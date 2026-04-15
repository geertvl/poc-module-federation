import type { ModuleManifest, NavItem } from '@poc-mf/shell-contracts';
import shellConfig from './shell-config.json';

export interface ModuleConfig {
  id: string;
  scope: string;
  remoteUrl: string;
  /** When true, the module's script and manifest are not loaded at boot time. */
  lazy?: boolean;
  /**
   * Required when lazy is true. The URL path prefix this module owns (e.g. "/inventory").
   * The shell registers a wildcard route for this prefix and loads the module on first visit.
   */
  basePath?: string;
  /**
   * Nav items to show in the sidebar before the lazy module has been loaded.
   * Required when lazy is true so the shell can build the nav at boot.
   */
  navigationItems?: NavItem[];
}

/**
 * Injects a <script> tag for a remote module's entry bundle.
 * Idempotent — skips if the scope is already initialised on window.
 */
function loadRemoteScript(remoteUrl: string, scope: string): Promise<void> {
  // Already loaded — skip.
  if ((window as unknown as Record<string, unknown>)[scope]) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = remoteUrl;
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error(`Failed to load remote script: ${remoteUrl}`));
    document.head.appendChild(script);
  });
}

/**
 * Loads a single exposed module from a remote container using the low-level
 * Module Federation container API.
 *
 * __webpack_init_sharing__ and __webpack_share_scopes__ are injected by webpack.
 * They ensure both the host (shell) and the remote use the same singleton React instance.
 */
async function loadRemoteModule(
  scope: string,
  exposedModule: string
): Promise<Record<string, unknown>> {
  // Step 1: Initialise the host's shared scope if not done yet.
  await __webpack_init_sharing__('default');

  const container = (window as unknown as Record<string, unknown>)[scope] as {
    init: (scope: Record<string, unknown>) => Promise<void>;
    get: (module: string) => Promise<() => Record<string, unknown>>;
  };

  // Step 2: Share the host's shared scope with the remote container.
  // This is what ensures singleton React — the remote will use the host's copy.
  await container.init(__webpack_share_scopes__.default);

  // Step 3: Get the factory for the exposed module and execute it.
  const factory = await container.get(exposedModule);
  return factory();
}

/**
 * Loads the manifest from a single remote module.
 * Returns null if loading fails — a failed module should not crash the whole shell.
 */
export async function loadModuleManifest(
  config: ModuleConfig
): Promise<ModuleManifest | null> {
  try {
    await loadRemoteScript(config.remoteUrl, config.scope);
    const moduleExports = await loadRemoteModule(config.scope, './manifest');
    const manifest = moduleExports.manifest as ModuleManifest;

    console.log(
      `[ManifestLoader] ✅ Loaded manifest for "${manifest.id}" v${manifest.version}`,
      { routes: manifest.routes.map((r) => r.path), navItems: manifest.navigationItems.map((n) => n.label) }
    );

    return manifest;
  } catch (err) {
    // A failing module must not break the shell — log and continue.
    console.error(
      `[ManifestLoader] ❌ Failed to load manifest for module "${config.id}":`,
      err
    );
    return null;
  }
}

/**
 * Returns module configs that are marked as lazy.
 * These are NOT loaded at boot — they load on first navigation to their basePath.
 */
export function getLazyModuleConfigs(): ModuleConfig[] {
  return (shellConfig.modules as ModuleConfig[]).filter((m) => m.lazy === true);
}

/**
 * Loads manifests for all non-lazy modules in parallel at boot time.
 *
 * Key properties:
 * - Parallel loading (Promise.allSettled) — fast even with many modules.
 * - Fault tolerant — a single failing module does not prevent the rest from loading.
 */
export async function loadEagerManifests(): Promise<ModuleManifest[]> {
  const eagerModules = (shellConfig.modules as ModuleConfig[]).filter(
    (m) => !m.lazy
  );

  console.log(
    `[ManifestLoader] Loading manifests for ${eagerModules.length} eager module(s)…`
  );

  const results = await Promise.allSettled(
    eagerModules.map((m) => loadModuleManifest(m))
  );

  const manifests = results
    .filter(
      (r): r is PromiseFulfilledResult<ModuleManifest | null> =>
        r.status === 'fulfilled'
    )
    .map((r) => r.value)
    .filter((m): m is ModuleManifest => m !== null);

  console.log(
    `[ManifestLoader] Loaded ${manifests.length}/${eagerModules.length} eager manifests successfully.`
  );

  return manifests;
}

/**
 * @deprecated Use loadEagerManifests() instead.
 * Kept for backwards compatibility — loads ALL modules eagerly.
 */
export async function loadAllManifests(): Promise<ModuleManifest[]> {
  const allModules = shellConfig.modules as ModuleConfig[];

  console.log(
    `[ManifestLoader] Loading manifests for ${allModules.length} module(s)…`
  );

  const results = await Promise.allSettled(
    allModules.map((m) => loadModuleManifest(m))
  );

  const manifests = results
    .filter(
      (r): r is PromiseFulfilledResult<ModuleManifest | null> =>
        r.status === 'fulfilled'
    )
    .map((r) => r.value)
    .filter((m): m is ModuleManifest => m !== null);

  console.log(
    `[ManifestLoader] Loaded ${manifests.length}/${allModules.length} manifests successfully.`
  );

  return manifests;
}
