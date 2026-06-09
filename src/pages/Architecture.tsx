import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Zap, 
  ShieldCheck, 
  HardDrive, 
  Terminal, 
  Database, 
  Sliders, 
  Lock, 
  Globe, 
  BookOpen, 
  Activity, 
  Server, 
  Briefcase, 
  Play, 
  RefreshCw,
  Settings
} from 'lucide-react';

interface AgentNode {
  id: string;
  name: string;
  category: 'core' | 'support' | 'gateway' | 'memory' | 'data';
  icon: React.ReactNode;
  shortDesc: string;
  description: string;
  prompt: string;
  tools: string[];
  color: string;
  status: 'Idle' | 'Active' | 'Warning' | 'Success';
}

export const Architecture: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('orchestrator');
  const [activeTab, setActiveTab] = useState<'info' | 'prompt' | 'logs'>('info');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(-1);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Nodes Data
  const nodes: Record<string, AgentNode> = {
    // Left stack
    evaluation: {
      id: 'evaluation',
      name: 'Evaluation Suite',
      category: 'support',
      icon: <Sliders size={18} />,
      shortDesc: 'Monitors rule precision and drift.',
      description: 'Continuous validation framework that evaluates rule precision, recall rates, false positive ratios, and score weight performance against historical validation runs.',
      prompt: 'Analyze active rule matrices against ground-truth audit outcomes. Calculate false-positive thresholds and recommend weight modifications to optimize rule recall (Target: >95% recall, <12% false positives).',
      tools: ['evaluateRulePerformance()', 'calculateDriftCoefficient()', 'suggestWeightTweak()', 'generateAblationReport()'],
      color: '#f59e0b',
      status: 'Idle'
    },
    guardrails: {
      id: 'guardrails',
      name: 'Guardrails & Safety',
      category: 'support',
      icon: <Lock size={18} />,
      shortDesc: 'PII masking and prompt check.',
      description: 'Security middleware enforcing safety parameters, redacting personally identifiable information (PII) before LLM queries, and checking inputs for prompt injection vectors.',
      prompt: 'Sanitize all input data. Redact SSN, phone numbers, and full addresses. Scan outbound prompts for injection vectors and enforce maximum spending token limits per transaction evaluation.',
      tools: ['redactPII()', 'detectPromptInjection()', 'enforceTokenGuard()', 'checkSanitizationCompliance()'],
      color: '#3b82f6',
      status: 'Idle'
    },
    context: {
      id: 'context',
      name: 'Context Layer (LTM)',
      category: 'memory',
      icon: <HardDrive size={18} />,
      shortDesc: 'Entity memory and audit trails.',
      description: 'Long-term memory module storing entity resolution graphs, past compliance decisions, manual analyst override histories, and recurrent transaction patterns.',
      prompt: 'Maintain long-term records of analyzed entity profiles. Query historic transactions to verify recurrent patterns or identify structural relationship changes (e.g. proxy shells, shell networks).',
      tools: ['retrieveEntityHistory()', 'saveResolutionGraph()', 'matchOverridePatterns()', 'updateProfileMemory()'],
      color: '#10b981',
      status: 'Idle'
    },
    // Right stack
    gateway: {
      id: 'gateway',
      name: 'LLM Gateway',
      category: 'gateway',
      icon: <Globe size={18} />,
      shortDesc: 'Arc Eco System',
      description: 'High-availability router providing model proxying, token usage tracking, and automatic failover. Dynamic selection between Gemini, Claude, and Llama based on prompt complexity.',
      prompt: 'Route system queries to the optimal LLM based on latency requirements and text complexity constraints. Enforce API key rotation, load balance traffic, and fallback to secondary providers upon error.',
      tools: ['proxyRequest()', 'selectOptimalModel()', 'trackTokenUsage()', 'triggerProviderFailover()'],
      color: '#f97316',
      status: 'Idle'
    },
    knowledge: {
      id: 'knowledge',
      name: 'Knowledge Base / RAG',
      category: 'memory',
      icon: <BookOpen size={18} />,
      shortDesc: 'Knowledge (RAG)',
      description: 'Semantic document retrieval engine hosting regulatory update docs, tax treaties, OFAC handbook guides, and internal KYC operating manuals.',
      prompt: 'Perform semantic search using vector embeddings to extract relevant policy clauses, regulatory compliance guidelines, or tax exemption rule exceptions for a designated jurisdiction.',
      tools: ['queryVectorDB()', 'retrievePolicyContext()', 'generateTextEmbeddings()', 'cacheRegulatoryManuals()'],
      color: '#6366f1',
      status: 'Idle'
    },
    // Center Orchestrator
    orchestrator: {
      id: 'orchestrator',
      name: 'Routing & Orchestration Agent',
      category: 'core',
      icon: <Cpu size={24} />,
      shortDesc: 'Central agent network director.',
      description: 'The central coordinator that ingests transaction alerts, evaluates context, dynamically invokes specialized sub-agents, and resolves final risk verdict proposals.',
      prompt: 'You are the central Routing & Orchestration Agent for the KYC Compliance system. Analyze the metadata of incoming transaction alerts. Delegate sub-verification tasks to specialized agents (identity, screening, engine). Synthesize execution responses into a consolidated score justification.',
      tools: ['invokeSubAgent()', 'aggregateSubtasks()', 'assessConfidenceInterval()', 'dispatchFinalDecision()'],
      color: '#8b5cf6',
      status: 'Idle'
    },
    // Surrounding Agents (Top row)
    risk_engine: {
      id: 'risk_engine',
      name: 'Risk Engine Agent',
      category: 'core',
      icon: <Settings size={16} />,
      shortDesc: 'Executes core scoring rules.',
      description: 'Performs rule scoring calculations, evaluates pattern logic, and aggregates calculated weights into the initial mathematical risk coefficient.',
      prompt: 'Run the logic rules engine on the transaction data. Evaluate structural logic parameters, transaction velocities, and country code risk multipliers. Generate rule outcomes and initial mathematical score.',
      tools: ['runRuleMatrix()', 'calculateRiskScore()', 'checkTransactionVelocity()', 'flagRuleAnomaly()'],
      color: '#ec4899',
      status: 'Idle'
    },
    rod: {
      id: 'rod',
      name: 'Risk On Demand (ROD) Agent',
      category: 'core',
      icon: <Zap size={16} />,
      shortDesc: 'Real-time onboarding checks.',
      description: 'Synchronous, low-latency agent designed to execute rapid PEP (Politically Exposed Persons) checks and sanction screening matches under 50ms.',
      prompt: 'Verify entity profile details against fast-cache compliance databases. Return immediate PEP or sanction screening matches. Prioritize low latency (<50ms execution ceiling).',
      tools: ['querySanctionsCache()', 'verifyPEPList()', 'getLatencyPerformance()', 'generateInstantVerdict()'],
      color: '#eab308',
      status: 'Idle'
    },
    kyc_verifier: {
      id: 'kyc_verifier',
      name: 'KYC Verification Agent',
      category: 'core',
      icon: <ShieldCheck size={16} />,
      shortDesc: 'OCR & Biometric verification.',
      description: 'Extracts ID credentials, conducts document tampering checksum validation, and checks biometric liveness scans.',
      prompt: 'Process passport or identification card images. Extract structured credentials via OCR, run check-digit checksum verification, and compare image data to facial liveness matching templates.',
      tools: ['runOCR()', 'matchBiometrics()', 'checkDocumentUptime()', 'verifyTamperingIndicators()'],
      color: '#06b6d4',
      status: 'Idle'
    },
    // Surrounding Agents (Bottom row)
    devsecops: {
      id: 'devsecops',
      name: 'DevSecOps & SRE Agent',
      category: 'core',
      icon: <Activity size={16} />,
      shortDesc: 'Monitors latency and SLA health.',
      description: 'Observability agent tracking system latency, API response rates, network connection stability, and orchestrating failover triggers.',
      prompt: 'Monitor the performance metrics of all active agents. If latency averages exceed 150ms or connection errors spike, report diagnostic data and generate alert tickets for operations teams.',
      tools: ['monitorUptime()', 'checkAgentLatencies()', 'triggerPagerdutyAlert()', 'analyzePerformanceSLA()'],
      color: '#14b8a6',
      status: 'Idle'
    },
    app_ops: {
      id: 'app_ops',
      name: 'Application Operation Agent',
      category: 'core',
      icon: <Server size={16} />,
      shortDesc: 'Manages queues and batch retries.',
      description: 'Queue manager handling batch ingestion tasks, tracking asynchronous job failures, and managing exponential backoff retry flows.',
      prompt: 'Oversee the ingestion queues. If sub-agent API limits are hit, schedule exponential backoff retries. Re-queue transactions and synchronize updates to database logs.',
      tools: ['checkQueueDepth()', 'enqueueRetryJob()', 'syncDBCoordination()', 'recoverCorruptedBatch()'],
      color: '#f43f5e',
      status: 'Idle'
    },
    business_ops: {
      id: 'business_ops',
      name: 'Business Operation Agent',
      category: 'core',
      icon: <Briefcase size={16} />,
      shortDesc: 'Facilitates manual overrides.',
      description: 'Compliance workflow assistant. Tracks overrides, logs justifications, maps assignments, and logs audit events.',
      prompt: 'Create pending validation alerts for case reviewers. Record analyst override statements, register user actions in the audit trail database, and prepare regulatory report exports.',
      tools: ['createReviewCase()', 'logOverrideReason()', 'compileAuditSpreadsheet()', 'notifyComplianceOfficer()'],
      color: '#84cc16',
      status: 'Idle'
    },
    // Data connectors (Bottom)
    data_sources: {
      id: 'data_sources',
      name: 'Data Sources / Tools / MCP',
      category: 'data',
      icon: <Database size={20} />,
      shortDesc: 'Connects core system data databases & APIs.',
      description: 'Unified database and API layer providing secure database connections and Model Context Protocol (MCP) integrations to standard banking registries.',
      prompt: 'Expose secure database connectors and external API access points to the agent swarm. Enforce access credentials, audit connection histories, and validate returned payload JSON structures.',
      tools: ['queryDatabase()', 'callExternalAPI()', 'verifyMCPHandshake()', 'parsePayloadSchema()'],
      color: '#9ca3af',
      status: 'Idle'
    }
  };

  // Simulation Timeline Steps
  const simulationSteps = [
    {
      step: 0,
      activeNodes: ['data_sources'],
      log: '📥 Ingesting transaction payload T-9034-A... Extracting transaction amount: $4,500,000.00 EUR (Russia jurisdiction check triggered).'
    },
    {
      step: 1,
      activeNodes: ['gateway', 'guardrails'],
      log: '🔒 Contacting LLM Gateway via Guardrails Middleware... Redacted originator email. Model selected: Gemini 1.5 Pro.'
    },
    {
      step: 2,
      activeNodes: ['orchestrator', 'context'],
      log: '🧠 Routing & Orchestration Agent activated. Querying Context Layer (Long-Term Memory)... Found 2 historical compliance checks for beneficiary entity.'
    },
    {
      step: 3,
      activeNodes: ['kyc_verifier', 'knowledge'],
      log: '🆔 Dispatching sub-task to KYC Verification Agent. Querying Vector Database for Russia-related screening rules... Passport OCR verification passed (100% liveness match).'
    },
    {
      step: 4,
      activeNodes: ['rod'],
      log: '⚡ ROD Agent invoked for real-time validation... Running fast-cache screening. WARNING: Beneficiary entity matched OFAC Sanctions database registry list.'
    },
    {
      step: 5,
      activeNodes: ['risk_engine'],
      log: '⚙️ Activating Risk Engine Agent. Evaluating rules matrix: Rules [JURISDICTION_RU] and [AML_SANCTIONS] marked as CRITICAL / FAILED. Calculated score: 0.92.'
    },
    {
      step: 6,
      activeNodes: ['business_ops', 'app_ops', 'devsecops'],
      log: '💼 Compliance Alert triggered. Business Ops Agent logged manual review case LOG-1004. App Ops synced audit log tables. DevSecOps reports pipeline execution complete in 45ms.'
    },
    {
      step: 7,
      activeNodes: ['orchestrator', 'evaluation'],
      log: '✅ Simulation complete. Synthesized verdict: FLAGGED_FOR_REVIEW. Evaluation Suite logged drift metrics.'
    }
  ];

  // Simulation Effect
  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      if (simulationStep < simulationSteps.length - 1) {
        interval = setTimeout(() => {
          const nextStep = simulationStep + 1;
          setSimulationStep(nextStep);
          
          // Add logs
          const stepDetails = simulationSteps[nextStep];
          setSimLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', { hour12: false })}] ${stepDetails.log}`]);
          
          // Highlight nodes
          if (stepDetails.activeNodes.length > 0) {
            setSelectedNodeId(stepDetails.activeNodes[0]);
          }
        }, 1800);
      } else {
        setIsSimulating(false);
        setSimLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', { hour12: false })}] 🏁 Ingestion simulation finished successfully.`]);
      }
    }
    return () => clearTimeout(interval);
  }, [isSimulating, simulationStep]);

  // Autoscroll console logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [simLogs]);

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(-1);
    setSimLogs([`[${new Date().toLocaleTimeString('en-US', { hour12: false })}] 🚀 Starting system ingestion run for payload T-9034-A...`]);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationStep(-1);
    setSimLogs([]);
    setSelectedNodeId('orchestrator');
  };

  const getNodeStatus = (nodeId: string) => {
    if (isSimulating) {
      const currentStepDetails = simulationSteps[simulationStep];
      if (currentStepDetails && currentStepDetails.activeNodes.includes(nodeId)) {
        if (nodeId === 'rod') return 'Warning';
        if (nodeId === 'risk_engine') return 'Warning';
        return 'Active';
      }
      return 'Idle';
    }
    return nodeId === selectedNodeId ? 'Active' : 'Idle';
  };

  const selectedNode = nodes[selectedNodeId];

  // Helper to determine node colors
  const getStatusColor = (status: string, fallbackColor: string) => {
    switch(status) {
      case 'Active': return 'var(--color-brand)';
      case 'Warning': return 'var(--color-warning)';
      case 'Success': return 'var(--color-success)';
      default: return fallbackColor;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* CSS Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .arch-grid {
          display: grid;
          grid-template-columns: 280px 1fr 280px;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 1200px) {
          .arch-grid {
            grid-template-columns: 1fr;
          }
          .side-stack {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          }
        }

        .node-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .node-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 3px;
          width: 0%;
          transition: width 0.3s ease;
        }

        .node-card.active-node {
          border-color: var(--active-color) !important;
          box-shadow: 0 0 15px var(--active-glow) !important;
          transform: translateY(-2px);
        }

        .node-card.active-node::before {
          width: 100%;
          background-color: var(--active-color);
        }

        .node-card:hover {
          border-color: var(--active-color-hover);
          transform: translateY(-2px);
        }

        .pulse-indicator {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--active-color);
        }

        .pulse-indicator.pulsing {
          animation: nodePulse 1.2s infinite alternate;
        }

        @keyframes nodePulse {
          0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); transform: scale(1); }
          100% { box-shadow: 0 0 8px 6px rgba(139, 92, 246, 0.1); transform: scale(1.2); }
        }

        .center-orchestrator-box {
          background-color: rgba(13, 17, 26, 0.4);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1.5rem;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          min-height: 400px;
        }

        .center-group-agents {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          width: 100%;
        }

        .console-container {
          background-color: #030508;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1rem;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          max-height: 180px;
          overflow-y: auto;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.8);
        }

        .details-panel {
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }

        .details-header {
          padding: 1.25rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .details-tab-btn {
          background: none;
          border: none;
          padding: 0.75rem 1rem;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .details-tab-btn.active {
          color: var(--text-primary);
          border-bottom-color: var(--color-brand);
        }

        .flow-path {
          stroke: var(--border-color);
          stroke-width: 2;
          stroke-dasharray: 6,6;
          fill: none;
          transition: all 0.5s ease;
        }

        .flow-path.pulsing-flow {
          stroke: var(--color-brand);
          stroke-dashoffset: 40;
          animation: strokePulse 1s linear infinite;
        }

        @keyframes strokePulse {
          to { stroke-dashoffset: 0; }
        }
      `}} />

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>KYC Agent Architecture</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Agentic AI architecture overview. Ingest payload and trace routing decisions between specialized compliance agents.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={startSimulation}
            disabled={isSimulating}
            style={{ opacity: isSimulating ? 0.7 : 1 }}
          >
            <Play size={16} /> Trigger Ingestion Simulation
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={resetSimulation}
            style={{ padding: '0.65rem' }}
            title="Reset Diagram"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="arch-grid">
        
        {/* Left Column - Operational Stack */}
        <div className="side-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Operational Integrity
          </div>
          
          {/* Evaluation Suite */}
          <div 
            onClick={() => setSelectedNodeId('evaluation')}
            className={`node-card ${selectedNodeId === 'evaluation' ? 'active-node' : ''}`}
            style={{ 
              '--active-color': nodes.evaluation.color,
              '--active-glow': 'rgba(245, 158, 11, 0.15)',
              '--active-color-hover': 'rgba(245, 158, 11, 0.5)'
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div className="logo-icon" style={{ 
                background: 'rgba(245, 158, 11, 0.1)', 
                color: '#f59e0b',
                width: '32px', 
                height: '32px',
                borderRadius: '6px'
              }}>
                {nodes.evaluation.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>Evaluation Suite</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Continuous drift validation</span>
              </div>
            </div>
            {isSimulating && simulationStep === 7 && (
              <span className="pulse-indicator pulsing" style={{ '--active-color': nodes.evaluation.color } as React.CSSProperties} />
            )}
          </div>

          {/* Guardrails */}
          <div 
            onClick={() => setSelectedNodeId('guardrails')}
            className={`node-card ${selectedNodeId === 'guardrails' ? 'active-node' : ''}`}
            style={{ 
              '--active-color': nodes.guardrails.color,
              '--active-glow': 'rgba(59, 130, 246, 0.15)',
              '--active-color-hover': 'rgba(59, 130, 246, 0.5)'
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div className="logo-icon" style={{ 
                background: 'rgba(59, 130, 246, 0.1)', 
                color: '#3b82f6',
                width: '32px', 
                height: '32px',
                borderRadius: '6px'
              }}>
                {nodes.guardrails.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>Guardrails & Safety</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PII masking & injection block</span>
              </div>
            </div>
            {isSimulating && simulationStep === 1 && (
              <span className="pulse-indicator pulsing" style={{ '--active-color': nodes.guardrails.color } as React.CSSProperties} />
            )}
          </div>

          {/* Context Layer */}
          <div 
            onClick={() => setSelectedNodeId('context')}
            className={`node-card ${selectedNodeId === 'context' ? 'active-node' : ''}`}
            style={{ 
              '--active-color': nodes.context.color,
              '--active-glow': 'rgba(16, 185, 129, 0.15)',
              '--active-color-hover': 'rgba(16, 185, 129, 0.5)'
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div className="logo-icon" style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                color: '#10b981',
                width: '32px', 
                height: '32px',
                borderRadius: '6px'
              }}>
                {nodes.context.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>Context (Memory)</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Audit trails & entity graphs</span>
              </div>
            </div>
            {isSimulating && (simulationStep === 2 || simulationStep === 7) && (
              <span className="pulse-indicator pulsing" style={{ '--active-color': nodes.context.color } as React.CSSProperties} />
            )}
          </div>
        </div>

        {/* Center Column - Orchestrator & Swarm */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="center-orchestrator-box">
            
            {/* Top row agents */}
            <div className="center-group-agents">
              
              {/* Risk Engine Agent */}
              <div 
                onClick={() => setSelectedNodeId('risk_engine')}
                className={`node-card ${selectedNodeId === 'risk_engine' ? 'active-node' : ''}`}
                style={{ 
                  '--active-color': nodes.risk_engine.color,
                  '--active-glow': 'rgba(236, 72, 153, 0.15)',
                  '--active-color-hover': 'rgba(236, 72, 153, 0.5)'
                } as React.CSSProperties}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center' }}>
                  <div style={{ color: nodes.risk_engine.color }}>{nodes.risk_engine.icon}</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Risk Engine</span>
                </div>
                {isSimulating && simulationStep === 5 && (
                  <span className="pulse-indicator pulsing" style={{ '--active-color': nodes.risk_engine.color } as React.CSSProperties} />
                )}
              </div>

              {/* Risk On Demand Agent */}
              <div 
                onClick={() => setSelectedNodeId('rod')}
                className={`node-card ${selectedNodeId === 'rod' ? 'active-node' : ''}`}
                style={{ 
                  '--active-color': nodes.rod.color,
                  '--active-glow': 'rgba(234, 179, 8, 0.15)',
                  '--active-color-hover': 'rgba(234, 179, 8, 0.5)'
                } as React.CSSProperties}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center' }}>
                  <div style={{ color: nodes.rod.color }}>{nodes.rod.icon}</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Risk On Demand</span>
                </div>
                {isSimulating && simulationStep === 4 && (
                  <span className="pulse-indicator pulsing" style={{ '--active-color': '#ef4444' } as React.CSSProperties} />
                )}
              </div>

              {/* KYC Verification Agent */}
              <div 
                onClick={() => setSelectedNodeId('kyc_verifier')}
                className={`node-card ${selectedNodeId === 'kyc_verifier' ? 'active-node' : ''}`}
                style={{ 
                  '--active-color': nodes.kyc_verifier.color,
                  '--active-glow': 'rgba(6, 182, 212, 0.15)',
                  '--active-color-hover': 'rgba(6, 182, 212, 0.5)'
                } as React.CSSProperties}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center' }}>
                  <div style={{ color: nodes.kyc_verifier.color }}>{nodes.kyc_verifier.icon}</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>KYC Verifier</span>
                </div>
                {isSimulating && simulationStep === 3 && (
                  <span className="pulse-indicator pulsing" style={{ '--active-color': nodes.kyc_verifier.color } as React.CSSProperties} />
                )}
              </div>
            </div>

            {/* Central Orchestrator Agent */}
            <div 
              onClick={() => setSelectedNodeId('orchestrator')}
              className={`node-card ${selectedNodeId === 'orchestrator' ? 'active-node' : ''}`}
              style={{ 
                '--active-color': nodes.orchestrator.color,
                '--active-glow': 'rgba(139, 92, 246, 0.25)',
                '--active-color-hover': 'rgba(139, 92, 246, 0.6)',
                width: '100%',
                maxWidth: '320px',
                padding: '1.5rem',
                borderWidth: '2px'
              } as React.CSSProperties}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}>
                <div className="logo-icon" style={{ 
                  background: 'linear-gradient(135deg, var(--color-brand) 0%, #a78bfa 100%)',
                  width: '48px', 
                  height: '48px',
                  borderRadius: '10px'
                }}>
                  <Cpu size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'white' }}>Routing & Orchestration Agent</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>Central Swarm Coordinator</p>
                </div>
              </div>
              {isSimulating && [2, 3, 4, 5, 6, 7].includes(simulationStep) && (
                <span className="pulse-indicator pulsing" style={{ '--active-color': nodes.orchestrator.color } as React.CSSProperties} />
              )}
            </div>

            {/* Bottom row agents */}
            <div className="center-group-agents">
              
              {/* DevSecOps & SRE Agent */}
              <div 
                onClick={() => setSelectedNodeId('devsecops')}
                className={`node-card ${selectedNodeId === 'devsecops' ? 'active-node' : ''}`}
                style={{ 
                  '--active-color': nodes.devsecops.color,
                  '--active-glow': 'rgba(20, 184, 166, 0.15)',
                  '--active-color-hover': 'rgba(20, 184, 166, 0.5)'
                } as React.CSSProperties}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center' }}>
                  <div style={{ color: nodes.devsecops.color }}>{nodes.devsecops.icon}</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>DevSecOps & SRE</span>
                </div>
                {isSimulating && simulationStep === 6 && (
                  <span className="pulse-indicator pulsing" style={{ '--active-color': nodes.devsecops.color } as React.CSSProperties} />
                )}
              </div>

              {/* Application Operation Agent */}
              <div 
                onClick={() => setSelectedNodeId('app_ops')}
                className={`node-card ${selectedNodeId === 'app_ops' ? 'active-node' : ''}`}
                style={{ 
                  '--active-color': nodes.app_ops.color,
                  '--active-glow': 'rgba(244, 63, 94, 0.15)',
                  '--active-color-hover': 'rgba(244, 63, 94, 0.5)'
                } as React.CSSProperties}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center' }}>
                  <div style={{ color: nodes.app_ops.color }}>{nodes.app_ops.icon}</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Application Ops</span>
                </div>
                {isSimulating && simulationStep === 6 && (
                  <span className="pulse-indicator pulsing" style={{ '--active-color': nodes.app_ops.color } as React.CSSProperties} />
                )}
              </div>

              {/* Business Operation Agent */}
              <div 
                onClick={() => setSelectedNodeId('business_ops')}
                className={`node-card ${selectedNodeId === 'business_ops' ? 'active-node' : ''}`}
                style={{ 
                  '--active-color': nodes.business_ops.color,
                  '--active-glow': 'rgba(132, 204, 22, 0.15)',
                  '--active-color-hover': 'rgba(132, 204, 22, 0.5)'
                } as React.CSSProperties}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center' }}>
                  <div style={{ color: nodes.business_ops.color }}>{nodes.business_ops.icon}</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Business Ops</span>
                </div>
                {isSimulating && simulationStep === 6 && (
                  <span className="pulse-indicator pulsing" style={{ '--active-color': nodes.business_ops.color } as React.CSSProperties} />
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Infrastructure Stack */}
        <div className="side-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Infrastructure & Intelligence
          </div>

          {/* LLM Gateway */}
          <div 
            onClick={() => setSelectedNodeId('gateway')}
            className={`node-card ${selectedNodeId === 'gateway' ? 'active-node' : ''}`}
            style={{ 
              '--active-color': nodes.gateway.color,
              '--active-glow': 'rgba(249, 115, 22, 0.15)',
              '--active-color-hover': 'rgba(249, 115, 22, 0.5)'
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div className="logo-icon" style={{ 
                background: 'rgba(249, 115, 22, 0.1)', 
                color: '#f97316',
                width: '32px', 
                height: '32px',
                borderRadius: '6px'
              }}>
                {nodes.gateway.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>LLM Gateway</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Arc Eco System</span>
              </div>
            </div>
            {isSimulating && simulationStep === 1 && (
              <span className="pulse-indicator pulsing" style={{ '--active-color': nodes.gateway.color } as React.CSSProperties} />
            )}
          </div>

          {/* Knowledge Base */}
          <div 
            onClick={() => setSelectedNodeId('knowledge')}
            className={`node-card ${selectedNodeId === 'knowledge' ? 'active-node' : ''}`}
            style={{ 
              '--active-color': nodes.knowledge.color,
              '--active-glow': 'rgba(99, 102, 241, 0.15)',
              '--active-color-hover': 'rgba(99, 102, 241, 0.5)'
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div className="logo-icon" style={{ 
                background: 'rgba(99, 102, 241, 0.1)', 
                color: '#6366f1',
                width: '32px', 
                height: '32px',
                borderRadius: '6px'
              }}>
                {nodes.knowledge.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>Knowledge (RAG)</h3>
              </div>
            </div>
            {isSimulating && simulationStep === 3 && (
              <span className="pulse-indicator pulsing" style={{ '--active-color': nodes.knowledge.color } as React.CSSProperties} />
            )}
          </div>
        </div>

      </div>

      {/* Connectors / Data Sources Bottom Card */}
      <div 
        onClick={() => setSelectedNodeId('data_sources')}
        className={`card glass node-card ${selectedNodeId === 'data_sources' ? 'active-node' : ''}`}
        style={{ 
          '--active-color': nodes.data_sources.color,
          '--active-glow': 'rgba(156, 163, 175, 0.15)',
          '--active-color-hover': 'rgba(156, 163, 175, 0.5)',
          padding: '1.25rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          cursor: 'pointer'
        } as React.CSSProperties}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Database size={20} style={{ color: 'var(--text-secondary)' }} />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Data Sources / Unified APIs / MCP Connector Plane</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Secure connectors providing raw compliance intelligence data feeds</span>
          </div>
          {isSimulating && simulationStep === 0 && (
            <span className="pulse-indicator pulsing" style={{ '--active-color': '#10b981', position: 'relative', top: 'auto', right: 'auto', marginLeft: 'auto' } as React.CSSProperties} />
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
          <div style={{ flex: '1', minWidth: '180px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--color-info)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>KYC Platform API/MCP</span>
          </div>
          <div style={{ flex: '1', minWidth: '180px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Cpu size={16} style={{ color: 'var(--color-warning)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Risk Engine API/MCP</span>
          </div>
          <div style={{ flex: '1', minWidth: '180px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Database size={16} style={{ color: 'var(--color-brand)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Transaction DB</span>
          </div>
          <div style={{ flex: '1', minWidth: '180px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Database size={16} style={{ color: 'var(--color-success)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Audit DB</span>
          </div>
        </div>
      </div>

      {/* Two Column details and console view */}
      <div className="grid-cols-2">
        
        {/* Node detail panel */}
        <div className="card glass" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="details-header" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '36px', 
              height: '36px', 
              borderRadius: '8px', 
              background: `rgba(255,255,255,0.03)`,
              color: selectedNode.color
            }}>
              {selectedNode.icon}
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{selectedNode.name}</h2>
              <span className="badge" style={{ 
                backgroundColor: selectedNodeId === 'orchestrator' ? 'var(--color-brand-glow)' : 'rgba(255,255,255,0.03)',
                color: selectedNodeId === 'orchestrator' ? 'var(--color-brand)' : 'var(--text-secondary)',
                border: 'none',
                marginTop: '0.15rem'
              }}>
                {selectedNode.category.toUpperCase()} NODE
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
            <button 
              className={`details-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Info & Overview
            </button>
            <button 
              className={`details-tab-btn ${activeTab === 'prompt' ? 'active' : ''}`}
              onClick={() => setActiveTab('prompt')}
            >
              System Prompt & Tools
            </button>
            <button 
              className={`details-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              Agent Execution Logs
            </button>
          </div>

          <div style={{ padding: '1.5rem', minHeight: '200px' }}>
            {activeTab === 'info' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.5', margin: 0, color: 'var(--text-primary)' }}>
                  {selectedNode.description}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.15)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Current Status:</span>
                    <span style={{ 
                      fontWeight: 600, 
                      color: getStatusColor(getNodeStatus(selectedNodeId), 'var(--text-secondary)')
                    }}>
                      ● {isSimulating && simulationSteps[simulationStep]?.activeNodes.includes(selectedNodeId) ? 'ACTIVE' : 'IDLE'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Role Complexity:</span>
                    <span style={{ fontWeight: 600, color: selectedNode.category === 'core' ? 'var(--color-danger)' : 'var(--color-success)' }}>
                      {selectedNode.category === 'core' ? 'High' : 'Standard'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prompt' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>Agent Prompt Template</h4>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.8rem', 
                    background: '#04060a', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)', 
                    color: 'var(--text-secondary)',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {selectedNode.prompt}
                  </pre>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>Registered MCP / Schema Tools</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedNode.tools.map(tool => (
                      <code key={tool} style={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '0.75rem', 
                        background: 'var(--color-brand-glow)', 
                        color: 'var(--color-brand)', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px',
                        border: '1px solid rgba(139, 92, 246, 0.15)'
                      }}>
                        {tool}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0' }}>Simulated Real-time Console</h4>
                <div style={{ 
                  background: '#030508', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '8px', 
                  padding: '0.75rem 1rem', 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  {isSimulating && simulationSteps[simulationStep]?.activeNodes.includes(selectedNodeId) ? (
                    <div>
                      <span style={{ color: 'var(--color-brand)' }}>[RUNNING]</span> Ingesting orchestration requests... Executing registered tools.
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)' }}>
                      [READY] Node in standby state. Trigger ingestion simulation to view live trace.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Simulation Console */}
        <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={18} style={{ color: 'var(--color-success)' }} />
              Live Execution Trace Console
            </h2>
            {isSimulating && (
              <span className="badge" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'none' }}>
                SIMULATING
              </span>
            )}
          </div>

          <div className="console-container" style={{ flex: '1', minHeight: '200px' }}>
            {simLogs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.5rem' }}>
                <Terminal size={24} />
                <span>Console is empty. Click "Trigger Ingestion Simulation" to start.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {simLogs.map((log, index) => {
                  let logColor = 'var(--text-primary)';
                  if (log.includes('WARNING')) logColor = 'var(--color-warning)';
                  if (log.includes('SUCCESS') || log.includes('verdict')) logColor = 'var(--color-success)';
                  if (log.includes('Starting') || log.includes('activated')) logColor = 'var(--color-brand)';
                  
                  return (
                    <div key={index} style={{ color: logColor, display: 'flex', gap: '0.5rem', lineHeight: '1.4' }}>
                      <span style={{ color: 'var(--text-muted)' }}>&gt;</span>
                      <span>{log}</span>
                    </div>
                  );
                })}
                <div ref={consoleEndRef} />
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
