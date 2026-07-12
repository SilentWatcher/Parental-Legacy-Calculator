import { FiUsers, FiHeart, FiStar } from 'react-icons/fi';

export default function SummaryCards({ results }) {
  const cards = [
    {
      title: "Mother's Total",
      value: results.motherTotal.toFixed(3),
      icon: <FiHeart />,
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.1)',
    },
    {
      title: "Father's Total",
      value: results.fatherTotal.toFixed(3),
      icon: <FiUsers />,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)',
    },
    {
      title: 'Grand Total',
      value: results.grandTotal.toFixed(3),
      icon: <FiStar />,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.1)',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {cards.map((card, i) => (
        <div
          key={i}
          className="fade-in"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow)',
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: card.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              color: card.color,
              flexShrink: 0,
            }}
          >
            {card.icon}
          </div>
          <div>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {card.title}
            </p>
            <p
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: card.color,
              }}
            >
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
