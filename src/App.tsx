import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { Dashboard } from './pages/Dashboard';
import { RunsList } from './pages/RunsList';
import { RunDetails } from './pages/RunDetails';
import { RiskAnalysis } from './pages/RiskAnalysis';
import { DebugDetail } from './pages/DebugDetail';
import { 
  LayoutDashboard, 
  PlaySquare, 
  Search, 
  Menu, 
  X, 
  ShieldCheck,
  TrendingUp,
  Settings
} from 'lucide-react';

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Mobile Header Menu Button */}
        <div style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          zIndex: 90,
          padding: '0 1.5rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }} className="mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="logo-icon" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} />
            </div>
            <span className="logo-text" style={{ fontSize: '1rem' }}>RiskEngine</span>
          </div>
          <button 
            onClick={toggleMobileMenu}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* CSS rules to show/hide elements on screens */}
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 1024px) {
            .mobile-header {
              display: flex !important;
            }
          }
        `}} />

        {/* Navigation Sidebar */}
        <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-logo">
            <div className="logo-icon">
              <ShieldCheck size={20} />
            </div>
            <span className="logo-text">RiskEngine</span>
          </div>

          <nav className="sidebar-nav">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to="/analysis" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search />
              <span>Risk Analysis</span>
            </NavLink>

            <NavLink 
              to="/runs" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <PlaySquare />
              <span>Pipelines</span>
            </NavLink>

            <NavLink 
              to="/reporting" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            >
              <TrendingUp />
              <span>Reporting</span>
            </NavLink>

            <NavLink 
              to="/settings" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            >
              <Settings />
              <span>Settings</span>
            </NavLink>
          </nav>

          <div className="sidebar-footer">
            <div className="avatar">SJ</div>
            <div className="user-info">
              <span className="user-name">Sarah Jenkins</span>
              <span className="user-role">Compliance Director</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/runs" element={<RunsList />} />
            <Route path="/runs/:id" element={<RunDetails />} />
            <Route path="/analysis" element={<RiskAnalysis />} />
            <Route path="/debug/:id" element={<DebugDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
