import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiX, FiEye, FiEyeOff } from 'react-icons/fi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '10px 14px',
  border: `2px solid ${hasError ? '#ef4444' : 'var(--border-color)'}`,
  borderRadius: '8px',
  fontSize: '14px',
  backgroundColor: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  outline: 'none',
});

export default function AuthPromptModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setServerError('');
    setShowPassword(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const validate = () => {
    const errs = {};
    if (mode === 'register') {
      if (!name.trim()) errs.name = 'Name is required';
      else if (name.trim().length < 2) errs.name = 'At least 2 characters';
      else if (/[0-9]/.test(name)) errs.name = 'No numbers allowed';
    }
    if (!email.trim()) errs.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email)) errs.email = 'Invalid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Min 6 characters';
    if (mode === 'register') {
      if (!confirmPassword) errs.confirmPassword = 'Required';
      else if (confirmPassword !== password) errs.confirmPassword = 'No match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onAuthSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />
      <div
        className="card fade-in"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          zIndex: 1,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: '20px',
          }}
        >
          <FiX />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {mode === 'login' ? 'Login to Save' : 'Create Account'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {mode === 'login'
              ? 'Login to save your results to history'
              : 'Register to start saving your calculations'}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: errors.name ? '#ef4444' : 'var(--text-secondary)', marginBottom: '4px' }}>
                Name {errors.name && '*'}
              </label>
              <input
                type="text"
                style={inputStyle(errors.name)}
                placeholder="Your name"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
              />
              {errors.name && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.name}</p>}
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: errors.email ? '#ef4444' : 'var(--text-secondary)', marginBottom: '4px' }}>
              Email {errors.email && '*'}
            </label>
            <input
              type="email"
              style={inputStyle(errors.email)}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
            />
            {errors.email && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.email}</p>}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: errors.password ? '#ef4444' : 'var(--text-secondary)', marginBottom: '4px' }}>
              Password {errors.password && '*'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                style={{ ...inputStyle(errors.password), paddingRight: '36px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px' }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.password}</p>}
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: errors.confirmPassword ? '#ef4444' : 'var(--text-secondary)', marginBottom: '4px' }}>
                Confirm Password {errors.confirmPassword && '*'}
              </label>
              <input
                type="password"
                style={inputStyle(errors.confirmPassword)}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })); }}
              />
              {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.confirmPassword}</p>}
            </div>
          )}

          {serverError && (
            <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px', textAlign: 'center', padding: '8px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>
              {serverError}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '10px' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login & Save' : 'Register & Save'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '13px', color: 'var(--text-muted)' }}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            style={{ background: 'none', border: 'none', color: '#8b5cf6', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
