import React from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_ORDERS = [
  { id: 'ORD-001', customer: 'Acme Corp', status: 'Shipped', total: '€1,240.00', date: '2026-04-12' },
  { id: 'ORD-002', customer: 'Globex Inc', status: 'Processing', total: '€380.50', date: '2026-04-13' },
  { id: 'ORD-003', customer: 'Initech', status: 'Pending', total: '€2,100.00', date: '2026-04-14' },
  { id: 'ORD-004', customer: 'Umbrella LLC', status: 'Delivered', total: '€670.00', date: '2026-04-10' },
  { id: 'ORD-005', customer: 'Cyberdyne', status: 'Cancelled', total: '€440.00', date: '2026-04-09' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Shipped:    { bg: '#dbeafe', text: '#1e40af' },
  Processing: { bg: '#fef3c7', text: '#92400e' },
  Pending:    { bg: '#f3f4f6', text: '#374151' },
  Delivered:  { bg: '#d1fae5', text: '#065f46' },
  Cancelled:  { bg: '#fee2e2', text: '#991b1b' },
};

export default function OrderList() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Module identity banner — visible in POC to confirm which module rendered */}
      <div style={styles.moduleBanner}>
        🛒 Rendered by: <strong>module-orders</strong> v1.2.0
        &nbsp;·&nbsp; Route registered via manifest, not hard-coded in shell
      </div>

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>{MOCK_ORDERS.length} orders found</p>
        </div>
        <button style={styles.button}>+ New order</button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Order ID', 'Customer', 'Date', 'Status', 'Total', ''].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map((order, i) => {
              const statusStyle = STATUS_COLORS[order.status] ?? STATUS_COLORS['Pending'];
              return (
                <tr key={order.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={styles.td}>
                    <span style={styles.orderId}>{order.id}</span>
                  </td>
                  <td style={styles.td}>{order.customer}</td>
                  <td style={{ ...styles.td, color: '#6b7280' }}>{order.date}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: statusStyle.bg, color: statusStyle.text }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{order.total}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.linkButton}
                      onClick={() => navigate(`/orders/${order.id}`)}
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
    background: '#1a6fff',
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
  orderId: { fontFamily: 'monospace', fontWeight: 600, color: '#1a6fff' },
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
    color: '#1a6fff',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    padding: 0,
  },
};
