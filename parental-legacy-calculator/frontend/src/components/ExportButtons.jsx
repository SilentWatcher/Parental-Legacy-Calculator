import { FiFileText, FiFile, FiSave } from 'react-icons/fi';
import { exportToCSV, exportToPDF } from '../utils/calculations';
import { calculationAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import AuthPromptModal from './AuthPromptModal';

export default function ExportButtons({ results, showSave = true, chartsRef }) {
  const { token } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authedViaModal, setAuthedViaModal] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const doSave = async () => {
    setSaving(true);
    try {
      await calculationAPI.save({
        dateOfBirth: results.dateString,
        results: {
          factors: results.factors,
          motherTotal: results.motherTotal,
          fatherTotal: results.fatherTotal,
          grandTotal: results.grandTotal,
          dominantParent: results.dominantParent,
        },
      });
      setSaved(true);
      setAuthedViaModal(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to save results');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (!token && !authedViaModal) {
      setShowAuthModal(true);
      return;
    }
    doSave();
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      const chartImages = [];
      if (chartsRef?.current) {
        const html2canvas = (await import('html2canvas')).default;
        const cards = chartsRef.current.querySelectorAll('.card');
        for (const card of cards) {
          const canvas = await html2canvas(card, {
            backgroundColor: isDark ? '#1a1a2e' : '#f0f4f8',
            scale: 2,
            useCORS: true,
            logging: false,
          });
          chartImages.push(canvas.toDataURL('image/png'));
        }
      }
      exportToPDF(results, chartImages);
    } catch (err) {
      console.error('PDF export error:', err);
      exportToPDF(results, []);
    } finally {
      setExportingPDF(false);
    }
  };

  const isLoggedIn = token || authedViaModal;

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginTop: '20px',
        }}
      >
        <button
          className="btn-secondary"
          onClick={handleExportPDF}
          disabled={exportingPDF}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FiFileText /> {exportingPDF ? 'Generating...' : 'Export PDF'}
        </button>
        <button
          className="btn-secondary"
          onClick={() => exportToCSV(results)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FiFile /> Export CSV
        </button>
        {showSave && (
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving || saved}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              opacity: saved ? 0.7 : 1,
            }}
          >
            <FiSave />
            {saving ? 'Saving...' : saved ? 'Saved!' : isLoggedIn ? 'Save to Account' : 'Login to Save'}
          </button>
        )}
      </div>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={doSave}
      />
    </>
  );
}
