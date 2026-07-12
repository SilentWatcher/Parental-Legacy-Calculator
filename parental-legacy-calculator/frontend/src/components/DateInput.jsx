import { useState, useMemo } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { useTheme } from '../context/ThemeContext';

export default function DateInput({ onDateSubmit }) {
  const [date, setDate] = useState(null);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: { main: '#8b5cf6' },
      background: {
        default: 'transparent',
        paper: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)',
      },
    },
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              '& fieldset': {
                borderColor: isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(226, 232, 240, 0.8)',
              },
              '&:hover fieldset': { borderColor: '#8b5cf6' },
              '&.Mui-focused fieldset': { borderColor: '#8b5cf6', borderWidth: 2 },
            },
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              color: 'white',
            },
          },
        },
      },
    },
  }), [isDark]);

  const handleSubmit = () => {
    if (!date) {
      setError('Please select a date');
      return;
    }
    if (date.isAfter(dayjs(), 'day')) {
      setError('Date cannot be in the future');
      return;
    }
    setError('');
    onDateSubmit(date.format('DD/MM/YYYY'));
  };

  return (
    <div className="card fade-in" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
        Enter Your Date of Birth
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        We'll calculate your Parental Legacy & Life Factors
      </p>

      <ThemeProvider theme={muiTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div style={{ marginBottom: '16px' }}>
            <DatePicker
              label="Date of Birth"
              value={date}
              onChange={(v) => { setDate(v); setError(''); }}
              maxDate={dayjs()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error,
                },
              }}
            />
          </div>
        </LocalizationProvider>
      </ThemeProvider>

      <button
        onClick={handleSubmit}
        className="btn-primary"
        style={{ width: '100%' }}
        disabled={!date}
      >
        Calculate Legacy Factors
      </button>
    </div>
  );
}
