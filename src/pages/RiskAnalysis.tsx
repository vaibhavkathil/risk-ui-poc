import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { Search, Globe, Code } from 'lucide-react';

export const RiskAnalysis: React.FC = () => {
  const { records } = useApp();
  const navigate = useNavigate();

  // Search/Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'flagged' | 'denied'>('all');

  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0 }}>Risk Analysis</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Inspect rule outcomes, risk calculation details, and audit comparison payloads for evaluated accounts.
          </p>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div className="input-container" style={{ flex: 1, minWidth: '280px' }}>
          <Search className="input-icon" />
          <input
            type="text"
            className="text-input"
            style={{ width: '100%' }}
            placeholder="Search by Record Ref ID, customer name, source country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {(['all', 'approved', 'flagged', 'denied'] as const).map(status => (
            <button
              key={status}
              className="btn"
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: statusFilter === status ? 'var(--bg-secondary)' : 'transparent',
                color: statusFilter === status ? 'var(--text-primary)' : 'var(--text-secondary)',
                textTransform: 'capitalize'
              }}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Record Index Table */}
      <div className="table-container shadow-lg">
        {filteredRecords.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No records matched the query parameters.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: '18%' }}>Record Ref ID</th>
                <th style={{ width: '22%' }}>Customer Name</th>
                <th style={{ width: '15%' }}>Jurisdiction</th>
                <th style={{ width: '12%' }}>Tx Size (Est)</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Risk Rating</th>
                <th style={{ width: '13%' }}>Status</th>
                <th style={{ width: '10%' }} />
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/debug/${r.id}`)}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-brand)' }}>
                      {r.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>{r.fullName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.email}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                      <Globe size={14} style={{ color: 'var(--text-muted)' }} />
                      <span>{r.country}</span>
                    </div>
                  </td>
                  <td><span style={{ fontWeight: 500 }}>{formatCurrency(r.transactionSize)}</span></td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: r.riskRating >= 75 ? 'var(--color-danger)' : r.riskRating >= 40 ? 'var(--color-warning)' : 'var(--color-success)'
                    }}>
                      {r.riskRating.toFixed(1)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>/100</span>
                  </td>
                  <td>
                    <span className={`badge ${r.status}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', gap: '0.35rem' }}
                      title="Inspect Rules Logic"
                    >
                      <Code size={12} /> Debug
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', padding: '0 0.5rem' }}>
        <span>Showing {filteredRecords.length} of {records.length} total evaluations</span>
        <span>Secure risk assessment database</span>
      </div>

    </div>
  );
};
