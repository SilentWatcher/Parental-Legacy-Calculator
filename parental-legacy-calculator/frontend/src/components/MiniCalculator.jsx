import { useState, useMemo, useEffect, useRef } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { calculateLifeFactors } from '../utils/calculations';
import { useTheme } from '../context/ThemeContext';
import { FiCalendar, FiHeart, FiShield, FiStar, FiTrendingUp, FiZap, FiSun, FiMoon, FiRefreshCw } from 'react-icons/fi';

const COLORS = {
  bg: 'var(--bg-primary)',
  card: 'var(--bg-card)',
  cardLight: 'var(--bg-card-inner)',
  primary: '#7C3AED',
  secondary: '#A855F7',
  accent: '#EC4899',
  indigo: '#4F46E5',
  text: 'var(--text-primary)',
  muted: 'var(--text-muted)',
  mother: '#EC4899',
  father: '#6366F1',
  total: '#A855F7',
};

const FACTOR_ICONS = [FiZap, FiHeart, FiSun, FiTrendingUp, FiMoon, FiStar, FiShield];

function AnimatedNumber({ value, decimals = 2, duration = 600 }) {
  const [display, setDisplay] = useState('0.00');
  const ref = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = value;
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setDisplay(current.toFixed(decimals));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    }
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value, decimals, duration]);

  return <span>{display}</span>;
}

