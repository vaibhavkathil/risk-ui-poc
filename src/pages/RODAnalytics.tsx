import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { 
  Play, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  TrendingUp,
  ChevronRight
} from 'lucide-react';

export const RODAnalytics: React.FC = () => {
  const { runs } = useApp();
  const navigate = useNavigate();

  // Metrics
  const totalRuns = 12450;
  const failedRuns = 1284;
  const successRate = 94.2;
  const avgRunTime = "2m 45s";

  // Data for visual charts
  const runsOverTime = [
    { month: 'Jan', value: 450 },
    { month: 'Feb', value: 620 },
    { month: 'Mar', value: 890 },
    { month: 'Apr', value: 780 },
    { month: 'May', value: 1050 },
    { month: 'Jun', value: 1200 },
    { month: 'Jul', value: 1100 },
    { month: 'Aug', value: 950 },
    { month: 'Sep', value: 1350 },
    { month: 'Oct', value: 1450 },
    { month: 'Nov', value: 1600 },
    { month: 'Dec', value: 1850 }
  ];

  const maxRunsValue = 2000;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0 }}>ROD Run Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Aggregated performance metrics and pipeline execution statistics for Risk On Demand.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/runs')}>
          <Play size={16} fill="white" /> View Pipelines
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {/* Total Runs */}
        <div className="card metric-card" style={{ padding: '1.25rem' }}>
          <div className="metric-info">
            <h3>Total ROD Runs</h3>
            <div className="metric-value" style={{ fontSize: '1.75rem' }}>{totalRuns.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lifetime pipeline runs executed</div>
          </div>
          <div className="metric-icon purple" style={{ width: '40px', height: '40px' }}>
            <Play size={18} />
          </div>
        </div>

        {/* Failed Runs */}
        <div className="card metric-card" style={{ padding: '1.25rem' }}>
          <div className="metric-info">
            <h3>Failed Runs</h3>
            <div className="metric-value" style={{ fontSize: '1.75rem', color: 'var(--color-danger)' }}>{failedRuns.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>10.3% error incidence</div>
          </div>
          <div className="metric-icon red" style={{ width: '40px', height: '40px' }}>
            <AlertOctagon size={18} />
          </div>
        </div>

        {/* Success Rate */}
        <div className="card metric-card" style={{ padding: '1.25rem' }}>
          <div className="metric-info">
            <h3>Success Rate</h3>
            <div className="metric-value" style={{ fontSize: '1.75rem', color: 'var(--color-success)' }}>{successRate}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target threshold: &gt;90%</div>
          </div>
          <div className="metric-icon green" style={{ width: '40px', height: '40px' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>

        {/* Avg Run Time */}
        <div className="card metric-card" style={{ padding: '1.25rem' }}>
          <div className="metric-info">
            <h3>Avg. Run Time</h3>
            <div className="metric-value" style={{ fontSize: '1.75rem', color: '#60a5fa' }}>{avgRunTime}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Compute benchmark latency</div>
          </div>
          <div className="metric-icon purple" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Clock size={18} />
          </div>
        </div>
      </div>

      {/* ROD Runs Over Time Bar Chart */}
      <div className="card">
        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={16} style={{ color: 'var(--color-brand)' }} />
          ROD Runs Over Time (Monthly)
        </h2>
        
        {/* Visual Bar Graph */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          height: '180px',
          paddingTop: '10px',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1rem',
          position: 'relative'
        }}>
          {/* Y-axis guidelines */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: '25%', borderTop: '1px dashed rgba(255,255,255,0.03)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '1px dashed rgba(255,255,255,0.03)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: '75%', borderTop: '1px dashed rgba(255,255,255,0.03)' }} />

          {runsOverTime.map((item, idx) => {
            const barHeight = Math.round((item.value / maxRunsValue) * 140);
            return (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flex: 1,
                height: '100%',
                zIndex: 2
              }}>
                <div 
                  style={{
                    width: '60%',
                    height: `${barHeight}px`,
                    background: 'linear-gradient(to top, rgba(139, 92, 246, 0.3) 0%, #60a5fa 100%)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  className="chart-bar"
                  title={`${item.month}: ${item.value} runs`}
                >
                  <style dangerouslySetInnerHTML={{__html: `
                    .chart-bar:hover {
                      filter: brightness(1.2);
                      box-shadow: 0 0 10px rgba(96, 165, 250, 0.4);
                    }
                  `}} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{item.month}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom section: Trend Chart & Outcomes Distribution */}
      <div className="grid-cols-2">
        {/* Success Rate Trend Line Chart */}
        <div className="card">
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem' }}>Success Rate Trend</h2>
          <div style={{ height: '140px', position: 'relative', overflow: 'hidden' }}>
            {/* Draw SVG Curve */}
            <svg viewBox="0 0 400 120" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="400" y2="90" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
              
              {/* Fill area */}
              <path d="M 0 80 Q 80 95 160 60 T 320 20 L 400 35 L 400 120 L 0 120 Z" fill="url(#lineGlow)" />
              {/* Curve Line */}
              <path d="M 0 80 Q 80 95 160 60 T 320 20 L 400 35" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
              
              {/* Dot Indicators */}
              <circle cx="160" cy="60" r="4" fill="#60a5fa" />
              <circle cx="320" cy="20" r="4" fill="#10b981" />
            </svg>
            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-success)' }}>
              <ArrowUpRight size={14} />
              <span>Target Achieved (94.2%)</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            <span>Week 18</span>
            <span>Week 19</span>
            <span>Week 20</span>
            <span>Week 21</span>
            <span>Active</span>
          </div>
        </div>

        {/* Outcome Distribution Pie/Donut Visual */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem' }}>Outcome Distribution Ratio</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
            
            {/* Visual Ring structure */}
            <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
              <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                {/* Underlay */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--bg-tertiary)" strokeWidth="3" />
                
                {/* Approved (82%) */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--color-success)" strokeWidth="3" 
                  strokeDasharray="82 18" strokeDashoffset="0" />
                
                {/* Flagged (13%) */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--color-warning)" strokeWidth="3" 
                  strokeDasharray="13 87" strokeDashoffset="-82" />

                {/* Denied (5%) */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--color-danger)" strokeWidth="3" 
                  strokeDasharray="5 95" strokeDashoffset="-95" />
              </svg>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>82%</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Approved</span>
              </div>
            </div>

            {/* Labels grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
                  Approved (Auto/Manual)
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>82.1%</span>
              </div>

              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }} />
                  Flagged (Review Check)
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>13.2%</span>
              </div>

              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', paddingBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }} />
                  Denied (Sanctions/AML)
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>4.7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent runs quick link view */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Recent Running Pipelines</h2>
          <Link to="/runs" style={{ color: 'var(--color-brand)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>Manage Pipelines</Link>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Pipeline Job Name</th>
                <th>Progress Check</th>
                <th>Status</th>
                <th>Owner</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {runs.slice(0, 3).map(r => (
                <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/runs/${r.id}`)}>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-brand)' }}>{r.id}</span></td>
                  <td><span style={{ fontWeight: 600 }}>{r.name}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{r.processedItems.toLocaleString()} items</span>
                      {r.status === 'running' && <span style={{ color: 'var(--color-brand)' }}>({r.successRate}% OK)</span>}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      backgroundColor: r.status === 'completed' ? 'var(--color-success-bg)' : r.status === 'failed' ? 'var(--color-danger-bg)' : r.status === 'running' ? 'rgba(139,92,246,0.1)' : 'var(--bg-tertiary)',
                      color: r.status === 'completed' ? 'var(--color-success)' : r.status === 'failed' ? 'var(--color-danger)' : r.status === 'running' ? 'var(--color-brand)' : 'var(--text-secondary)'
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.owner}</span></td>
                  <td style={{ textAlign: 'right' }}><ChevronRight size={16} style={{ color: 'var(--text-muted)' }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
