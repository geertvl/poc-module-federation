import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function InventoryDetail() {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.moduleBanner}>
        📦 Rendered by: <strong>module-inventory</strong> v0.8.0
        &nbsp;·&nbsp; Route <code>/inventory/:sku</code> registered via manifest
      </div>

      <button style={styles.back} onClick={() => navigate('/inventory')}>
        ← Back to inventory
      </button>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h1 style={styles.title}>{sku}</h1>
            <p style={{ color: '#6b7280', fontSize: 14 }}>Widget B — Components</p>
          </div>
          <span style={styles.badge}>Low stock</span>
        </div>

        <div style={styles.statsGrid}>
          {[
            { label: 'Current stock', value: '18', color: '#d97706' },
            { label: 'Reorder point', value: '50', color: '#374151' },
            { label: 'Avg monthly demand', value: '120', color: '#374151' },
            { label: 'Days until stockout', value: '~4', color: '#dc2626' },
          ].map(stat => (
            <div key={stat.label} style={styles.statCard}>
              <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <h3 style={styles.sectionTitle}>Recent movements</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Date', 'Type', 'Qty', 'Reference', 'Balance'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2026-04-14', type: 'Sale', qty: '-5', ref: 'ORD-002', balance: '18' },
                { date: '2026-04-12', type: 'Sale', qty: '-3', ref: 'ORD-001', balance: '23' },
                { date: '2026-04-10', type: 'Receipt', qty: '+50', ref: 'PO-448', balance: '26' },
                { date: '2026-04-08', type: 'Sale', qty: '-24', ref: 'ORD-099', balance: '-24' },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ ...styles.td, color: '#6b7280' }}>{row.date}</td>
                  <td style={styles.td}>
                    <span style={{
                      fontWeight: 600,
                      color: row.type === 'Receipt' ? '#065f46' : '#374151',
                    }}>{row.type}</span>
                  </td>
                  <td style={{
                    ...styles.td,
                    fontWeight: 700,
                    color: row.qty.startsWith('-') ? '#dc2626' : '#059669',
                    fontFamily: 'monospace',
                  }}>{row.qty}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 12, color: '#1a6fff' }}>{row.ref}</td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  back: {
    background: 'none',
    border: 'none',
    color: '#059669',
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
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottom: '1px solid #f3f4f6',
  },
  title: { fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 4 },
  badge: {
    background: '#fef3c7',
    color: '#92400e',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  statCard: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '16px 20px',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 12,
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
