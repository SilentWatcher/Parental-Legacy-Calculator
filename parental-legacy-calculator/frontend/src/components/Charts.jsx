import { forwardRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const COLORS = {
  mother: '#ec4899',
  father: '#3b82f6',
  total: '#8b5cf6',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: 'var(--shadow)',
        }}
      >
        <p style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)' }}>
          {label}
        </p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: '13px' }}>
            {p.name}: {p.value.toFixed(3)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Charts = forwardRef(function Charts({ results }, ref) {
  const barData = results.factors.map((f) => ({
    name: f.name.length > 15 ? f.name.substring(0, 12) + '...' : f.name,
    fullName: f.name,
    Mother: f.mother,
    Father: f.father,
  }));

  const pieDataMother = results.factors.map((f) => ({
    name: f.name,
    value: f.mother,
  }));

  const pieDataFather = results.factors.map((f) => ({
    name: f.name,
    value: f.father,
  }));

  const radarData = results.factors.map((f) => ({
    factor: f.name.split(' ')[0],
    Mother: f.mother,
    Father: f.father,
  }));

  const pieColors = [
    '#ec4899',
    '#f472b6',
    '#f9a8d4',
    '#fbcfe8',
    '#fce7f3',
    '#fdf2f8',
    '#ff69b4',
  ];

  const pieColorsFather = [
    '#3b82f6',
    '#60a5fa',
    '#93c5fd',
    '#bfdbfe',
    '#dbeafe',
    '#eff6ff',
    '#2563eb',
  ];

  return (
    <div
      ref={ref}
      data-charts-container
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '20px',
      }}
    >
      <div className="card fade-in">
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--text-primary)',
          }}
        >
          Mother vs Father Comparison
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={barData} margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Mother" fill={COLORS.mother} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Father" fill={COLORS.father} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card fade-in">
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--text-primary)',
          }}
        >
          Legacy Distribution - Radar View
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="var(--border-color)" />
            <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <PolarRadiusAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <Radar name="Mother" dataKey="Mother" stroke={COLORS.mother} fill={COLORS.mother} fillOpacity={0.3} />
            <Radar name="Father" dataKey="Father" stroke={COLORS.father} fill={COLORS.father} fillOpacity={0.3} />
            <Legend />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="card fade-in">
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--text-primary)',
          }}
        >
          Mother's Legacy Share
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieDataMother}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) =>
                `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={{ stroke: 'var(--text-muted)' }}
            >
              {pieDataMother.map((_, i) => (
                <Cell key={i} fill={pieColors[i % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="card fade-in">
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--text-primary)',
          }}
        >
          Father's Legacy Share
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieDataFather}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) =>
                `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={{ stroke: 'var(--text-muted)' }}
            >
              {pieDataFather.map((_, i) => (
                <Cell key={i} fill={pieColorsFather[i % pieColorsFather.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default Charts;
