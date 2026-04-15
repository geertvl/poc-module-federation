import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.moduleBanner}>
        🛒 Rendered by: <strong>module-orders</strong> v1.2.0
        &nbsp;·&nbsp; Route <code>/orders/:id</code> registered via manifest
      </div>

      <button style={styles.back} onClick={() => navigate('/orders')}>
        ← Back to orders
      </button>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h1 style={styles.title}>{id}</h1>
            <span style={styles.badge}>Processing</span>
          </div>
          <div style={styles.actions}>
            <button style={styles.secondaryBtn}>Edit</button>
            <button style={styles.primaryBtn}>Mark as shipped</button>
          </div>
        </div>

        <div style={styles.grid}>
          <Section title="Customer">
            <Field label="Company" value="Globex Inc" />
            <Field label="Contact" value="Homer Simpson" />
            <Field label="Email" value="homer@globex.com" />
          </Section>

          <Section title="Order details">
            <Field label="Order date" value="2026-04-13" />
            <Field label="Total" value="€380.50" />
            <Field label="Payment" value="Invoice NET 30" />
          </Section>

          <Section title="Shipping">
            <Field label="Address" value="742 Evergreen Terrace, Springfield" />
            <Field label="Method" value="Standard" />
            <Field label="Estimated" value="2026-04-18" />
          </Section>
        </div>

        <Section title="Line items">
          <table style={styles.table}>
            <thead>
              <tr>
                {['Product', 'Qty', 'Unit price', 'Subtotal'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { product: 'Widget A', qty: 2, price: '€95.00', sub: '€190.00' },
                { product: 'Gadget Pro', qty: 1, price: '€190.50', sub: '€190.50' },
              ].map(item => (
                <tr key={item.product}>
                  <td style={styles.td}>{item.product}</td>
                  <td style={styles.td}>{item.qty}</td>
                  <td style={styles.td}>{item.price}</td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{item.sub}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 14 }}>
      <span style={{ color: '#9ca3af', minWidth: 100 }}>{label}</span>
      <span style={{ color: '#111827', fontWeight: 500 }}>{value}</span>
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
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  back: {
    background: 'none',
    border: 'none',
    color: '#1a6fff',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    padding: 0,
    marginBottom: 20,
    display: 'block',
  },
  card: {
    background: 'white',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    padding: 24,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottom: '1px solid #f3f4f6',
  },
  title: { fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 6 },
  badge: {
    background: '#fef3c7',
    color: '#92400e',
    padding: '2px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  actions: { display: 'flex', gap: 10 },
  secondaryBtn: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: '7px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#374151',
  },
  primaryBtn: {
    background: '#1a6fff',
    border: 'none',
    borderRadius: 6,
    padding: '7px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    color: 'white',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 24,
    marginBottom: 24,
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: {
    padding: '8px 12px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  },
  td: { padding: '10px 12px', borderBottom: '1px solid #f3f4f6', color: '#374151' },
};
