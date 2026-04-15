/**
 * IMPORTANT: This file must only contain a dynamic import.
 *
 * Module Federation requires that shared modules (React, react-router-dom, etc.)
 * are negotiated BEFORE any code that uses them runs. If you import React here
 * directly, the shared scope hasn't been initialised yet and you'll get multiple
 * React instances or runtime errors.
 *
 * The async import here gives webpack time to initialise the shared scope first,
 * then bootstrap.tsx takes over with full React access.
 */
import('./bootstrap');
