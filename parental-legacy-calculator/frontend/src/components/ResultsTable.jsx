import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

export default function ResultsTable({ results }) {
  return (
    <div className="card fade-in">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-muted)' }}>
          Life Factors Breakdown
        </h3>
        <span
          style={{
            fontSize: '12px',
            fontWeight: '500',
            color: results.dominantParent === 'Mother' ? '#ec4899' : '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {results.dominantParent === 'Mother' ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
          {results.dominantParent}
        </span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Factor</th>
              <th style={{ textAlign: 'right' }}>
                <span style={{ color: '#fbb6ce' }}>Mother</span>
              </th>
              <th style={{ textAlign: 'right' }}>
                <span style={{ color: '#93c5fd' }}>Father</span>
              </th>
              <th style={{ textAlign: 'right' }}>
                <span style={{ color: '#c4b5fd' }}>Total</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {results.factors.map((factor, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                  {factor.name}
                </td>
                <td className="mother-color" style={{ textAlign: 'right' }}>
                  {factor.mother.toFixed(3)}
                </td>
                <td className="father-color" style={{ textAlign: 'right' }}>
                  {factor.father.toFixed(3)}
                </td>
                <td className="total-color" style={{ textAlign: 'right' }}>
                  {factor.total.toFixed(3)}
                </td>
              </tr>
            ))}
            <tr
              style={{
                borderTop: '2px solid var(--border-color)',
                fontWeight: '700',
              }}
            >
              <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>TOTAL</td>
              <td
                className="mother-color"
                style={{ textAlign: 'right', fontWeight: '700' }}
              >
                {results.motherTotal.toFixed(3)}
              </td>
              <td
                className="father-color"
                style={{ textAlign: 'right', fontWeight: '700' }}
              >
                {results.fatherTotal.toFixed(3)}
              </td>
              <td
                className="total-color"
                style={{ textAlign: 'right', fontWeight: '700' }}
              >
                {results.grandTotal.toFixed(3)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
