import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import MiniCalculator from '../components/MiniCalculator';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName(name) {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (/[0-9]/.test(name)) return 'Name cannot contain numbers';
  return '';
}

function validateEmail(email) {
  if (!email.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Enter a valid email address';
  return '';
}

function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Must be at least 6 characters';
  if (!/[A-Z]/.test(password)) return 'Must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Must contain a lowercase letter';
  if (!/[0-9]/.test(password)) return 'Must contain a number';
  return '';
}

function validateConfirmPassword(confirm, password) {
  if (!confirm) return 'Please confirm your password';
  if (confirm !== password) return 'Passwords do not match';
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

function PasswordStrength({ password }) {
  const checks = [
    { label: '6+ characters', met: password.length >= 6 },
    { label: 'Uppercase', met: /[A-Z]/.test(password) },
    { label: 'Lowercase', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
  ];

  if (!password) return null;

  const metCount = checks.filter((c) => c.met).length;

  return (
    <div style={{ marginTop: '8px' }}>
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '6px',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              backgroundColor:
                i <= metCount
                  ? metCount <= 1
                    ? '#ef4444'
                    : metCount <= 2
                    ? '#f59e0b'
                    : metCount <= 3
                    ? '#3b82f6'
                    : '#22c55e'
                  : 'var(--border-color)',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {checks.map((check, i) => (
          <span
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '11px',
              color: check.met ? '#22c55e' : 'var(--text-muted)',
            }}
          >
            {check.met ? <FiCheck size={10} /> : <FiX size={10} />}
            {check.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = {};
    if (field === 'name') fieldErrors.name = validateName(name);
    if (field === 'email') fieldErrors.email = validateEmail(email);
    if (field === 'password') {
      fieldErrors.password = validatePassword(password);
      if (touched.confirmPassword) {
        fieldErrors.confirmPassword = validateConfirmPassword(confirmPassword, password);
      }
    }
    if (field === 'confirmPassword') {
      fieldErrors.confirmPassword = validateConfirmPassword(confirmPassword, password);
    }
    setErrors((prev) => ({ ...prev, ...fieldErrors }));
  };

  const handleChange = (field, value) => {
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);

    if (touched[field]) {
      const fieldErrors = {};
      if (field === 'name') fieldErrors.name = validateName(value);
      if (field === 'email') fieldErrors.email = validateEmail(value);
      if (field === 'password') {
        fieldErrors.password = validatePassword(value);
        if (touched.confirmPassword) {
          fieldErrors.confirmPassword = validateConfirmPassword(confirmPassword, value);
        }
      }
      if (field === 'confirmPassword') {
        fieldErrors.confirmPassword = validateConfirmPassword(value, password);
      }
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword, password);

    setErrors({
      name: nameErr,
      email: emailErr,
      password: passwordErr,
      confirmPassword: confirmErr,
    });
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (nameErr || emailErr || passwordErr || confirmErr) return;

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
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
          Create Account
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          Register to save and track your legacy calculations
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: touched.name && errors.name ? '#ef4444' : 'var(--text-secondary)',
                marginBottom: '6px',
              }}
            >
              Name {touched.name && errors.name && '*'}
            </label>
            <input
              type="text"
              style={inputStyle(touched.name && errors.name)}
              placeholder="Your name"
              value={name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
            />
            {showError('name')}
          </div>

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

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: touched.password && errors.password ? '#ef4444' : 'var(--text-secondary)',
                marginBottom: '6px',
              }}
            >
              Password {touched.password && errors.password && '*'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                style={{
                  ...inputStyle(touched.password && errors.password),
                  paddingRight: '44px',
                }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
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
            {showError('password')}
            <PasswordStrength password={password} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: touched.confirmPassword && errors.confirmPassword ? '#ef4444' : 'var(--text-secondary)',
                marginBottom: '6px',
              }}
            >
              Confirm Password {touched.confirmPassword && errors.confirmPassword && '*'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                style={{
                  ...inputStyle(touched.confirmPassword && errors.confirmPassword),
                  paddingRight: '44px',
                }}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
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
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {showError('confirmPassword')}
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
            {loading ? 'Creating account...' : 'Register'}
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
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#8b5cf6',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Login
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
