import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import MiniCalculator from '../components/MiniCalculator';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  if (!email.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Enter a valid email address';
  return '';
}

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '12px 16px',
  border: `2px solid ${hasError ? '#ef4444' : 'var(--border-color)'}`,
  borderRadius: '8px',
  fontSize: '16px',
  backgroundColor: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  transition: 'border-color 0.2s',
  outline: 'none',
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    }
  };

  const handleChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    if (touched[field] && field === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const emailErr = validateEmail(email);
    setErrors({ email: emailErr });
    setTouched({ email: true });

    if (emailErr) return;

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const showError = (field) =>
    touched[field] && errors[field] ? (
      <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '24px',
          width: '100%',
          maxWidth: '860px',
          alignItems: 'stretch',
        }}
      >
        <div className="card fade-in" style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '8px',
              color: 'var(--text-primary)',
              textAlign: 'center',
            }}
          >
            Welcome Back
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            Login to save and view your calculation history
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: touched.email && errors.email ? '#ef4444' : 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                Email {touched.email && errors.email && '*'}
              </label>
              <input
                type="email"
                style={inputStyle(touched.email && errors.email)}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
              />
              {showError('email')}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  style={{
                    width: '100%',
                    padding: '12px 44px 12px 16px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    transition: 'border-color 0.2s',
                    outline: 'none',
                  }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '18px',
                    padding: '4px',
                  }}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {serverError && (
              <p
                style={{
                  color: '#ef4444',
                  fontSize: '14px',
                  marginBottom: '16px',
                  textAlign: 'center',
                  padding: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '8px',
                }}
              >
                {serverError}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p
            style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '14px',
              color: 'var(--text-muted)',
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#8b5cf6',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Register
            </Link>
          </p>
        </div>

        <div
          className="card fade-in"
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(59,130,246,0.05))',
            padding: '24px',
          }}
        >
          <MiniCalculator />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="max-width: 860px"] {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
