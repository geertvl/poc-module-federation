import React from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_ITEMS = [
  { sku: 'WGT-A-100', name: 'Widget A', category: 'Components', stock: 342, reorder: 50, status: 'In stock' },
  { sku: 'WGT-B-200', name: 'Widget B', category: 'Components', stock: 18, reorder: 50, status: 'Low stock' },
  { sku: 'GDP-PRO-1', name: 'Gadget Pro', category: 'Products', stock: 0, reorder: 20, status: 'Out of stock' },
  { sku: 'GDP-LT-2', name: 'Gadget Lite', category: 'Products', stock: 95, reorder: 20, status: 'In stock' },
  { sku: 'PKG-STD', name: 'Standard Packaging', category: 'Packaging', stock: 1200, reorder: 200, status: 'In stock' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'In stock':    { bg: '#d1fae5', text: '#065f46' },
  'Low stock':   { bg: '#fef3c7', text: '#92400e' },
  'Out of stock':{ bg: '#fee2e2', text: '#991b1b' },
};

export default function InventoryList() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.moduleBanner}>
        📦 Rendered by: <strong>module-inventory</strong> v0.8.0
        &nbsp;·&nbsp; Route registered via manifest, not hard-coded in shell
      </div>

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Inventory</h1>
          <p style={styles.subtitle}>{MOCK_ITEMS.length} SKUs tracked</p>
        </div>
        <button style={styles.button}>+ Add item</button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['SKU', 'Name', 'Category', 'Stock', 'Reorder point', 'Status', ''].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_ITEMS.map((item, i) => {
              const sc = STATUS_COLORS[item.status] ?? STATUS_COLORS['In stock'];
              return (
                <tr key={item.sku} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={styles.td}>
                    <span style={styles.sku}>{item.sku}</span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: 500 }}>{item.name}</td>
                  <td style={{ ...styles.td, color: '#6b7280' }}>{item.category}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: item.stock === 0 ? '#dc2626' : '#111827' }}>
                    {item.stock}
                  </td>
                  <td style={{ ...styles.td, color: '#6b7280' }}>{item.reorder}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: sc.bg, color: sc.text }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.linkButton}
                      onClick={() => navigate(`/inventory/${item.sku}`)}
                    >
                      View →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: 32 },
  moduleBanner: {
    background: '#f5f3ff',
    border: '1px solid #ede9fe',
    borderRadius: 6,
    padding: '8px 14px',
    fontSize: 12,
    color: '#7c3aed',
    marginBottom: 24,
    fontFamily: 'monospace',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: { fontSize: 22, fontWeight: 700, color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  button: {
    background: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  tableWrapper: {
    background: 'white',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: {
    padding: '10px 16px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  },
  td: { padding: '12px 16px', borderBottom: '1px solid #f3f4f6', color: '#374151' },
  sku: { fontFamily: 'monospace', fontWeight: 600, color: '#059669', fontSize: 12 },
  badge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#059669',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    padding: 0,
  },
};
