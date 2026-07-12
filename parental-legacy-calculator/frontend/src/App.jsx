import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="bg-glow-orb bg-glow-orb-1" />
          <div className="bg-glow-orb bg-glow-orb-2" />
          <div className="bg-glow-orb bg-glow-orb-3" />
          <div className="bg-glow-orb bg-glow-orb-4" />
          <div className="bg-grid-lines" />
          <div className="bg-flow-line bg-flow-line-1" />
          <div className="bg-flow-line bg-flow-line-2" />
          <div className="bg-flow-line bg-flow-line-3" />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
