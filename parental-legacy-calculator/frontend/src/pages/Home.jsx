import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
// import { FiHeart, FiShield } from 'react-icons/fi';
import DateInput from '../components/DateInput';
import ResultsTable from '../components/ResultsTable';
import SummaryCards from '../components/SummaryCards';
import Charts from '../components/Charts';
import ExportButtons from '../components/ExportButtons';
import InsightSummary from '../components/InsightSummary';
import { calculateLifeFactors } from '../utils/calculations';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [results, setResults] = useState(null);
  const [dateString, setDateString] = useState('');
  const chartsRef = useRef(null);
  const { user } = useAuth();

  const handleDateSubmit = (date) => {
    setDateString(date);
    const calculated = calculateLifeFactors(date);
    setResults(calculated);
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setResults(null);
    setDateString('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {!results ? (
        <>
          <div
            style={{
              minHeight: 'calc(100vh - 100px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 24px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1
                style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  marginBottom: '12px',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Parental Legacy & Life Factors
              </h1>
              <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                Discover your genetic inheritance patterns and life factors based on your date of birth.
                Our algorithm calculates the balance between maternal and paternal influences.
              </p>
            </div>
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <DateInput onDateSubmit={handleDateSubmit} />
                </div>

              </div>
              {!user && (
                <div style={{
                  marginTop: '20px',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  backdropFilter: 'blur(12px)',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.6' }}>
                    Create an account to <strong style={{ color: 'var(--text-primary)' }}>save your calculations</strong>,
                    track your legacy history over time, and <strong style={{ color: 'var(--text-primary)' }}>export full reports</strong> with charts as PDF.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link
                      to="/login"
                      className="btn-secondary"
                      style={{ textDecoration: 'none', fontSize: '14px', padding: '8px 20px', fontWeight: '600' }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary"
                      style={{ textDecoration: 'none', fontSize: '14px', padding: '8px 20px' }}
                    >
                      Register Free
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div id="results">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                }}
              >
                Results for {dateString}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {results.isOddDay ? 'Odd day — Mother carries stronger influence' : 'Even day — Father carries stronger influence'}
              </p>
            </div>
            <button
              className="btn-secondary"
              onClick={handleReset}
              style={{ fontWeight: '600' }}
            >
              Calculate Again
            </button>
          </div>

          <SummaryCards results={results} />
          <ResultsTable results={results} />
          <InsightSummary results={results} />
          <ExportButtons results={results} chartsRef={chartsRef} />

          <div style={{ marginTop: '24px' }}>
            <Charts ref={chartsRef} results={results} />
          </div>
        </div>
      )}
    </div>
  );
}
