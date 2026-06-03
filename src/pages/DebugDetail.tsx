import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  Code, 
  Server, 
  Terminal,
  ShieldCheck,
  UserCheck,
  Layers,
  TrendingUp,
  Info,
  CheckCircle,
  MessageSquare,
  Send,
  Bot,
  User
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  senderName: string;
  text: string;
  timestamp: string;
}

export const DebugDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { records, updateRecordStatus } = useApp();

  const record = records.find(r => r.id === id);

  // Layout Tab State: 'explanation' (Result Explanation), 'debugger' (Technical Debugger), 'discussion' (Agent Discussion)
  const [activeTab, setActiveTab] = useState<'explanation' | 'debugger' | 'discussion'>('explanation');

  // Manual override states
  const [overrideNotes, setOverrideNotes] = useState('');
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState<'approved' | 'flagged' | 'denied'>('approved');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Populate initial chat context when record changes
  useEffect(() => {
    if (!record) return;

    let initialMsgs: ChatMessage[] = [];
    if (record.id === 'REF-983012-Y') {
      initialMsgs = [
        {
          id: '1',
          sender: 'agent',
          senderName: 'RiskEngine AI',
          text: `Hi Sarah, I've performed a deep-dive analysis on Alexander Wright's record (REF-983012-Y). The primary driver of the 82.5 score is a PEP match on the WorldCheck database, combined with a secondary offshore outflow check ($245k to Cayman Islands).`,
          timestamp: new Date(Date.now() - 60000 * 5).toISOString()
        },
        {
          id: '2',
          sender: 'agent',
          senderName: 'RiskEngine AI',
          text: `Note: The PEP hit matches the name 'Alexander Wright', who is a regional councillor in the UK. However, the councillor's profile birth year is 1956, whereas our customer was born in 1984. This appears to be a false positive name match.`,
          timestamp: new Date(Date.now() - 60000 * 4).toISOString()
        }
      ];
    } else if (record.id === 'REF-409122-C') {
      initialMsgs = [
        {
          id: '1',
          sender: 'agent',
          senderName: 'RiskEngine AI',
          text: `Warning: Marcus Aurelius Vance (REF-409122-C) has triggered OFAC Sanctions Hit (RULE_SANCTION_HIT) with a 95.0 critical rating. The ingest payload lists the destination country as Panama with a $1.2M transaction size.`,
          timestamp: new Date(Date.now() - 60000 * 5).toISOString()
        },
        {
          id: '2',
          sender: 'agent',
          senderName: 'RiskEngine AI',
          text: `I recommend keeping this compliance lock active. High-risk offshore transactions from PEP-associated sanction aliases violate international money laundering guidelines.`,
          timestamp: new Date(Date.now() - 60000 * 4).toISOString()
        }
      ];
    } else {
      initialMsgs = [
        {
          id: '1',
          sender: 'agent',
          senderName: 'RiskEngine AI',
          text: `Hello, I am ready to discuss this record verification. It is currently marked as ${record.status.toUpperCase()} with a calculated score of ${record.riskRating.toFixed(1)}.`,
          timestamp: new Date(Date.now() - 60000 * 2).toISOString()
        }
      ];
    }

    setMessages(initialMsgs);
  }, [record]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!record) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: 'var(--color-danger)' }}>Record File Not Found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>The requested record reference does not exist in our compliance index.</p>
        <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/analysis')}>
          <ArrowLeft size={16} /> Return to Search
        </button>
      </div>
    );
  }

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideNotes.trim()) {
      alert("Please enter override notes.");
      return;
    }
    updateRecordStatus(record.id, overrideStatus, overrideNotes, "Sarah Jenkins");
    setSuccessBanner(`Manual override applied. Record ${record.id} status is now ${overrideStatus.toUpperCase()}.`);
    setShowOverrideForm(false);
    setOverrideNotes('');
    setTimeout(() => {
      setSuccessBanner(null);
    }, 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: 'Sarah Jenkins',
      text: chatInput,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    const question = chatInput.toLowerCase();
    setChatInput('');
    setIsTyping(true);

    // Simulate Agent response
    setTimeout(() => {
      let replyText = '';
      
      if (record.id === 'REF-983012-Y') {
        if (question.includes('pep') || question.includes('councillor') || question.includes('match')) {
          replyText = "Yes, checking the birth dates: the WorldCheck PEP registry records British politician Alexander Wright born July 24, 1956. Our client's passport file records birth date November 12, 1984. I can confirm this PEP match is a false positive due to name similarity.";
        } else if (question.includes('override') || question.includes('approve') || question.includes('clear')) {
          replyText = "Since the PEP match is confirmed false positive and the offshore destination (Cayman Islands) matches a pre-disclosed wealth declaration document on files, you can safely override the verdict to 'Approved' with notes highlighting these checks.";
        } else {
          replyText = "I suggest reviewing the PEP birth date discrepancies. Let me know if you would like me to extract the full WorldCheck registry reference or passport OCR details.";
        }
      } else if (record.id === 'REF-409122-C') {
        if (question.includes('override') || question.includes('approve') || question.includes('bypass')) {
          replyText = "Bypassing this check is not recommended. Direct hit on OFAC Specially Designated Nationals (SDN) registry. Allowing this transaction size ($1.2M) presents extreme compliance liabilities and legal penalties.";
        } else {
          replyText = "The system output shows direct match on Marcus Vance alias within OFAC registers. I recommend keeping the compliance lock active and generating an SAR report (Suspicious Activity Report) for review.";
        }
      } else {
        replyText = `Understood. The record matches low-risk operational standards (Score: ${record.riskRating}). The verification checklist has passed automatically. Let me know if you need specific parameter analysis.`;
      }

      const agentReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        senderName: 'RiskEngine AI',
        text: replyText,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, agentReply]);
      setIsTyping(false);
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'var(--color-danger)';
    if (score >= 40) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  const l1Rules = record.rulesFired.filter(rule => rule.category === 'identity');
  const l2Rules = record.rulesFired.filter(rule => rule.category !== 'identity');

  const computedL1Sum = l1Rules.reduce((sum, r) => sum + r.score, 0);
  const computedL2Sum = l2Rules.reduce((sum, r) => sum + r.score, 0);

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Back button and Record header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem', borderRadius: '50%', width: '38px', height: '38px', justifyContent: 'center' }} 
            onClick={() => navigate('/analysis')}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-brand)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                RECORD REFS // {record.id}
              </span>
              <span className={`badge ${record.status}`}>{record.status}</span>
            </div>
            <h1 style={{ fontWeight: 700, margin: '0.15rem 0 0 0', fontSize: '1.85rem' }}>{record.fullName}</h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowOverrideForm(true)}>
            <UserCheck size={16} /> Manual Override
          </button>
        </div>
      </div>

      {/* Success banner */}
      {successBanner && (
        <div className="card glass animate-fade-in" style={{ borderColor: 'var(--color-success)', padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{successBanner}</span>
        </div>
      )}

      {/* Screen Tabs Selector */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid var(--border-color)', 
        marginBottom: '0.5rem',
        gap: '1.5rem'
      }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'explanation' ? '2px solid var(--color-brand)' : '2px solid transparent',
            color: activeTab === 'explanation' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '1rem',
            fontWeight: 600,
            paddingBottom: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveTab('explanation')}
        >
          <TrendingUp size={18} />
          Result Explanation
        </button>
        
        <button
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'debugger' ? '2px solid var(--color-brand)' : '2px solid transparent',
            color: activeTab === 'debugger' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '1rem',
            fontWeight: 600,
            paddingBottom: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveTab('debugger')}
        >
          <Code size={18} />
          KYC Debugger
        </button>

        <button
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'discussion' ? '2px solid var(--color-brand)' : '2px solid transparent',
            color: activeTab === 'discussion' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '1rem',
            fontWeight: 600,
            paddingBottom: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveTab('discussion')}
        >
          <MessageSquare size={18} />
          Agent Discussion
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-danger)',
            alignSelf: 'flex-start'
          }} />
        </button>
      </div>

      {/* TAB 1: RESULT EXPLANATION */}
      {activeTab === 'explanation' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header indicator */}
          <div className="card glass" style={{ borderColor: getScoreColor(record.riskRating), backgroundColor: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: getScoreColor(record.riskRating),
                boxShadow: `0 0 10px ${getScoreColor(record.riskRating)}`
              }} />
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Decision recommendation</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: getScoreColor(record.riskRating), textTransform: 'uppercase' }}>
                  {record.status === 'flagged' ? 'FLAGGED FOR REVIEW' : record.status === 'denied' ? 'DENIED' : 'APPROVED'}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Calculation output:</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {record.riskRating.toFixed(1)} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ 100</span>
              </div>
            </div>
          </div>

          {/* Visual scoring calculation tree hierarchy */}
          <div className="card" style={{ padding: '2rem 1.5rem', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={16} style={{ color: 'var(--color-brand)' }} />
              Scoring Hierarchy Evaluation Flow
            </h3>

            <div style={{
              display: 'flex',
              gap: '2.5rem',
              alignItems: 'center',
              justifyContent: 'flex-start',
              minWidth: '780px',
              position: 'relative'
            }}>
              
              {/* Column 1: Overall rating */}
              <div style={{ display: 'flex', flexDirection: 'column', width: '220px', zIndex: 5 }}>
                <div className="card" style={{ 
                  borderColor: getScoreColor(record.riskRating),
                  textAlign: 'center',
                  padding: '1.25rem 1rem',
                  background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(13, 17, 26, 0.95) 100%)'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Overall Score</div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0.25rem 0', color: getScoreColor(record.riskRating) }}>
                    {record.riskRating.toFixed(1)}
                  </div>
                  <div className={`badge ${record.status}`} style={{ fontSize: '0.7rem' }}>{record.status}</div>
                </div>
              </div>

              {/* Connector lines Column 1 to Column 2 */}
              <div style={{ width: '40px', height: '140px', position: 'relative' }}>
                <svg width="40" height="140" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <path d="M 0 70 C 20 70, 20 30, 40 30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                  <path d="M 0 70 C 20 70, 20 110, 40 110" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                </svg>
              </div>

              {/* Column 2: Levels breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '220px', zIndex: 5 }}>
                {/* L1 Level Node */}
                <div className="card" style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-tertiary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Level 1 Ingest Verification</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-brand)' }}>{computedL1Sum.toFixed(1)}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    Identity validation metrics
                  </div>
                </div>

                {/* L2 Level Node */}
                <div className="card" style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-tertiary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Level 2 Transaction Audit</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-brand)' }}>{computedL2Sum.toFixed(1)}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    Value limits & geography audit
                  </div>
                </div>
              </div>

              {/* Connector lines Column 2 to Column 3 */}
              <div style={{ width: '40px', height: '220px', position: 'relative' }}>
                <svg width="40" height="220" style={{ position: 'absolute', top: 0, left: 0 }}>
                  {/* Lines for L1 (top box at y=30) */}
                  {l1Rules.map((_, idx) => {
                    const ruleY = 30 + (idx * 55);
                    return (
                      <path key={idx} d={`M 0 30 C 20 30, 20 ${ruleY}, 40 ${ruleY}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                    );
                  })}
                  {/* Lines for L2 (bottom box at y=110) */}
                  {l2Rules.map((_, idx) => {
                    const ruleY = 110 + (idx * 55);
                    return (
                      <path key={idx} d={`M 0 110 C 20 110, 20 ${ruleY}, 40 ${ruleY}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                    );
                  })}
                </svg>
              </div>

              {/* Column 3: Fired Rules */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '220px', zIndex: 5 }}>
                {/* L1 Rules List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {l1Rules.map(rule => (
                    <div key={rule.id} style={{
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{rule.name}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{rule.id}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-danger)' }}>+{rule.score.toFixed(1)}</span>
                    </div>
                  ))}
                </div>

                {/* L2 Rules List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {l2Rules.map(rule => (
                    <div key={rule.id} style={{
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{rule.name}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{rule.id}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-danger)' }}>+{rule.score.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Execution Summary text description */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: 0, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} style={{ color: 'var(--color-brand)' }} />
              Calculated Verdict Summary
            </h3>
            <p style={{
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              The overall risk grading engine has assigned a score of <strong>{record.riskRating.toFixed(1)}</strong> to this transaction evaluation. 
              This is computed by adding Level 1 identity rule scores (<strong>{computedL1Sum.toFixed(1)}</strong> points) and Level 2 policy checks (<strong>{computedL2Sum.toFixed(1)}</strong> points).
              Based on the risk mitigation rules configured on the core database, the final status recommendation is <strong>{record.status.toUpperCase()}</strong>.
              Please inspect the raw parameters using the debugger if you suspect a false positive.
            </p>
          </div>

        </div>
      )}

      {/* TAB 2: TECHNICAL DEBUGGER */}
      {activeTab === 'debugger' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Fired Rules list */}
          <div className="card">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--color-brand)' }} />
              Engine Rules Execution Log
            </h2>

            <div className="table-container" style={{ border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>Rule ID</th>
                    <th style={{ width: '22%' }}>Rule Name</th>
                    <th style={{ width: '38%' }}>Condition Evaluation Logic</th>
                    <th style={{ width: '15%' }}>Category</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>Score Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {record.rulesFired.map(rule => (
                    <tr key={rule.id}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {rule.id}
                        </span>
                      </td>
                      <td><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{rule.name}</span></td>
                      <td>
                        <code style={{ fontSize: '0.8rem', backgroundColor: 'var(--bg-tertiary)', color: '#60a5fa', border: '1px solid rgba(255,255,255,0.02)' }}>
                          {rule.condition}
                        </code>
                      </td>
                      <td>
                        <span className="badge" style={{
                          backgroundColor: 'rgba(255,255,255,0.02)',
                          color: 'var(--text-secondary)',
                          border: 'none',
                          fontSize: '0.7rem'
                        }}>
                          {rule.category}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-danger)' }}>
                        +{rule.score.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side by side JSON parameter comparison viewer */}
          <div className="card">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={16} style={{ color: 'var(--color-brand)' }} />
              Input / Output Parameter Comparison
            </h2>

            <div className="grid-cols-2">
              {/* Input JSON */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <Terminal size={14} />
                  <span>Input Ingest Payload (payload_in.json)</span>
                </div>
                <pre style={{
                  backgroundColor: '#07090d',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1rem',
                  overflow: 'auto',
                  maxHeight: '260px',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#818cf8',
                  margin: 0
                }}>
                  {record.inputPayload}
                </pre>
              </div>

              {/* Output JSON */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <Server size={14} />
                  <span>Calculated Output Payload (payload_out.json)</span>
                </div>
                <pre style={{
                  backgroundColor: '#07090d',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1rem',
                  overflow: 'auto',
                  maxHeight: '260px',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#34d399',
                  margin: 0
                }}>
                  {record.outputPayload}
                </pre>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: AGENT DISCUSSION */}
      {activeTab === 'discussion' && (
        <div className="card glass animate-fade-in" style={{ 
          height: '520px', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: 0,
          border: '1px solid rgba(139, 92, 246, 0.25)',
          overflow: 'hidden'
        }}>
          {/* Chat Header */}
          <div style={{ 
            padding: '1rem 1.5rem', 
            borderBottom: '1px solid var(--border-color)', 
            backgroundColor: 'rgba(139, 92, 246, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Bot size={22} style={{ color: 'var(--color-brand)' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>RiskEngine AI Assistant</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active in context of record: <strong>{record.id}</strong></div>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div style={{ 
            flex: 1, 
            padding: '1.5rem', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: 'rgba(0,0,0,0.08)'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ 
                display: 'flex', 
                gap: '0.75rem',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}>
                {/* Avatar Icon */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: msg.sender === 'user' ? 'var(--color-brand)' : 'var(--bg-tertiary)',
                  border: msg.sender === 'agent' ? '1px solid rgba(139, 92, 246, 0.2)' : 'none',
                  color: 'white',
                  flexShrink: 0
                }}>
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} style={{ color: 'var(--color-brand)' }} />}
                </div>

                {/* Message Bubble */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>
                    {msg.senderName} • {formatTime(msg.timestamp)}
                  </div>
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    backgroundColor: msg.sender === 'user' ? 'var(--color-brand-glow)' : 'var(--bg-secondary)',
                    border: msg.sender === 'user' ? '1px solid rgba(139,92,246,0.3)' : '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    lineHeight: 1.45,
                    color: 'var(--text-primary)',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  flexShrink: 0
                }}>
                  <Bot size={16} style={{ color: 'var(--color-brand)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>
                    RiskEngine AI is analyzing...
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px 8px 8px 0',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    height: '28px'
                  }}>
                    <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-secondary)', animation: 'bounce 1.4s infinite ease-in-out' }} />
                    <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-secondary)', animation: 'bounce 1.4s infinite ease-in-out 0.2s' }} />
                    <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-secondary)', animation: 'bounce 1.4s infinite ease-in-out 0.4s' }} />
                    <style dangerouslySetInnerHTML={{__html: `
                      @keyframes bounce {
                        0%, 80%, 100% { transform: scale(0); }
                        40% { transform: scale(1.0); }
                      }
                    `}} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input form */}
          <form onSubmit={handleSendMessage} style={{ 
            padding: '1rem 1.5rem', 
            borderTop: '1px solid var(--border-color)', 
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Ask the compliance AI about PEP flags, threshold validations or override options..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '0.65rem 1rem',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '0.65rem', borderRadius: '8px', width: '38px', height: '38px', justifyContent: 'center' }}
              disabled={!chatInput.trim() || isTyping}
            >
              <Send size={16} fill="white" />
            </button>
          </form>
        </div>
      )}

      {/* Modal dialog overlay for manual override status */}
      {showOverrideForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card" style={{ width: '460px', maxWidth: '90%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Override Verification Status</h2>
            <form onSubmit={handleOverrideSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Override Verdict</label>
                <select 
                  className="select-input"
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as any)}
                  style={{ width: '100%' }}
                >
                  <option value="approved">Approved (Clear Check)</option>
                  <option value="flagged">Flagged (Keep in Review)</option>
                  <option value="denied">Denied (Block Customer)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Override Reason</label>
                <textarea
                  rows={4}
                  className="text-input"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="Justify status change..."
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowOverrideForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Apply Verdict
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
