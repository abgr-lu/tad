"use client";
import { STYLES, COLORS } from '@/lib/ui-constants';

export default function DataTable({ columns, data, renderRow, loading, emptyMessage = "No data found." }) {
  return (
    <div style={STYLES.tableContainer}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: COLORS.bgHeader, borderBottom: `2px solid ${COLORS.border}` }}>
            {columns.map((col, index) => (
              <th key={index} style={STYLES.th}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '40px', textAlign: 'center', color: COLORS.textSecondary }}>
                ⏳ Loading data...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ padding: '40px', textAlign: 'center', color: COLORS.textSecondary }}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}