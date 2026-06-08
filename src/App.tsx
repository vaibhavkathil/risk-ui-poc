import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { Dashboard } from './pages/Dashboard';
import { RODAnalytics } from './pages/RODAnalytics';
import { RunsList } from './pages/RunsList';
import { RunDetails } from './pages/RunDetails';
import { RiskAnalysis } from './pages/RiskAnalysis';
import { DebugDetail } from './pages/DebugDetail';
import { AdminConfig } from './pages/AdminConfig';
import { RecordDetail } from './pages/RecordDetail';
import { AuditLogs } from './pages/AuditLogs';
import { Architecture } from './pages/Architecture';
import { 
  LayoutDashboard, 
  Settings,
  FileText,
  PlaySquare,
  Search,
  TrendingUp,
  Cpu,
  Menu, 
  X, 
  ShieldCheck
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
        <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{ overflowY: 'auto' }}>
          <div className="sidebar-logo">
            <div className="logo-icon">
              <ShieldCheck size={20} />
            </div>
            <span className="logo-text">RiskEngine</span>
          </div>

          <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {/* KYC Risk Engine Section */}
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '0.5rem',
              marginBottom: '0.25rem',
              paddingLeft: '1rem'
            }}>
              KYC Risk Engine
            </div>

            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard size={18} />
              <span>KYC Dashboard</span>
            </NavLink>

            <NavLink 
              to="/admin" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings size={18} />
              <span>Admin Config</span>
            </NavLink>

            <NavLink 
              to="/logs" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText size={18} />
              <span>Audit Logs</span>
            </NavLink>

            {/* Risk On Demand Section */}
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '1.5rem',
              marginBottom: '0.25rem',
              paddingLeft: '1rem'
            }}>
              Risk On Demand
            </div>

            <NavLink 
              to="/rod-analytics" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <TrendingUp size={18} />
              <span>ROD Analytics</span>
            </NavLink>

            <NavLink 
              to="/runs" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <PlaySquare size={18} />
              <span>Pipelines</span>
            </NavLink>

            <NavLink 
              to="/analysis" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search size={18} />
              <span>Risk Analysis</span>
            </NavLink>

            <NavLink 
              to="/architecture" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Cpu size={18} />
              <span>AI Agent Network</span>
            </NavLink>
          </nav>

          <div className="sidebar-footer" style={{ marginTop: '2rem' }}>
            <div className="avatar" style={{ backgroundColor: 'var(--color-brand)' }}>SH</div>
            <div className="user-info">
              <span className="user-name">S. Henderson</span>
              <span className="user-role">Senior KYC Analyst</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            {/* KYC Risk Engine Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<AdminConfig />} />
            <Route path="/logs" element={<AuditLogs />} />
            <Route path="/record/:id" element={<RecordDetail />} />

            {/* Risk On Demand Routes */}
            <Route path="/rod-analytics" element={<RODAnalytics />} />
            <Route path="/runs" element={<RunsList />} />
            <Route path="/runs/:id" element={<RunDetails />} />
            <Route path="/analysis" element={<RiskAnalysis />} />
            <Route path="/debug/:id" element={<DebugDetail />} />
            <Route path="/architecture" element={<Architecture />} />

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
