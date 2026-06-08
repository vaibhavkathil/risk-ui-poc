import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle, 
  XOctagon, 
  ArrowRight,
  Search,
  Building,
  User,
  Activity
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { transactions } = useApp();
  const navigate = useNavigate();

  // Dynamic calculations based on mock data
  const totalCases = transactions.length;
  const flaggedCount = transactions.filter(t => t.status === 'Flagged').length;
  const approvedCount = transactions.filter(t => t.status === 'Approved').length;
  const deniedCount = transactions.filter(t => t.status === 'Denied').length;

  // Lifetime metrics (scaled with active mock items)
  const lifetimeTotal = 2450 + totalCases;
  const lifetimeFlagged = 184 + flaggedCount;
  const lifetimeApproved = 2120 + approvedCount;
  const lifetimeDenied = 146 + deniedCount;

  // Risk Rating Calculations
  const riskCounts = {
    CRITICAL: transactions.filter(t => t.riskRating === 'CRITICAL').length + 48,
    HIGH: transactions.filter(t => t.riskRating === 'HIGH').length + 120,
    MEDIUM: transactions.filter(t => t.riskRating === 'MEDIUM').length + 310,
    LOW: transactions.filter(t => t.riskRating === 'LOW').length + 942
  };
  const totalRiskCount = riskCounts.CRITICAL + riskCounts.HIGH + riskCounts.MEDIUM + riskCounts.LOW;
  
  const riskPercentages = {
    CRITICAL: Math.round((riskCounts.CRITICAL / totalRiskCount) * 100),
    HIGH: Math.round((riskCounts.HIGH / totalRiskCount) * 100),
    MEDIUM: Math.round((riskCounts.MEDIUM / totalRiskCount) * 100),
    LOW: Math.round((riskCounts.LOW / totalRiskCount) * 100)
  };

  // Client Category Calculations
  const categoryCounts = {
    Corporate: transactions.filter(t => t.category === 'Corporate').length + 320,
    FI: transactions.filter(t => t.category === 'FI').length + 180,
    Retail: transactions.filter(t => t.category === 'Retail').length + 750
  };
  const totalCategoryCount = categoryCounts.Corporate + categoryCounts.FI + categoryCounts.Retail;
  const corporatePct = (categoryCounts.Corporate / totalCategoryCount) * 100;
  const fiPct = (categoryCounts.FI / totalCategoryCount) * 100;
  const retailPct = (categoryCounts.Retail / totalCategoryCount) * 100;

  // Create conic gradient values for Donut Chart
  const donutGradient = `conic-gradient(
    var(--color-brand) 0% ${corporatePct}%, 
    var(--color-info) ${corporatePct}% ${corporatePct + fiPct}%, 
    var(--color-success) ${corporatePct + fiPct}% 100%
  )`;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>KYC Compliance Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Real-time KYC verification status, risk scores, and automated rule execution analytics.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/logs')}>
          <Search size={16} /> Search All Audit Logs
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="metrics-grid">
        {/* Total Processed */}
        <div className="card metric-card glass">
          <div className="metric-info">
            <h3>Total Cases Processed</h3>
            <div className="metric-value">{lifetimeTotal.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Automated ingestion queue</div>
          </div>
          <div className="metric-icon purple">
            <Activity size={20} />
          </div>
        </div>

        {/* Flagged (Manual Review) */}
        <div className="card metric-card glass">
          <div className="metric-info">
            <h3>Flagged Alerts</h3>
            <div className="metric-value" style={{ color: 'var(--color-warning)' }}>{lifetimeFlagged.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned to analysts ({flaggedCount} active)</div>
          </div>
          <div className="metric-icon amber">
            <ShieldAlert size={20} />
          </div>
        </div>

        {/* Approved */}
        <div className="card metric-card glass">
          <div className="metric-info">
            <h3>Approved Entities</h3>
            <div className="metric-value" style={{ color: 'var(--color-success)' }}>{lifetimeApproved.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cleared risk thresholds</div>
          </div>
          <div className="metric-icon green">
            <CheckCircle size={20} />
          </div>
        </div>

        {/* Denied */}
        <div className="card metric-card glass">
          <div className="metric-info">
            <h3>Denied / Blocked</h3>
            <div className="metric-value" style={{ color: 'var(--color-danger)' }}>{lifetimeDenied.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sanctions match or policy violation</div>
          </div>
          <div className="metric-icon red">
            <XOctagon size={20} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-cols-2">
        {/* Risk Rating Distribution */}
        <div className="card glass">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--color-brand)' }} />
            Risk Rating Distribution
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Critical */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Critical</span>
                <span style={{ color: 'var(--text-secondary)' }}>{riskCounts.CRITICAL} cases ({riskPercentages.CRITICAL}%)</span>
              </div>
              <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${riskPercentages.CRITICAL}%`, height: '100%', backgroundColor: 'var(--color-danger)', borderRadius: '4px' }} />
              </div>
            </div>

            {/* High */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>High</span>
                <span style={{ color: 'var(--text-secondary)' }}>{riskCounts.HIGH} cases ({riskPercentages.HIGH}%)</span>
              </div>
              <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${riskPercentages.HIGH}%`, height: '100%', backgroundColor: 'var(--color-warning)', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Medium</span>
                <span style={{ color: 'var(--text-secondary)' }}>{riskCounts.MEDIUM} cases ({riskPercentages.MEDIUM}%)</span>
              </div>
              <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${riskPercentages.MEDIUM}%`, height: '100%', backgroundColor: 'var(--color-info)', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Low */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Low</span>
                <span style={{ color: 'var(--text-secondary)' }}>{riskCounts.LOW} cases ({riskPercentages.LOW}%)</span>
              </div>
              <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${riskPercentages.LOW}%`, height: '100%', backgroundColor: 'var(--color-success)', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Client Category Chart */}
        <div className="card glass">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Client Categories</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', height: '100%', minHeight: '140px' }}>
            {/* CSS Conic Gradient Donut */}
            <div style={{ 
              position: 'relative', 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              background: donutGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {/* Inner Circle cutout */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalCategoryCount}</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              {/* Corporate */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-brand)' }} />
                  <span>Corporate</span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{categoryCounts.Corporate} ({Math.round(corporatePct)}%)</span>
              </div>

              {/* FI */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-info)' }} />
                  <span>Financial Inst.</span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{categoryCounts.FI} ({Math.round(fiPct)}%)</span>
              </div>

              {/* Retail */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
                  <span>Retail Customers</span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{categoryCounts.Retail} ({Math.round(retailPct)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Queue Grid */}
      <div className="card glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Active Risk Alerts Queue</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.15rem' }}>High-severity records requiring analyst verification</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/logs')}>
            View All Records
          </button>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Entity Name</th>
                <th>Category</th>
                <th>Risk Rating</th>
                <th>Score</th>
                <th>Processed</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr 
                  key={t.id} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/record/${t.id}`)}
                >
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-brand)' }}>
                      {t.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.entityName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.duration} latency</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                      {t.category === 'Corporate' ? <Building size={14} style={{ color: 'var(--text-muted)' }} /> : <User size={14} style={{ color: 'var(--text-muted)' }} />}
                      {t.category}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${t.riskRating.toLowerCase()}`}>
                      {t.riskRating}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: t.score > 0.8 ? 'var(--color-danger)' : t.score > 0.5 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                      {Math.round(t.score * 100)}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.submittedAgo}</span>
                  </td>
                  <td>
                    <span className={`badge ${t.status.toLowerCase()}`}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                      Analyze <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
