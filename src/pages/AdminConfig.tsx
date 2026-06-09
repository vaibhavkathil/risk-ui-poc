import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  Settings, 
  Layers, 
  Activity, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const AdminConfig: React.FC = () => {
  const { stages, ruleActivations, toggleStage, toggleRule } = useApp();
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  // Helper to get rule type color / styling badge
  const getTypeColor = (type: 'JSON' | 'DB' | 'AI' | 'API') => {
    switch (type) {
      case 'AI': return { bg: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-brand)', border: 'rgba(139, 92, 246, 0.2)' };
      case 'API': return { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-info)', border: 'rgba(59, 130, 246, 0.2)' };
      case 'DB': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', border: 'rgba(245, 158, 11, 0.2)' };
      case 'JSON': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', border: 'rgba(16, 185, 129, 0.2)' };
      default: return { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: 'var(--border-color)' };
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Settings size={28} style={{ color: 'var(--color-brand)' }} />
            Risk Pipeline Configuration
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Configure KYC evaluation stages and toggle specific rules in the risk assessment matrix.
          </p>
        </div>
      </div>

      {/* Dual Column Layout */}
      <div className="grid-cols-2" style={{ gridTemplateColumns: '35% 65%', gap: '2rem' }}>
        
        {/* Left Column: Stages Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card glass" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Layers size={18} style={{ color: 'var(--color-brand)' }} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Pipeline Stages</h2>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Disable stages to bypass specific verification modules. Bypassed stages skip all child rule calculations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
               {stages.map((stage) => (
                 <div 
                   key={stage.id}
                   style={{
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'space-between',
                     padding: '0.75rem 1rem',
                     backgroundColor: selectedStageId === stage.id ? 'var(--bg-tertiary)' : 'rgba(255, 255, 255, 0.01)',
                     border: '1px solid',
                     borderColor: selectedStageId === stage.id ? 'var(--color-brand)' : 'var(--border-color)',
                     borderRadius: '8px',
                     cursor: 'pointer',
                     transition: 'all 0.2s ease',
                   }}
                   onClick={() => setSelectedStageId(stage.id)}
                 >
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     {/* Custom Checkbox */}
                     <input 
                       type="checkbox" 
                       checked={stage.isActive}
                       disabled={stage.isMandatory}
                       onChange={(e) => {
                         e.stopPropagation();
                         if (!stage.isMandatory) toggleStage(stage.id);
                       }}
                       style={{ 
                         cursor: stage.isMandatory ? 'not-allowed' : 'pointer',
                         width: '16px',
                         height: '16px',
                         accentColor: 'var(--color-brand)'
                       }}
                     />
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                       <span style={{ 
                         fontSize: '0.875rem', 
                         fontWeight: 600,
                         color: stage.isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                         textDecoration: stage.isActive ? 'none' : 'line-through'
                       }}>
                         {stage.name}
                       </span>
                       <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                         {stage.rulesCount} Rules • {stage.responsibility}
                       </span>
                     </div>
                   </div>

                   <span style={{
                     fontSize: '0.7rem',
                     padding: '0.15rem 0.45rem',
                     borderRadius: '4px',
                     fontWeight: 700,
                     backgroundColor: stage.isMandatory 
                       ? 'var(--color-brand-glow)' 
                       : stage.isActive 
                         ? 'var(--color-success-bg)' 
                         : 'var(--bg-tertiary)',
                     color: stage.isMandatory 
                       ? 'var(--color-brand)' 
                       : stage.isActive 
                         ? 'var(--color-success)' 
                         : 'var(--text-muted)',
                     border: '1px solid',
                     borderColor: stage.isMandatory 
                       ? 'rgba(139, 92, 246, 0.25)' 
                       : stage.isActive 
                         ? 'var(--color-success-border)' 
                         : 'var(--border-color)',
                   }}>
                     {stage.isMandatory ? 'MANDATORY' : stage.isActive ? 'ENABLED' : 'BYPASSED'}
                   </span>
                 </div>
               ))}
             </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="card glass">
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={16} style={{ color: 'var(--color-info)' }} />
              Live Deployment Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Active Compliance Modules:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>
                  {stages.filter(s => s.isActive).length} / {stages.length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Active Rule Evaluators:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-brand)' }}>
                  {ruleActivations.filter(r => r.isActive).length} / {ruleActivations.length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Last Config Edit:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Just now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Rule Activation Matrix */}
        <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--color-brand)' }} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Rule Activation Matrix</h2>
            </div>
            {selectedStageId && (
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                onClick={() => setSelectedStageId(null)}
              >
                Clear Filter
              </button>
            )}
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Activate/Deactivate specific rules executed by target nodes. Rules belonging to bypassed stages will not be run regardless of their status here.
          </p>

          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '0.75rem' }}>Stage Group</th>
                  <th>Rule ID</th>
                  <th>Rule Name</th>
                  <th>Evaluator Type</th>
                  <th>State</th>
                  <th style={{ textAlign: 'right' }}>Toggle</th>
                </tr>
              </thead>
              <tbody>
                {stages
                  .filter(stage => !selectedStageId || stage.id === selectedStageId)
                  .map(stage => {
                    const rulesInStage = ruleActivations.filter(r => r.stageId === stage.id);
                    
                    if (rulesInStage.length === 0) {
                      return (
                        <tr key={`empty-${stage.id}`} style={{ opacity: stage.isActive ? 0.8 : 0.4 }}>
                          <td colSpan={6} style={{ padding: '0.75rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span>{stage.name}</span>
                              <span>•</span>
                              <span>No registered rule validations on this stage.</span>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return rulesInStage.map((rule, idx) => {
                      const typeStyle = getTypeColor(rule.type);
                      const isCascadedInactive = !stage.isActive;

                      return (
                        <tr 
                          key={rule.id}
                          style={{
                            opacity: isCascadedInactive ? 0.4 : 1,
                            backgroundColor: isCascadedInactive ? 'rgba(239, 68, 68, 0.01)' : 'transparent',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {idx === 0 && (
                            <td 
                              rowSpan={rulesInStage.length}
                              style={{
                                verticalAlign: 'top',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                color: stage.isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                borderRight: '1px solid var(--border-color)',
                                padding: '0.75rem',
                                width: '22%'
                              }}
                            >
                              {stage.name}
                              {isCascadedInactive && (
                                <div style={{ fontSize: '0.65rem', color: 'var(--color-danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                                  <AlertCircle size={10} /> BYPASSED
                                </div>
                              )}
                            </td>
                          )}
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '0.75rem' }}>
                            {rule.id}
                          </td>
                          <td style={{ fontWeight: 600, fontSize: '0.85rem', padding: '0.75rem' }}>
                            {rule.name}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              display: 'inline-flex',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              backgroundColor: typeStyle.bg,
                              color: typeStyle.color,
                              border: '1px solid',
                              borderColor: typeStyle.border
                            }}>
                              {rule.type}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: rule.isActive && stage.isActive ? 'var(--color-success)' : 'var(--text-muted)'
                            }}>
                              {rule.isActive && stage.isActive ? 'ACTIVE' : isCascadedInactive ? 'CASCADED' : 'INACTIVE'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                              <input 
                                type="checkbox" 
                                checked={rule.isActive}
                                disabled={isCascadedInactive}
                                onChange={() => toggleRule(rule.id)}
                                style={{
                                  cursor: isCascadedInactive ? 'not-allowed' : 'pointer',
                                  width: '15px',
                                  height: '15px',
                                  accentColor: 'var(--color-brand)'
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })}
              </tbody>
            </table>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginTop: 'auto'
          }}>
            <HelpCircle size={16} style={{ color: 'var(--color-info)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <strong>Rule Types Description:</strong> <strong>AI</strong> denotes neural network classification. <strong>API</strong> triggers remote microservices. <strong>DB</strong> runs query checks. <strong>JSON</strong> evaluates structural matching constraints.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
