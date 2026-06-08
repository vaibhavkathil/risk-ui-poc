import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { 
  Search, 
  FileSpreadsheet, 
  Terminal, 
  User, 
  ArrowRight
} from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const { transactions, auditLogs } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'records' | 'logs'>('records');

  // Search & Filter state for Transactions
  const [txSearch, setTxSearch] = useState('');
  const [txRating, setTxRating] = useState<string>('All');
  const [txStatus, setTxStatus] = useState<string>('All');
  const [txCategory, setTxCategory] = useState<string>('All');

  // Search state for Audit Logs
  const [logSearch, setLogSearch] = useState('');

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.entityName.toLowerCase().includes(txSearch.toLowerCase()) || 
                          t.id.toLowerCase().includes(txSearch.toLowerCase()) ||
                          t.flags.some(f => f.toLowerCase().includes(txSearch.toLowerCase()));
    const matchesRating = txRating === 'All' || t.riskRating === txRating;
    const matchesStatus = txStatus === 'All' || t.status === txStatus;
    const matchesCategory = txCategory === 'All' || t.category === txCategory;
    return matchesSearch && matchesRating && matchesStatus && matchesCategory;
  });

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    return log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
           log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
           log.officer.toLowerCase().includes(logSearch.toLowerCase());
  });

  // Audit log type style helper
  const getLogTypeBadge = (type: 'info' | 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'success': return 'badge approved';
      case 'warning': return 'badge medium';
      case 'error': return 'badge high';
      default: return 'badge pending';
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Audit Logs & Queue</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Comprehensive overview of compliance checks, transaction overrides, and configuration changes.
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        gap: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('records')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: '2px solid',
            borderColor: activeTab === 'records' ? 'var(--color-brand)' : 'transparent',
            color: activeTab === 'records' ? 'var(--text-primary)' : 'var(--text-muted)',
            paddingBottom: '0.75rem',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <FileSpreadsheet size={16} /> Transaction Records ({filteredTransactions.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: '2px solid',
            borderColor: activeTab === 'logs' ? 'var(--color-brand)' : 'transparent',
            color: activeTab === 'logs' ? 'var(--text-primary)' : 'var(--text-muted)',
            paddingBottom: '0.75rem',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <Terminal size={16} /> Configuration Audit Trail ({filteredLogs.length})
        </button>
      </div>

      {/* Tab 1: Transactions Filter & Grid */}
      {activeTab === 'records' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Filters Bar Card */}
          <div className="card glass" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            {/* Search Input */}
            <div className="input-container" style={{ flex: '1 1 240px' }}>
              <Search className="input-icon" />
              <input 
                type="text" 
                className="text-input" 
                placeholder="Search entity, ID, flags..." 
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CATEGORY</span>
              <select 
                className="select-input"
                value={txCategory}
                onChange={(e) => setTxCategory(e.target.value)}
                style={{ padding: '0.5rem 1rem' }}
              >
                <option value="All">All Categories</option>
                <option value="Corporate">Corporate</option>
                <option value="FI">Financial Inst.</option>
                <option value="Retail">Retail</option>
              </select>
            </div>

            {/* Risk Rating Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>RISK</span>
              <select 
                className="select-input"
                value={txRating}
                onChange={(e) => setTxRating(e.target.value)}
                style={{ padding: '0.5rem 1rem' }}
              >
                <option value="All">All Risks</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</span>
              <select 
                className="select-input"
                value={txStatus}
                onChange={(e) => setTxStatus(e.target.value)}
                style={{ padding: '0.5rem 1rem' }}
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Flagged">Flagged</option>
                <option value="Denied">Denied</option>
              </select>
            </div>
          </div>

          {/* Table Grid */}
          <div className="card glass" style={{ padding: 0 }}>
            {filteredTransactions.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No transaction records match the specified filters.
              </div>
            ) : (
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
                      <th>Triggered Flags</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(t => (
                      <tr 
                        key={t.id} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/record/${t.id}`)}
                      >
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-brand)' }}>
                            {t.id}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600 }}>{t.entityName}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Latency: {t.duration}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{t.category}</td>
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
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.submittedAgo}</td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '220px' }}>
                            {t.flags.length === 0 ? (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>None</span>
                            ) : (
                              t.flags.map((flag, i) => (
                                <span 
                                  key={i} 
                                  style={{
                                    fontSize: '0.65rem',
                                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                    color: 'var(--color-danger)',
                                    border: '1px solid var(--color-danger-border)',
                                    borderRadius: '4px',
                                    padding: '0.05rem 0.35rem',
                                    fontWeight: 600
                                  }}
                                >
                                  {flag}
                                </span>
                              ))
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${t.status.toLowerCase()}`}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                            View Case <ArrowRight size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: System Configuration Audit Logs */}
      {activeTab === 'logs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Logs Search Card */}
          <div className="card glass" style={{ padding: '1.25rem' }}>
            <div className="input-container">
              <Search className="input-icon" />
              <input 
                type="text" 
                className="text-input" 
                placeholder="Search audit trail for actions, details, officers..." 
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                style={{ width: '100%', maxWidth: '480px' }}
              />
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="card glass" style={{ padding: 0 }}>
            {filteredLogs.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No audit logs found.
              </div>
            ) : (
              <div className="table-container" style={{ border: 'none' }}>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '18%' }}>Timestamp</th>
                      <th style={{ width: '22%' }}>Action Taken</th>
                      <th>Detailed Audit Trail Remarks</th>
                      <th style={{ width: '15%' }}>Officer / Actor</th>
                      <th style={{ width: '12%', textAlign: 'right' }}>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map(log => (
                      <tr key={log.id} style={{ transition: 'all 0.15s ease' }}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {new Date(log.timestamp).toLocaleString('en-US', { hour12: false })}
                        </td>
                        <td style={{ fontWeight: 700, fontSize: '0.85rem' }}>{log.action}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{log.details}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                            <User size={12} style={{ color: 'var(--color-brand)' }} />
                            <span>{log.officer}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={getLogTypeBadge(log.type)}>
                            {log.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
