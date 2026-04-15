import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { NavItem } from '@poc-mf/shell-contracts';

// Simple icon map — replace with your actual icon library
const ICONS: Record<string, string> = {
  ShoppingCart: '🛒',
  Package: '📦',
  Home: '🏠',
  Settings: '⚙️',
  Users: '👥',
  BarChart: '📊',
};

interface NavigationProps {
  items: NavItem[];
}

/**
 * Shell navigation component.
 *
 * Renders entirely from the aggregated navItems array built from module manifests.
 * The shell team never touches this file when a module adds a new nav item —
 * they simply update their own manifest.
 */
export function Navigation({ items }: NavigationProps) {
  const location = useLocation();

  return (
    <nav style={styles.nav}>
      {/* Shell brand / logo — owned by the shell */}
      <div style={styles.brand}>
        <span style={styles.brandIcon}>⬡</span>
        <span style={styles.brandName}>Shell POC</span>
      </div>

      {/* Nav items — 100% driven by manifests, zero hard-coding */}
      <ul style={styles.list}>
        {items.map((item) => (
          <NavItem key={item.id} item={item} currentPath={location.pathname} />
        ))}
      </ul>

      {/* Footer info — shows loaded modules for demo purposes */}
      <div style={styles.footer}>
        <span style={styles.footerLabel}>
          {items.length} nav item{items.length !== 1 ? 's' : ''} from manifests
        </span>
      </div>
    </nav>
  );
}

function NavItem({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const isActive =
    currentPath === item.path ||
    (item.path !== '/' && currentPath.startsWith(item.path));

  const icon = item.icon ? ICONS[item.icon] || '•' : '•';

  return (
    <li>
      <NavLink
        to={item.path}
        style={({ isActive: routerActive }) => ({
          ...styles.navLink,
          ...(isActive || routerActive ? styles.navLinkActive : {}),
        })}
      >
        <span style={styles.navIcon}>{icon}</span>
        <span>{item.label}</span>
        {(isActive) && <span style={styles.activeDot} />}
      </NavLink>

      {/* Nested children */}
      {item.children && item.children.length > 0 && isActive && (
        <ul style={styles.subList}>
          {item.children.map((child) => (
            <li key={child.id}>
              <NavLink
                to={child.path}
                style={({ isActive }) => ({
                  ...styles.subLink,
                  ...(isActive ? styles.subLinkActive : {}),
                })}
              >
                {child.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    width: 220,
    minWidth: 220,
    backgroundColor: '#111827',
    color: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '20px 16px 16px',
    borderBottom: '1px solid #1f2937',
  },
  brandIcon: {
    fontSize: 22,
    color: '#1a6fff',
  },
  brandName: {
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.01em',
  },
  list: {
    listStyle: 'none',
    padding: '10px 0',
    flex: 1,
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 16px',
    textDecoration: 'none',
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 6,
    margin: '1px 8px',
    transition: 'background 0.1s, color 0.1s',
    position: 'relative',
  },
  navLinkActive: {
    color: '#f9fafb',
    backgroundColor: '#1f2937',
  },
  navIcon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  activeDot: {
    marginLeft: 'auto',
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#1a6fff',
  },
  subList: {
    listStyle: 'none',
    padding: '2px 0 4px 44px',
  },
  subLink: {
    display: 'block',
    padding: '6px 8px',
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: 13,
    borderRadius: 4,
  },
  subLinkActive: {
    color: '#d1d5db',
    backgroundColor: '#1f2937',
  },
  footer: {
    padding: '12px 16px',
    borderTop: '1px solid #1f2937',
  },
  footerLabel: {
    fontSize: 11,
    color: '#4b5563',
    fontFamily: 'monospace',
  },
};