export default function MiniCalculator() {
  const [date, setDate] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: { main: COLORS.primary },
      background: { default: 'transparent', paper: isDark ? '#1B1137' : '#ffffff' },
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      fontSize: 14,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '14px',
              fontSize: '14px',
              height: '48px',
              backgroundColor: isDark ? 'rgba(27, 17, 55, 0.6)' : 'rgba(255, 255, 255, 0.9)',
              color: isDark ? '#FFFFFF' : '#1a202c',
              '& fieldset': { borderColor: isDark ? 'rgba(124, 58, 237, 0.2)' : 'rgba(203, 213, 225, 0.6)' },
              '&:hover fieldset': { borderColor: COLORS.primary },
              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 2 },
              '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)' },
            },
            '& .MuiInputLabel-root': { color: isDark ? '#A8A4C3' : '#718096', fontSize: '14px' },
            '& .MuiInputLabel-root.Mui-focused': { color: COLORS.primary },
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: { borderRadius: '10px', color: isDark ? COLORS.text : '#1a202c', fontSize: '13px' },
          daySelected: { background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})` },
          '&.Mui-selected': { background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})` },
        },
      },
    },
  }), [isDark]);

  const handleCalculate = () => {
    if (!date) { setError('Select a date'); return; }
    if (date.isAfter(dayjs(), 'day')) { setError('Date cannot be future'); return; }
    setError('');
    const r = calculateLifeFactors(date.format('DD/MM/YYYY'));
    setResults(r);
  };

  const handleRecalculate = () => {
    setResults(null);
    setDate(null);
    setError('');
  };

  const motherPct = results ? ((results.motherTotal / results.grandTotal) * 100).toFixed(1) : 0;
  const fatherPct = results ? ((results.fatherTotal / results.grandTotal) * 100).toFixed(1) : 0;
  const maxFactor = results ? Math.max(...results.factors.map(f => f.total)) : 1;

  return (
    <>
      <style>{`
        @keyframes miniGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.1); }
          50% { box-shadow: 0 0 30px rgba(124, 58, 237, 0.2); }
        }
        @keyframes miniBarFill {
          from { width: 0%; }
        }
        @keyframes miniPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .mini-stat-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .mini-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-hover);
        }
        .mini-btn {
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .mini-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(124, 58, 237, 0.4);
        }
        .mini-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .mini-bar-track {
          position: relative;
          height: 8px;
          border-radius: 4px;
          background: var(--border-color);
          overflow: hidden;
        }
        .mini-bar-fill {
          height: 100%;
          border-radius: 4px;
          animation: miniBarFill 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      <div style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(236, 72, 153, 0.2))',
            marginBottom: '12px',
            border: '1px solid rgba(124, 58, 237, 0.3)',
          }}>
            <FiZap size={22} color={COLORS.primary} />
          </div>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : '#1a202c',
            marginBottom: '6px',
            lineHeight: 1.3,
          }}>
            Quick Score Check
          </h2>
          <p style={{
            fontSize: '13px',
            color: isDark ? COLORS.muted : '#718096',
            lineHeight: 1.5,
          }}>
            {results ? 'Here are your results' : 'Enter your birth date to instantly calculate your parental energy balance.'}
          </p>
        </div>

        {/* Date Input */}
        <div style={{ marginBottom: '16px' }}>
          <ThemeProvider theme={muiTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                value={date}
                onChange={(v) => { setDate(v); setError(''); }}
                maxDate={dayjs()}
                disabled={!!results}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error,
                    helperText: error,
                  },
                }}
              />
            </LocalizationProvider>
          </ThemeProvider>
        </div>

        {/* Quick Check Button (before results) */}
        {!results && (
          <button
            onClick={handleCalculate}
            disabled={!date}
            className="mini-btn"
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: date ? 'pointer' : 'not-allowed',
              opacity: date ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              letterSpacing: '0.3px',
            }}
          >
            <FiCalendar size={16} />
            Quick Check
          </button>
        )}

        {/* Inline Results */}
        {results && (
          <div style={{ animation: 'miniSlideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div className="mini-stat-card" style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(236, 72, 153, 0.04))'
                  : 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(236, 72, 153, 0.02))',
                border: `1px solid ${isDark ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.15)'}`,
                borderRadius: '14px',
                padding: '14px 10px',
                textAlign: 'center',
              }}>
                <FiHeart size={16} color={COLORS.mother} style={{ marginBottom: '6px' }} />
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: isDark ? COLORS.muted : '#718096', marginBottom: '4px' }}>
                  Mother
                </p>
                <p style={{ fontSize: '22px', fontWeight: '700', color: COLORS.mother }}>
                  <AnimatedNumber value={parseFloat(motherPct)} />%
                </p>
              </div>
              <div className="mini-stat-card" style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(99, 102, 241, 0.04))'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.02))',
                border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)'}`,
                borderRadius: '14px',
                padding: '14px 10px',
                textAlign: 'center',
              }}>
                <FiShield size={16} color={COLORS.father} style={{ marginBottom: '6px' }} />
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: isDark ? COLORS.muted : '#718096', marginBottom: '4px' }}>
                  Father
                </p>
                <p style={{ fontSize: '22px', fontWeight: '700', color: COLORS.father }}>
                  <AnimatedNumber value={parseFloat(fatherPct)} />%
                </p>
              </div>
              <div className="mini-stat-card" style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(168, 85, 247, 0.04))'
                  : 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(168, 85, 247, 0.02))',
                border: `1px solid ${isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.15)'}`,
                borderRadius: '14px',
                padding: '14px 10px',
                textAlign: 'center',
              }}>
                <FiStar size={16} color={COLORS.total} style={{ marginBottom: '6px' }} />
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: isDark ? COLORS.muted : '#718096', marginBottom: '4px' }}>
                  Total
                </p>
                <p style={{ fontSize: '22px', fontWeight: '700', color: COLORS.total }}>
                  <AnimatedNumber value={results.grandTotal} />%
                </p>
              </div>
            </div>

            {/* Factor Breakdown */}
            <div style={{
              background: isDark ? 'rgba(27, 17, 55, 0.5)' : 'rgba(241, 245, 249, 0.6)',
              borderRadius: '16px',
              border: `1px solid ${isDark ? 'rgba(124, 58, 237, 0.15)' : 'rgba(203, 213, 225, 0.4)'}`,
              padding: '16px',
              marginBottom: '16px',
            }}>
              <p style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                color: isDark ? COLORS.muted : '#718096',
                marginBottom: '14px',
                fontWeight: '600',
              }}>
                Factor Breakdown
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {results.factors.map((f, i) => {
                  const Icon = FACTOR_ICONS[i];
                  const pct = (f.total / maxFactor) * 100;
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Icon size={12} color={COLORS.secondary} />
                          <span style={{ fontSize: '12px', color: isDark ? COLORS.muted : '#718096', fontWeight: '500' }}>{f.name}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: isDark ? COLORS.text : '#1a202c', fontWeight: '600' }}>
                          {f.total.toFixed(2)}%
                        </span>
                      </div>
                      <div className="mini-bar-track">
                        <div
                          className="mini-bar-fill"
                          style={{
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
                            animationDelay: `${i * 80}ms`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Insight Card */}
            <div style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(236, 72, 153, 0.08))'
                : 'linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(236, 72, 153, 0.04))',
              border: `1px solid ${isDark ? 'rgba(124, 58, 237, 0.25)' : 'rgba(139, 92, 246, 0.15)'}`,
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '20px',
              animation: 'miniGlow 3s ease-in-out infinite',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: COLORS.primary,
                  animation: 'miniPulse 2s ease-in-out infinite',
                }} />
                <span style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: COLORS.secondary,
                  fontWeight: '600',
                }}>
                  Energy Insight
                </span>
              </div>
              <p style={{ fontSize: '14px', color: isDark ? COLORS.text : '#1a202c', lineHeight: 1.6, marginBottom: '8px' }}>
                <span style={{ color: results.dominantParent === 'Mother' ? COLORS.mother : COLORS.father, fontWeight: '600' }}>
                  {results.dominantParent} energy
                </span>
                {' '}is dominant today.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: isDark ? COLORS.muted : '#718096', marginBottom: '2px' }}>Balance Score</p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: isDark ? COLORS.text : '#1a202c' }}>
                    {results.dominantParent === 'Mother' ? motherPct : fatherPct}%
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: isDark ? COLORS.muted : '#718096', marginBottom: '2px' }}>Day Type</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: isDark ? COLORS.text : '#1a202c' }}>
                    {results.isOddDay ? 'Odd Day' : 'Even Day'}
                  </p>
                </div>
              </div>
            </div>

            {/* Recalculate Button */}
            <button
              onClick={handleRecalculate}
              className="mini-btn"
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '14px',
                border: `1px solid ${isDark ? 'rgba(124, 58, 237, 0.3)' : 'rgba(139, 92, 246, 0.25)'}`,
                background: isDark ? 'rgba(124, 58, 237, 0.1)' : 'rgba(139, 92, 246, 0.06)',
                color: isDark ? '#A855F7' : '#7C3AED',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                letterSpacing: '0.3px',
              }}
            >
              <FiRefreshCw size={16} />
              Recalculate
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes miniSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
