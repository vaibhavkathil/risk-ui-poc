import React, { useState } from 'react';
import { 
  Rocket, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Zap,
  Info,
  Layers
} from 'lucide-react';

interface RolloutTask {
  id: string;
  name: string;
  category: 'Infrastructure' | 'LLM & Guardrails' | 'Operations';
  status: 'completed' | 'in-progress' | 'planned';
  description: string;
}

export const RolloutThoughts: React.FC = () => {
  // Mock rollout tasks to show interaction
  const [tasks, setTasks] = useState<RolloutTask[]>([
    {
      id: 'task-1',
      name: 'Central Risk Router deployment',
      category: 'Infrastructure',
      status: 'completed',
      description: 'Deploy core orchestration engine and agent routing graph in staging.'
    },
    {
      id: 'task-2',
      name: 'Agentic guardrails integration',
      category: 'LLM & Guardrails',
      status: 'completed',
      description: 'Configure input/output validators and LLM Gateway safety buffers.'
    },
    {
      id: 'task-3',
      name: 'Risk On Demand API validation',
      category: 'Operations',
      status: 'in-progress',
      description: 'Run automated end-to-end integration tests for ROD analyst runs.'
    },
    {
      id: 'task-4',
      name: 'Shadow routing activation',
      category: 'Infrastructure',
      status: 'planned',
      description: 'Mirror 10% of live KYC traffic to the new Risk Engine for validation.'
    },
    {
      id: 'task-5',
      name: 'SRE observability hooks',
      category: 'Infrastructure',
      status: 'planned',
      description: 'Expose tracing tags and audit log pipeline endpoints for SRE dashboard.'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'in-progress' | 'planned'>('all');

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus: Record<RolloutTask['status'], RolloutTask['status']> = {
          'completed': 'planned',
          'planned': 'in-progress',
          'in-progress': 'completed'
        };
        return { ...t, status: nextStatus[t.status] };
      }
      return t;
    }));
  };

  const filteredTasks = tasks.filter(t => activeTab === 'all' || t.status === activeTab);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Rocket style={{ color: 'var(--color-brand)' }} />
            <span>Rollout Thoughts</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Evolutionary design notes, transition strategies, and milestones for migrating to the KYC Risk Engine.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge pending" style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem' }}>
            <Calendar size={13} style={{ marginRight: '0.25rem' }} />
            Target: Q3 2026
          </span>
        </div>
      </div>

      {/* Main Grid: Info Sidebar & Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }} className="grid-cols-2">
        
        {/* Left Side: Rollout Strategy & Snippets Placeholder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Showcase Panel for snippets */}
          <div className="card glass" style={{ borderLeft: '4px solid var(--color-brand)', position: 'relative', overflow: 'hidden' }}>
            {/* Ambient Background Glow */}
            <div style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, var(--color-brand-glow) 0%, transparent 70%)',
              pointerEvents: 'none',
              filter: 'blur(30px)'
            }} />
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 0, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--color-brand)' }} />
              Release Snippets & Strategy Notes
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              We are staging the rollout of our multi-agent orchestration grid to balance risk accuracy, throughput, and system reliability. Below is where we will map out your specific release thoughts.
            </p>

            {/* Premium Placeholder State */}
            <div style={{
              border: '1px dashed var(--border-color-active)',
              borderRadius: '8px',
              padding: '2rem 1.5rem',
              backgroundColor: 'rgba(255,255,255,0.01)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-brand)'
              }}>
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.25rem 0' }}>Share Your Release Thoughts</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '320px', margin: 0 }}>
                  Paste your notes, snippets, or bullet points in the chat, and we will structure them into interactive visuals, diagrams, and bulleted release schedules right here.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Checklist section */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>Release Target Checklist</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0.15rem 0 0 0' }}>
                  Click items to cycle statuses (Completed → Planned → In Progress).
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: '6px' }}>
                {(['all', 'completed', 'in-progress', 'planned'] as const).map(tab => (
                  <button
                    key={tab}
                    className="btn"
                    style={{
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.75rem',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: activeTab === tab ? 'var(--bg-secondary)' : 'transparent',
                      color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                      textTransform: 'capitalize'
                    }}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTaskStatus(task.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-brand)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ marginTop: '0.15rem' }}>
                    {task.status === 'completed' && <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />}
                    {task.status === 'in-progress' && <Zap size={16} style={{ color: 'var(--color-warning)' }} />}
                    {task.status === 'planned' && <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--text-muted)' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{task.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {task.category}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                      {task.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Rollout Roadmap Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Timeline Panel */}
          <div className="card">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} style={{ color: 'var(--color-brand)' }} />
              Migration Phases
            </h2>

            {/* Timeline Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '0.5rem' }}>
              {/* Vertical line connection */}
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '12px',
                bottom: '12px',
                width: '2px',
                backgroundColor: 'var(--border-color)',
                zIndex: 1
              }} />

              {/* Step 1 */}
              <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  marginTop: '0.15rem'
                }}>✓</div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)', textTransform: 'uppercase' }}>Phase 1: Architecture Blueprint</span>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0.1rem 0 0.25rem 0' }}>Core Schema & Router Flow</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', margin: 0 }}>
                    Define the agent graph boundaries, schema validators, context memory mechanisms, and fallback pipelines.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  marginTop: '0.15rem',
                  boxShadow: '0 0 8px var(--color-brand)'
                }}>2</div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-brand)', textTransform: 'uppercase' }}>Phase 2: Hybrid Verification</span>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0.1rem 0 0.25rem 0' }}>Shadow Running & ROD</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', margin: 0 }}>
                    Deploy AI Risk Agent networks in shadow mode alongside legacy engines to compare rule-matching matrices.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '2px solid var(--border-color-active)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  marginTop: '0.15rem'
                }}>3</div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phase 3: Full Cutover</span>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0.1rem 0 0.25rem 0' }}>Production Live Orgs</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', margin: 0 }}>
                    Route all global customer onboarding and KYC risk scoring requests directly to the agent-driven decision framework.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats or Design philosophy */}
          <div className="card" style={{ backgroundColor: 'rgba(59, 130, 246, 0.03)', borderColor: 'var(--color-info-border)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Info size={15} style={{ color: 'var(--color-info)' }} />
              <span>Migration Philosophy</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
              "Always prioritize business continuity. The risk matrix evaluation must fail-safe back to standard rules if LLM gateway response times exceed SLAs."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
