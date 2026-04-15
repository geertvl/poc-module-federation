/**
 * Type declarations for webpack Module Federation runtime globals.
 * These functions are injected by webpack at build time.
 */
declare function __webpack_init_sharing__(scope: string): Promise<void>;
declare const __webpack_share_scopes__: {
  default: Record<string, unknown>;
};
