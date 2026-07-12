import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { calculationAPI } from '../utils/api';
import { FiTrash2, FiClock, FiArrowUp, FiArrowDown, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import SummaryCards from '../components/SummaryCards';
import ResultsTable from '../components/ResultsTable';
import Charts from '../components/Charts';
import InsightSummary from '../components/InsightSummary';
import ExportButtons from '../components/ExportButtons';

export default function History() {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const chartsRefs = useRef({});
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCalculations();
  }, [token, navigate]);

  const fetchCalculations = async () => {
    try {
      const res = await calculationAPI.getAll();
      setCalculations(res.data.data);
    } catch (err) {
      console.error('Failed to fetch calculations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this calculation?')) return;
    try {
      await calculationAPI.delete(id);
      setCalculations((prev) => prev.filter((c) => c._id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--text-primary)',
          }}
        >
          Calculation History
        </h2>
        <Link
          to="/"
          className="btn-primary"
          style={{ textDecoration: 'none', fontSize: '14px', padding: '10px 20px' }}
        >
          + New Calculation
        </Link>
      </div>

      {calculations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <FiClock style={{ fontSize: '48px', color: 'var(--text-muted)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
            No calculations yet. Go to the calculator to get started!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {calculations.map((calc) => {
            const isExpanded = expandedId === calc._id;
            const results = {
              ...calc.results,
              factors: calc.results.factors.map((f) => ({
                ...f,
                mother: parseFloat(f.mother),
                father: parseFloat(f.father),
                total: parseFloat(f.total),
              })),
              motherTotal: parseFloat(calc.results.motherTotal),
              fatherTotal: parseFloat(calc.results.fatherTotal),
              grandTotal: parseFloat(calc.results.grandTotal),
              dateString: calc.dateOfBirth,
              isOddDay: calc.dateOfBirth.split('/')[0] % 2 !== 0,
            };

            return (
              <div key={calc._id} className="fade-in">
                <div
                  className="card"
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    borderColor: isExpanded ? '#8b5cf6' : undefined,
                    position: 'sticky',
                    top: '60px',
                    zIndex: 10,
                  }}
                  onClick={() => toggleExpand(calc._id)}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {isExpanded ? <FiChevronUp size={18} color="var(--text-muted)" /> : <FiChevronDown size={18} color="var(--text-muted)" />}
                      <div>
                        <p style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '16px' }}>
                          DOB: {calc.dateOfBirth}
                        </p>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Saved on {new Date(calc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                        <span className="mother-color">
                          Mother: {calc.results.motherTotal.toFixed(3)}
                        </span>
                        <span className="father-color">
                          Father: {calc.results.fatherTotal.toFixed(3)}
                        </span>
                      </div>

                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background:
                            calc.results.dominantParent === 'Mother'
                              ? 'rgba(236, 72, 153, 0.1)'
                              : 'rgba(59, 130, 246, 0.1)',
                          color:
                            calc.results.dominantParent === 'Mother'
                              ? '#ec4899'
                              : '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {calc.results.dominantParent === 'Mother' ? (
                          <FiArrowUp />
                        ) : (
                          <FiArrowDown />
                        )}
                        {calc.results.dominantParent}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(calc._id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                          fontSize: '18px',
                          padding: '4px',
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      padding: '16px 0 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    }}
                  >
                    <SummaryCards results={results} />
                    <ResultsTable results={results} />
                    <InsightSummary results={results} />
                    <ExportButtons results={results} showSave={false} chartsRef={chartsRefs.current[calc._id]} />
                    <Charts ref={(el) => { chartsRefs.current[calc._id] = { current: el }; }} results={results} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
