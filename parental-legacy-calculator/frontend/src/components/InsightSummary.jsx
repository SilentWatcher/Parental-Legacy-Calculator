import { generateInsight } from '../utils/calculations';

export default function InsightSummary({ results }) {
  const insight = generateInsight(results);

  const balanceColor =
    insight.balance === 'Balanced'
      ? '#22c55e'
      : insight.balance === 'Slightly Skewed'
      ? '#f59e0b'
      : '#ef4444';

  return (
    <div className="card fade-in" style={{ marginTop: '20px' }}>
      <h3
        style={{
          fontSize: '15px',
          fontWeight: '600',
          color: 'var(--text-muted)',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        Insight Summary
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Dominant Influence
          </p>
          <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {insight.dominantParent} ({insight.dominantPct}%)
          </p>
        </div>

        <div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Strongest Factor
          </p>
          <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {insight.strongest.name}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {insight.strongest.score.toFixed(3)}
          </p>
        </div>

        <div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Weakest Factor
          </p>
          <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {insight.weakest.name}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {insight.weakest.score.toFixed(3)}
          </p>
        </div>

        <div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Balance
          </p>
          <p style={{ fontSize: '15px', fontWeight: '600', color: balanceColor }}>
            {insight.balance}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {insight.motherPct}% / {insight.fatherPct}%
          </p>
        </div>
      </div>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          padding: '12px',
          background: 'var(--bg-primary)',
          borderRadius: '8px',
          margin: 0,
        }}
      >
        {insight.interpretation}
      </p>
    </div>
  );
}
