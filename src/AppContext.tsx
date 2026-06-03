import React, { createContext, useContext, useState } from 'react';
import type { RODRun, AnalyzedRecord } from './mockData';
import { initialRuns, initialRecords } from './mockData';

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
    timestamp: "2026-06-02T11:40:15Z",
    action: "Run Pipeline Initialized",
    details: "Batch run PRB001 (WMS Exhaustiveness Test) kicked off automatically.",
    officer: "alex_smith_de",
    type: "info"
  },
  {
    id: "LOG-1002",
    timestamp: "2026-06-02T09:20:02Z",
    action: "Batch Completed",
    details: "Batch run SIM_Risk_Audit_02 completed successfully. 120,500 items verified.",
    officer: "sarah_jenkins",
    type: "success"
  },
  {
    id: "LOG-1003",
    timestamp: "2026-06-01T23:31:05Z",
    action: "Pipeline Failed Alert",
    details: "Batch run SIM24_Daily_Run failed at Step 3: AML Watchlist connection timeout.",
    officer: "System",
    type: "error"
  }
];

interface AppContextType {
  runs: RODRun[];
  records: AnalyzedRecord[];
  auditLogs: AppAuditLog[];
  startRun: (id: string, officerName: string) => void;
  cancelRun: (id: string, officerName: string) => void;
  updateRecordStatus: (id: string, status: 'approved' | 'flagged' | 'denied', reason: string, officerName: string) => void;
  addAuditLog: (log: Omit<AppAuditLog, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [runs, setRuns] = useState<RODRun[]>(initialRuns);
  const [records, setRecords] = useState<AnalyzedRecord[]>(initialRecords);
  const [auditLogs, setAuditLogs] = useState<AppAuditLog[]>(initialAuditLogs);

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

  const addAuditLog = (logData: Omit<AppAuditLog, 'id' | 'timestamp'>) => {
    const newLog: AppAuditLog = {
      ...logData,
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  return (
    <AppContext.Provider value={{ runs, records, auditLogs, startRun, cancelRun, updateRecordStatus, addAuditLog }}>
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
