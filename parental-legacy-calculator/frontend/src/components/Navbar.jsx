import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
      <div
        style={{
          background: 'var(--nav-bg)',
          borderBottom: '1px solid var(--nav-border)',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          to="/"
          onClick={closeMenu}
          style={{
            textDecoration: 'none',
            color: 'var(--text-primary)',
            fontSize: '20px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Parental Legacy
        </Link>

        {/* Desktop nav */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: '2px solid var(--border-color)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              fontSize: '18px',
            }}
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>

          {user ? (
            <>
              <Link
                to="/history"
                style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}
              >
                History
              </Link>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiUser /> {user.name}
              </span>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '18px', display: 'flex' }}>
                <FiLogOut />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', fontSize: '14px', padding: '8px 16px' }}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger button */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: '2px solid var(--border-color)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            fontSize: '20px',
          }}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="nav-mobile"
          style={{
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: '1px solid var(--nav-border)',
            padding: '12px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: '2px solid var(--border-color)',
              borderRadius: '8px',
              padding: '10px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              width: '100%',
            }}
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
            <span style={{ marginLeft: '8px', fontSize: '14px' }}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          {user ? (
            <>
              <Link
                to="/history"
                onClick={closeMenu}
                style={{
                  textDecoration: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center',
                }}
              >
                History
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '14px', padding: '8px' }}>
                <FiUser /> {user.name}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px',
                  cursor: 'pointer',
                  color: '#ef4444',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%',
                }}
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                style={{
                  textDecoration: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center',
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  fontSize: '14px',
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
