import React, { createContext, useContext, useState } from 'react';
import type { 
  RODRun, 
  AnalyzedRecord, 
  TransactionRecord, 
  StageConfig, 
  RuleActivation 
} from './mockData';
import { 
  initialRuns, 
  initialRecords, 
  initialTransactions, 
  initialStages, 
  initialRuleActivations 
} from './mockData';

export interface AppAuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  officer: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const initialAuditLogs: AppAuditLog[] = [
  {
    id: "LOG-1001",
    timestamp: "2026-06-08T11:40:15Z",
    action: "System Initialized",
    details: "KYC Risk Engine active. Ingestion pipelines loaded successfully.",
    officer: "System",
    type: "info"
  },
  {
    id: "LOG-1002",
    timestamp: "2026-06-08T11:35:12Z",
    action: "Rule Matrix Updated",
    details: "Rule BIO-02 (Template Signature Analysis) set to inactive.",
    officer: "S. Henderson",
    type: "warning"
  },
  {
    id: "LOG-1003",
    timestamp: "2026-06-08T11:30:10Z",
    action: "Transaction Processed",
    details: "Transaction T-9034-A (Corporate Liquidity Sweep) processed. Score: 0.92 (Flagged).",
    officer: "System",
    type: "error"
  }
];

interface AppContextType {
  // ROD state
  runs: RODRun[];
  records: AnalyzedRecord[];
  startRun: (id: string, officerName: string) => void;
  cancelRun: (id: string, officerName: string) => void;
  updateRecordStatus: (id: string, status: 'approved' | 'flagged' | 'denied', reason: string, officerName: string) => void;

  // KYC state
  transactions: TransactionRecord[];
  stages: StageConfig[];
  ruleActivations: RuleActivation[];
  
