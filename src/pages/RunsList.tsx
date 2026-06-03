import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { Search, Play, StopCircle, RefreshCw, AlertCircle } from 'lucide-react';

export const RunsList: React.FC = () => {
  const { runs, startRun, cancelRun } = useApp();
  const navigate = useNavigate();

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ready' | 'running' | 'completed' | 'failed' | 'cancelled'>('all');

  const handleAction = (e: React.MouseEvent, runId: string, status: string) => {
    e.stopPropagation(); // Avoid triggering row click navigation
    if (status === 'running') {
      cancelRun(runId, "Sarah Jenkins");
    } else {
      startRun(runId, "Sarah Jenkins");
    }
  };

  const filteredRuns = runs.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const readyForBulkCount = runs.filter(r => r.status === 'ready').length;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0 }}>Risk On Demand</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage execution runs and automated testing pipelines for the risk calculation engines.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} /> Sync Engine
          </button>
        </div>
      </div>

      {/* Bulk operation alert banner */}
      {readyForBulkCount > 0 && (
        <div className="card glass" style={{
          padding: '1rem 1.5rem',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          backgroundColor: 'rgba(59, 130, 246, 0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} style={{ color: '#60a5fa' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              FILTERED: <strong>{readyForBulkCount} run{readyForBulkCount > 1 ? 's' : ''}</strong> ready for manual bulk operation execution.
            </span>
          </div>
          <button 
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', backgroundColor: '#3b82f6' }}
            onClick={() => runs.filter(r => r.status === 'ready').forEach(r => startRun(r.id, "Sarah Jenkins"))}
          >
            Bulk Start Runs
          </button>
        </div>
      )}

      {/* Filter toolbar */}
      <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="input-container" style={{ flex: 1, minWidth: '280px' }}>
          <Search className="input-icon" />
          <input
            type="text"
            className="text-input"
            style={{ width: '100%' }}
            placeholder="Search by Run ID, job name, owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {(['all', 'ready', 'running', 'completed', 'failed', 'cancelled'] as const).map(status => (
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

      {/* Execution table */}
      <div className="table-container shadow-lg">
        {filteredRuns.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No pipelines found matching the filters.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Run ID</th>
                <th style={{ width: '15%' }}>Status</th>
                <th style={{ width: '25%' }}>Pipeline Job Name</th>
                <th style={{ width: '12%' }}>Owner</th>
                <th style={{ width: '15%' }}>Submitted At</th>
                <th style={{ width: '8%' }}>Runtime</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Trigger Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRuns.map((r) => (
                <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/runs/${r.id}`)}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-brand)' }}>
                      {r.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: r.status === 'completed' ? 'var(--color-success)' : r.status === 'failed' ? 'var(--color-danger)' : r.status === 'running' ? 'var(--color-brand)' : r.status === 'ready' ? 'var(--color-warning)' : 'var(--text-muted)'
                      }} />
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        color: r.status === 'completed' ? 'var(--color-success)' : r.status === 'failed' ? 'var(--color-danger)' : r.status === 'running' ? 'var(--color-brand)' : r.status === 'ready' ? 'var(--color-warning)' : 'var(--text-muted)'
                      }}>
                        {r.status === 'ready' ? 'Ready to Run' : r.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.name}</span>
                    {r.status === 'running' && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        Processed {r.processedItems.toLocaleString()} items ({r.successRate}% Success)
                      </div>
                    )}
                  </td>
                  <td><span style={{ fontSize: '0.85rem' }}>{r.owner}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formatDate(r.submittedAt)}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{r.runtime}</td>
                  <td style={{ textAlign: 'center' }}>
                    {r.status === 'ready' && (
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px' }}
                        onClick={(e) => handleAction(e, r.id, r.status)}
                      >
                        <Play size={12} fill="white" /> Start
                      </button>
                    )}
                    {r.status === 'running' && (
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px' }}
                        onClick={(e) => handleAction(e, r.id, r.status)}
                      >
                        <StopCircle size={12} /> Stop
                      </button>
                    )}
                    {(r.status === 'completed' || r.status === 'failed' || r.status === 'cancelled') && (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px' }}
                        onClick={(e) => handleAction(e, r.id, r.status)}
                      >
                        <RefreshCw size={12} /> Rerun
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};
