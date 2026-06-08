import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  Code, 
  ListTodo, 
  TrendingUp, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const RecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transactions, updateTransactionStatus } = useApp();

  const transaction = transactions.find(t => t.id === id);

  // Status override form state
  const [overrideStatus, setOverrideStatus] = useState<'Approved' | 'Flagged' | 'Denied'>('Approved');
  const [overrideReason, setOverrideReason] = useState('');
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  if (!transaction) {
    return (
      <div className="animate-fade-inCard" style={{ padding: '2rem', textAlign: 'center' }}>
        <AlertTriangle size={48} style={{ color: 'var(--color-danger)', marginBottom: '1rem' }} />
        <h2>Record Not Found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>The record with ID "{id}" could not be located.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Return to Dashboard
        </button>
      </div>
    );
  }

  // Determine current active step (ingest -> calculator -> verification -> decision)
  // For Approved/Denied we've completed all; for Flagged, we are pending final Decision Output
  const getStepStatus = (stepIndex: number) => {
    // 0: Rules Ingest, 1: Risk Calculator, 2: Verification Result, 3: Decision Output
    if (stepIndex < 3) return 'completed';
    
    // Step 3 (Decision Output) status depends on transaction status
    if (transaction.status === 'Flagged') return 'pending';
    return 'completed';
  };

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) {
      alert("Please provide a reason for the override decision.");
      return;
    }
    updateTransactionStatus(transaction.id, overrideStatus, overrideReason, "S. Henderson");
    setOverrideReason('');
    setShowSuccessMsg(true);
    setTimeout(() => setShowSuccessMsg(false), 3000);
  };

  // Rule status helper
  const getRuleBadgeClass = (status: 'PASSED' | 'FAILED' | 'CRITICAL') => {
    switch (status) {
      case 'PASSED': return 'badge approved';
      case 'FAILED': return 'badge medium';
      case 'CRITICAL': return 'badge high';
      default: return 'badge pending';
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Back link & Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-secondary)', 
            cursor: 'pointer',
            fontSize: '0.9rem',
            padding: 0,
            width: 'fit-content'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 700, margin: 0 }}>
                Analyze Record: {transaction.id}
              </h1>
              <span className={`badge ${transaction.riskRating.toLowerCase()}`} style={{ fontSize: '0.8rem' }}>
                {transaction.riskRating} RISK
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              Entity: <strong>{transaction.entityName}</strong> • Ingestion latency: {transaction.duration}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Current Status:</span>
            <span className={`badge ${transaction.status.toLowerCase()}`} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '6px' }}>
              {transaction.status}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Sequential Process Flow Tracker */}
      <div className="card glass" style={{ padding: '1.25rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          
          {/* Connector Line in Background */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50px',
            right: '50px',
            height: '2px',
            backgroundColor: 'var(--border-color)',
            zIndex: 1
          }} />

          {/* Steps */}
          {[
            { title: 'Rules Ingest', desc: 'Payload Validation' },
            { title: 'Risk Calculator', desc: 'Rules Matrix Run' },
            { title: 'Verification Result', desc: 'Pipeline Completed' },
            { title: 'Decision Output', desc: transaction.status === 'Flagged' ? 'Awaiting Manual Sign-off' : `Resolved as ${transaction.status}` }
          ].map((step, idx) => {
            const status = getStepStatus(idx);
            let circleColor = 'var(--bg-tertiary)';
            let textColor = 'var(--text-muted)';
            let titleColor = 'var(--text-secondary)';

            if (status === 'completed') {
              circleColor = 'var(--color-brand)';
              titleColor = 'var(--text-primary)';
              textColor = 'var(--color-brand)';
            } else if (status === 'pending') {
              circleColor = 'var(--color-warning)';
              titleColor = 'var(--text-primary)';
              textColor = 'var(--color-warning)';
            }

            return (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  zIndex: 2, 
                  textAlign: 'center',
                  width: '180px'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '2px solid',
                  borderColor: circleColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: titleColor,
                  marginBottom: '0.5rem',
                  boxShadow: (status as string) !== 'bypassed' ? '0 0 10px rgba(139, 92, 246, 0.1)' : 'none'
                }}>
                  {status === 'completed' ? '✓' : idx + 1}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: titleColor }}>{step.title}</span>
                <span style={{ fontSize: '0.7rem', color: textColor, marginTop: '0.15rem' }}>{step.desc}</span>
              </div>
            );
          })}

        </div>
      </div>

      {/* Main Grid: Data Columns */}
      <div className="grid-cols-2" style={{ gridTemplateColumns: '70% 30%', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: Details, Rules Executed, and Side-by-side JSONs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Action: Analyst Override Form */}
          <div className="card glass" style={{ border: '1px solid var(--color-brand-glow)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={18} style={{ color: 'var(--color-brand)' }} />
              Analyst Verification Panel
            </h2>

            {showSuccessMsg && (
              <div style={{
                backgroundColor: 'var(--color-success-bg)',
                border: '1px solid var(--color-success-border)',
                color: 'var(--color-success)',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                Decision override updated successfully! Audit log registered.
              </div>
            )}

            <form onSubmit={handleApplyOverride} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>DISPOSITION DECISION</label>
                  <select 
                    className="select-input"
                    value={overrideStatus}
                    onChange={(e) => setOverrideStatus(e.target.value as any)}
                    style={{ width: '180px' }}
                  >
                    <option value="Approved">Approved (Clear)</option>
                    <option value="Flagged">Flagged (Investigating)</option>
                    <option value="Denied">Denied (Block)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>JUSTIFICATION / REMARKS</label>
                  <input 
                    type="text" 
                    className="text-input"
                    placeholder="Enter audit trailing verification notes..."
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    style={{ width: '100%', paddingLeft: '1rem' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-end', height: '38px', padding: '0 1.5rem' }}
                >
                  Submit Decision
                </button>
              </div>
            </form>
          </div>

          {/* Rules Executed Logs */}
          <div className="card glass">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ListTodo size={18} style={{ color: 'var(--color-brand)' }} />
              Executed Pipeline Rules ({transaction.rules.length})
            </h2>

            <div className="table-container" style={{ border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Rule ID</th>
                    <th>Rule Name</th>
                    <th>Category</th>
                    <th>Duration</th>
                    <th style={{ textAlign: 'right' }}>Execution Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.rules.map((rule) => (
                    <tr key={rule.id}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {rule.id}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{rule.name}</td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{rule.category}</span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {rule.duration}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={getRuleBadgeClass(rule.status)}>
                          {rule.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side-by-side JSONs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={18} style={{ color: 'var(--color-brand)' }} />
              Payload Comparison Viewer
            </h2>
            
            <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
              
              {/* Input JSON Viewer */}
              <div className="card glass" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>INPUT DATA (INGEST PAYLOAD)</span>
                <pre style={{
                  margin: 0,
                  padding: '1rem',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  overflowX: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: '#93c5fd',
                  maxHeight: '300px',
                  lineHeight: '1.4'
                }}>
                  <code>{transaction.inputPayload}</code>
                </pre>
              </div>

              {/* Output JSON Viewer */}
              <div className="card glass" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>OUTPUT DATA (DECISION RESULT)</span>
                <pre style={{
                  margin: 0,
                  padding: '1rem',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  overflowX: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: '#c084fc',
                  maxHeight: '300px',
                  lineHeight: '1.4'
                }}>
                  <code>{transaction.outputPayload}</code>
                </pre>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Timeline Panel */}
        <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--color-brand)' }} />
            Audit Timeline Feed
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1rem' }}>
            
            {/* Timeline vertical bar */}
            <div style={{
              position: 'absolute',
              top: '8px',
              bottom: '8px',
              left: '4px',
              width: '2px',
              backgroundColor: 'var(--border-color)'
            }} />

            {/* Timeline Nodes */}
            {transaction.timeline.map((event, idx) => (
              <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {/* Node dot icon */}
                <div style={{
                  position: 'absolute',
                  left: '-19px',
                  top: '4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--color-brand)',
                  zIndex: 2
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{event.title}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{event.time}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                  {event.description}
                </span>
              </div>
            ))}

          </div>
        </div>

      </div>

    </div>
  );
};
