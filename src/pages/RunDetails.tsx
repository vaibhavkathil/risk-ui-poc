import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  StopCircle, 
  Play, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Layers
} from 'lucide-react';

export const RunDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { runs, startRun, cancelRun } = useApp();

  const run = runs.find(r => r.id === id);

  if (!run) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: 'var(--color-danger)' }}>Pipeline Run Not Found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>The requested run ID does not exist in the active registry.</p>
        <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/runs')}>
          <ArrowLeft size={16} /> Return to Pipelines
        </button>
      </div>
    );
  }

  const handleAction = () => {
    if (run.status === 'running') {
      cancelRun(run.id, "Sarah Jenkins");
    } else {
      startRun(run.id, "Sarah Jenkins");
    }
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(run, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rod-run-${run.id}-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Calculations for outcome meters
  const totalItems = run.outcomes.approved + run.outcomes.flagged + run.outcomes.denied || 1;
  const approvedPct = Math.round((run.outcomes.approved / totalItems) * 100);
  const flaggedPct = Math.round((run.outcomes.flagged / totalItems) * 100);
  const deniedPct = Math.round((run.outcomes.denied / totalItems) * 100);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Back button and Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem', borderRadius: '50%', width: '38px', height: '38px', justifyContent: 'center' }} 
            onClick={() => navigate('/runs')}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-brand)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                {run.id}
              </span>
              <span style={{
                display: 'inline-flex',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                backgroundColor: run.status === 'completed' ? 'var(--color-success-bg)' : run.status === 'failed' ? 'var(--color-danger-bg)' : run.status === 'running' ? 'rgba(139,92,246,0.1)' : 'var(--bg-tertiary)',
                color: run.status === 'completed' ? 'var(--color-success)' : run.status === 'failed' ? 'var(--color-danger)' : run.status === 'running' ? 'var(--color-brand)' : 'var(--text-secondary)'
              }}>
                {run.status}
              </span>
            </div>
            <h1 style={{ fontWeight: 700, margin: '0.15rem 0 0 0', fontSize: '1.85rem' }}>{run.name}</h1>
          </div>
        </div>

        {/* Action Panel */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleDownload}>
            <Download size={16} /> Download Report
          </button>
          
          {run.status === 'running' ? (
            <button className="btn btn-danger" onClick={handleAction}>
              <StopCircle size={16} /> Stop Pipeline
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleAction}>
              {run.status === 'ready' ? <Play size={16} fill="white" /> : <RefreshCw size={16} />}
              {run.status === 'ready' ? 'Start Run' : 'Re-run'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content split layout */}
      <div className="grid-cols-2">
        
        {/* Left Hand: Stats and Outcomes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Ingestion & Processing Summary */}
          <div className="card">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={16} style={{ color: 'var(--color-brand)' }} />
              Processing Summary
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.9rem' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Total Items Parsed</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{run.processedItems.toLocaleString()}</div>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Overall Success Rate</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: run.successRate >= 90 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {run.successRate}%
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Operator In Charge</div>
                <div style={{ fontWeight: 500 }}>{run.owner}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Execution Trigger</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formatDate(run.submittedAt)}</div>
              </div>
            </div>
          </div>

          {/* Outcome Breakdown Progress Cards */}
          <div className="card">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem' }}>Calculated Outcome Breakdown</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Approved */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Approved Automatically</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{run.outcomes.approved.toLocaleString()} ({approvedPct}%)</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                  <div style={{ width: `${approvedPct}%`, height: '100%', backgroundColor: 'var(--color-success)' }} />
                </div>
              </div>

              {/* Flagged */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Flagged (Manual Verification Required)</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>{run.outcomes.flagged.toLocaleString()} ({flaggedPct}%)</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                  <div style={{ width: `${flaggedPct}%`, height: '100%', backgroundColor: 'var(--color-warning)' }} />
                </div>
              </div>

              {/* Denied */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Denied (Compliance Breach Lock)</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>{run.outcomes.denied.toLocaleString()} ({deniedPct}%)</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                  <div style={{ width: `${deniedPct}%`, height: '100%', backgroundColor: 'var(--color-danger)' }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Hand: Sub-execution logs checklist */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={16} style={{ color: 'var(--color-brand)' }} />
              Sub-execution Pipelines Checklist
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {run.steps.map((step) => (
                <div key={step.id} style={{ 
                  display: 'flex', 
                  gap: '0.75rem', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '8px', 
                  padding: '0.85rem 1rem', 
                  backgroundColor: 'var(--bg-tertiary)',
                  opacity: step.status === 'pending' ? 0.5 : 1
                }}>
                  <div style={{ marginTop: '0.15rem' }}>
                    {step.status === 'succeeded' && <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />}
                    {step.status === 'failed' && <XCircle size={18} style={{ color: 'var(--color-danger)' }} />}
                    {step.status === 'running' && (
                      <span style={{
                        display: 'block',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: '2px solid rgba(139,92,246,0.3)',
                        borderTopColor: 'var(--color-brand)',
                        animation: 'spin 1s linear infinite'
                      }}>
                        <style dangerouslySetInnerHTML={{__html: `
                          @keyframes spin { to { transform: rotate(360deg); } }
                        `}} />
                      </span>
                    )}
                    {step.status === 'pending' && (
                      <span style={{ display: 'block', width: '18px', height: '18px', borderRadius: '50%', border: '2px dashed var(--text-muted)' }} />
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{step.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{step.duration}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: 0 }}>
                      {step.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
};
