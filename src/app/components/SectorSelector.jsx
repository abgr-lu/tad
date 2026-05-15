// components/SectorSelector.jsx
import { STYLES } from '@/lib/ui-constants';

export default function SectorSelector({ title, subtitle, onSelect }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1 style={{ color: '#202124', marginBottom: '10px' }}>{title}</h1>
      <p style={{ color: '#5f6368' }}>{subtitle}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
        <div style={STYLES.card} onClick={() => onSelect('tankers')}>
          <h3 style={{ margin: 0 }}>TANKERS</h3>
        </div>
        <div style={STYLES.card} onClick={() => onSelect('db')}>
          <h3 style={{ margin: 0 }}>DRY BULK (DB)</h3>
        </div>
      </div>
    </div>
  );
}