  // Shared state
  auditLogs: AppAuditLog[];
  toggleStage: (stageId: string, officerName?: string) => void;
  toggleRule: (ruleId: string, officerName?: string) => void;
  updateTransactionStatus: (id: string, status: 'Approved' | 'Flagged' | 'Denied', reason: string, officerName: string) => void;
  addAuditLog: (log: Omit<AppAuditLog, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ROD States
  const [runs, setRuns] = useState<RODRun[]>(initialRuns);
  const [records, setRecords] = useState<AnalyzedRecord[]>(initialRecords);

  // KYC States
  const [transactions, setTransactions] = useState<TransactionRecord[]>(initialTransactions);
  const [stages, setStages] = useState<StageConfig[]>(initialStages);
  const [ruleActivations, setRuleActivations] = useState<RuleActivation[]>(initialRuleActivations);
  
  // Shared State
  const [auditLogs, setAuditLogs] = useState<AppAuditLog[]>(initialAuditLogs);

  // ROD handlers
  const startRun = (id: string, officerName: string) => {
    const timestamp = new Date().toISOString();
    setRuns((prevRuns) =>
      prevRuns.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: 'running',
            submittedAt: timestamp,
            steps: r.steps.map((s, idx) => {
              if (idx === 0) return { ...s, status: 'running', details: 'Scanning ingestion payload...' };
              return s;
            })
          };
        }
        return r;
      })
    );

    const newLog: AppAuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp,
      action: "Run Pipeline Started",
      details: `Batch run ${id} was started manually by ${officerName}.`,
      officer: officerName,
      type: 'info'
    };
    setAuditLogs((prevLogs) => [newLog, ...prevLogs]);

    // Simulate progress check
    setTimeout(() => {
      setRuns((prevRuns) =>
        prevRuns.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              steps: r.steps.map((s, idx) => {
                if (idx === 0) return { ...s, status: 'succeeded', details: 'Schema check passed.', duration: '4.5s' };
                if (idx === 1) return { ...s, status: 'running', details: 'Extracting OCR contents...' };
                return s;
              })
            };
          }
          return r;
        })
      );
    }, 3000);
  };

  const cancelRun = (id: string, officerName: string) => {
    const timestamp = new Date().toISOString();
    setRuns((prevRuns) =>
      prevRuns.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: 'cancelled',
            steps: r.steps.map((s) => {
              if (s.status === 'running' || s.status === 'pending') {
                return { ...s, status: 'failed', details: 'Terminated by operator request.' };
              }
              return s;
            })
          };
        }
        return r;
      })
    );

    const newLog: AppAuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp,
      action: "Run Pipeline Cancelled",
      details: `Batch run ${id} was terminated manually by ${officerName}.`,
      officer: officerName,
      type: 'warning'
    };
    setAuditLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  const updateRecordStatus = (id: string, status: 'approved' | 'flagged' | 'denied', reason: string, officerName: string) => {
    const timestamp = new Date().toISOString();
    
    setRecords((prevRecords) =>
      prevRecords.map((r) => {
        if (r.id === id) {
          return { ...r, status };
        }
        return r;
      })
    );

    const newLog: AppAuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp,
      action: `Record Status Changed`,
      details: `Record ${id} was updated to ${status.toUpperCase()} by ${officerName}. Reason: "${reason}"`,
      officer: officerName,
      type: status === 'approved' ? 'success' : status === 'denied' ? 'error' : 'warning'
    };
    setAuditLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  // KYC handlers
  const toggleStage = (stageId: string, officerName: string = "S. Henderson") => {
    const timestamp = new Date().toISOString();
    let stageName = "";
    let isNowActive = false;

    setStages((prevStages) =>
      prevStages.map((s) => {
        if (s.id === stageId) {
          stageName = s.name;
          isNowActive = !s.isActive;
          return { ...s, isActive: isNowActive };
        }
        return s;
      })
    );

    const newLog: AppAuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp,
      action: "Stage State Toggled",
      details: `Stage "${stageName}" set to ${isNowActive ? 'ACTIVE' : 'INACTIVE'} by ${officerName}.`,
      officer: officerName,
      type: isNowActive ? 'success' : 'warning'
    };
    setAuditLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  const toggleRule = (ruleId: string, officerName: string = "S. Henderson") => {
    const timestamp = new Date().toISOString();
    let ruleName = "";
    let isNowActive = false;

    setRuleActivations((prevRules) =>
      prevRules.map((r) => {
        if (r.id === ruleId) {
          ruleName = r.name;
          isNowActive = !r.isActive;
          return { ...r, isActive: isNowActive };
        }
        return r;
      })
    );

    const newLog: AppAuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp,
      action: "Rule Activation Toggled",
      details: `Rule "${ruleName}" (ID: ${ruleId}) set to ${isNowActive ? 'ACTIVE' : 'INACTIVE'} by ${officerName}.`,
      officer: officerName,
      type: isNowActive ? 'success' : 'warning'
    };
    setAuditLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  const updateTransactionStatus = (
    id: string,
    status: 'Approved' | 'Flagged' | 'Denied',
    reason: string,
    officerName: string
  ) => {
    const timestamp = new Date().toISOString();

    setTransactions((prevTransactions) =>
      prevTransactions.map((t) => {
        if (t.id === id) {
          const updatedTimeline = [
            ...t.timeline,
            {
              time: new Date().toLocaleTimeString('en-US', { hour12: false }) + " UTC",
              title: `Status Updated to ${status}`,
              description: `Manually updated by ${officerName}. Reason: "${reason}"`
            }
          ];
          return { ...t, status, timeline: updatedTimeline };
        }
        return t;
      })
    );

    const newLog: AppAuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp,
      action: `Record Status Updated`,
      details: `Record ${id} was marked as ${status.toUpperCase()} by ${officerName}. Reason: "${reason}"`,
      officer: officerName,
      type: status === 'Approved' ? 'success' : status === 'Denied' ? 'error' : 'warning'
    };
    setAuditLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  const addAuditLog = (logData: Omit<AppAuditLog, 'id' | 'timestamp'>) => {
    const newLog: AppAuditLog = {
      ...logData,
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  return (
    <AppContext.Provider value={{
      runs,
      records,
      startRun,
      cancelRun,
      updateRecordStatus,
      transactions,
      stages,
      ruleActivations,
      auditLogs,
      toggleStage,
      toggleRule,
      updateTransactionStatus,
      addAuditLog
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
