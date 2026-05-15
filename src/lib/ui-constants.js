// lib/ui-constants.js

export const COLORS = {
  primary: '#1a73e8',
  success: '#188038',
  textMain: '#3c4043',
  textSecondary: '#5f6368',
  bgHeader: '#f8f9fa',
  border: '#e0e0e0',
  white: '#ffffff'
};

export const STYLES = {
  tableContainer: {
    background: COLORS.white,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  th: {
    padding: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: COLORS.textMain
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: COLORS.primary,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '10px',
    display: 'block'
  },
  card: {
    width: '250px',
    padding: '40px',
    borderRadius: '15px',
    background: COLORS.white,
    border: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    textAlign: 'center',
    transition: 'transform 0.2s'
  }
};