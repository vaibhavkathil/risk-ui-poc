export interface RunStep {
  id: string;
  name: string;
  status: 'succeeded' | 'failed' | 'running' | 'pending' | 'cancelled';
  details: string;
  duration: string;
}

export interface RODRun {
  id: string;
  name: string;
  status: 'ready' | 'running' | 'completed' | 'failed' | 'cancelled';
  owner: string;
  submittedAt: string;
  runtime: string;
  processedItems: number;
  successRate: number; // percentage
  outcomes: {
    approved: number;
    flagged: number;
    denied: number;
  };
  steps: RunStep[];
}

export interface FiredRule {
  id: string;
  name: string;
  condition: string;
  score: number;
  category: 'identity' | 'transaction' | 'geography';
}

export interface AnalyzedRecord {
  id: string;
  fullName: string;
  email: string;
  country: string;
  transactionSize: number;
  submittedAt: string;
  riskRating: number; // 0-100
  calculatedL1: number;
  calculatedL2: number;
  status: 'approved' | 'flagged' | 'denied';
  rulesFired: FiredRule[];
  inputPayload: string;
  outputPayload: string;
}

// Seed data for ROD Runs
export const initialRuns: RODRun[] = [
  {
    id: "PRB001",
    name: "WMS Exhaustiveness Test",
    status: "running",
    owner: "alex_smith_de",
    submittedAt: "2026-06-02T11:40:00Z",
    runtime: "2m 10s",
    processedItems: 54302,
    successRate: 99.4,
    outcomes: {
      approved: 42104,
      flagged: 11045,
      denied: 1153
    },
    steps: [
      { id: "step-1", name: "Data Ingestion & Schema Check", status: "succeeded", details: "Loaded 54,302 records. No format violations.", duration: "12.4s" },
      { id: "step-2", name: "Passport OCR Validation", status: "succeeded", details: "Biometric document scans extracted successfully.", duration: "48.2s" },
      { id: "step-3", name: "AML Watchlist Multi-Match Scan", status: "running", details: "Querying OFAC / PEP registers. Processing batch 84/100...", duration: "1m 09s" },
      { id: "step-4", name: "Risk Calculation Engine Core", status: "pending", details: "Awaiting preceding step output.", duration: "—" }
    ]
  },
  {
    id: "SIM_Risk_Audit_02",
    name: "Q2 Compliance Simulation",
    status: "completed",
    owner: "sarah_jenkins",
    submittedAt: "2026-06-02T09:15:00Z",
    runtime: "4m 12s",
    processedItems: 120500,
    successRate: 100.0,
    outcomes: {
      approved: 104250,
      flagged: 12450,
      denied: 3800
    },
    steps: [
      { id: "step-1", name: "Data Ingestion & Schema Check", status: "succeeded", details: "120,500 records parsed correctly.", duration: "24.5s" },
      { id: "step-2", name: "Passport OCR Validation", status: "succeeded", details: "Parsed all identification photos.", duration: "1m 45s" },
      { id: "step-3", name: "AML Watchlist Multi-Match Scan", status: "succeeded", details: "Scanned database matches.", duration: "1m 12s" },
      { id: "step-4", name: "Risk Calculation Engine Core", status: "succeeded", details: "Calculated risk scores. Output written to audit database.", duration: "50.3s" }
    ]
  },
  {
    id: "SIM24_Daily_Run",
    name: "Daily Core Verification Batch",
    status: "failed",
    owner: "sarah_jenkins",
    submittedAt: "2026-06-01T23:30:00Z",
    runtime: "1m 05s",
    processedItems: 34091,
    successRate: 85.2,
    outcomes: {
      approved: 25400,
      flagged: 3100,
      denied: 591
    },
    steps: [
      { id: "step-1", name: "Data Ingestion & Schema Check", status: "succeeded", details: "Successfully parsed 34,091 records.", duration: "9.2s" },
      { id: "step-2", name: "Passport OCR Validation", status: "succeeded", details: "Completed document checks.", duration: "32.4s" },
      { id: "step-3", name: "AML Watchlist Multi-Match Scan", status: "failed", details: "Connection timeout on external AML registry server (HTTP 504).", duration: "23.4s" },
      { id: "step-4", name: "Risk Calculation Engine Core", status: "cancelled", details: "Terminated due to step failure.", duration: "—" }
    ]
  },
  {
    id: "WMS_Check_Run",
    name: "Ad-hoc High Net Worth Run",
    status: "ready",
    owner: "alex_smith_de",
    submittedAt: "2026-06-02T15:20:00Z",
    runtime: "—",
    processedItems: 1250,
    successRate: 0,
    outcomes: {
      approved: 0,
      flagged: 0,
      denied: 0
    },
    steps: [
      { id: "step-1", name: "Data Ingestion & Schema Check", status: "pending", details: "Awaiting start signal.", duration: "—" },
      { id: "step-2", name: "Passport OCR Validation", status: "pending", details: "Awaiting start signal.", duration: "—" },
      { id: "step-3", name: "AML Watchlist Multi-Match Scan", status: "pending", details: "Awaiting start signal.", duration: "—" },
      { id: "step-4", name: "Risk Calculation Engine Core", status: "pending", details: "Awaiting start signal.", duration: "—" }
    ]
  },
  {
    id: "Compliance_Check_01",
    name: "Weekly Outflow Screening",
    status: "cancelled",
    owner: "alex_smith_de",
    submittedAt: "2026-05-28T10:00:00Z",
    runtime: "12s",
    processedItems: 15400,
    successRate: 100,
    outcomes: {
      approved: 12000,
      flagged: 3400,
      denied: 0
    },
    steps: [
      { id: "step-1", name: "Data Ingestion & Schema Check", status: "succeeded", details: "Parsed 15,400 records.", duration: "12s" },
      { id: "step-2", name: "Passport OCR Validation", status: "cancelled", details: "Cancelled manually by operator.", duration: "—" }
    ]
  }
];

// Seed data for Analyzed Records
export const initialRecords: AnalyzedRecord[] = [
  {
    id: "REF-983012-Y",
    fullName: "Alexander Wright",
    email: "a.wright@voyagertech.co",
    country: "United Kingdom",
    transactionSize: 245000,
    submittedAt: "2026-06-02T10:14:00Z",
    riskRating: 82.5,
    calculatedL1: 50.0,
    calculatedL2: 32.5,
    status: "flagged",
    rulesFired: [
      { id: "RULE_PEP_MATCH", name: "PEP Watchlist Hit", condition: "Watchlist Match == TRUE", score: 40.0, category: "identity" },
      { id: "RULE_HIGH_VOLUME", name: "Excessive Transaction Volume", condition: "Volume > $150,000", score: 25.0, category: "transaction" },
      { id: "RULE_GEOGRAPHY_OUTFLOW", name: "Secondary Offshore Outflow", condition: "Country in OffshoreList", score: 17.5, category: "geography" }
    ],
    inputPayload: JSON.stringify({
      entity: {
        type: "individual",
        firstName: "Alexander",
        lastName: "Wright",
        dob: "1984-11-12",
        citizenship: "GBR"
      },
      payment: {
        amount: 245000.00,
        currency: "USD",
        sourceBank: "Barclays Private",
        destinationCountry: "CYM"
      },
      document: {
        type: "passport",
        number: "GB932840A",
        expiry: "2031-04-15"
      }
    }, null, 2),
    outputPayload: JSON.stringify({
      evaluation: {
        engineVersion: "v2.4.1",
        runId: "PRB001",
        timestamp: "2026-06-02T10:14:15Z"
      },
      result: {
        score: 82.5,
        decision: "FLAGGED_FOR_MANUAL_REVIEW",
        tier: "HIGH_RISK"
      },
      matchedRegisters: [
        { registry: "WorldCheck PEP List", score: 0.94, term: "Alexander J. Wright (Councillor)" }
      ]
    }, null, 2)
  },
  {
    id: "REF-104928-A",
    fullName: "Elena Rostova",
    email: "elena.rostova@cybernet.ch",
    country: "Switzerland",
    transactionSize: 89000,
    submittedAt: "2026-06-02T08:30:00Z",
    riskRating: 32.0,
    calculatedL1: 20.0,
    calculatedL2: 12.0,
    status: "approved",
    rulesFired: [
      { id: "RULE_MEDIUM_VOLUME", name: "Elevated Transaction Size", condition: "Volume > $50,000", score: 12.0, category: "transaction" },
      { id: "RULE_BIOMETRIC_DISCREPANCY", name: "Low Photo Confidence Match", condition: "Face Match < 75%", score: 20.0, category: "identity" }
    ],
    inputPayload: JSON.stringify({
      entity: {
        type: "individual",
        firstName: "Elena",
        lastName: "Rostova",
        dob: "1992-05-18",
        citizenship: "CHE"
      },
      payment: {
        amount: 89000.00,
        currency: "CHF",
        sourceBank: "UBS AG",
        destinationCountry: "CHE"
      }
    }, null, 2),
    outputPayload: JSON.stringify({
      evaluation: {
        engineVersion: "v2.4.1",
        timestamp: "2026-06-02T08:30:10Z"
      },
      result: {
        score: 32.0,
        decision: "APPROVED_AUTOMATICALLY",
        tier: "LOW_RISK"
      }
    }, null, 2)
  },
  {
    id: "REF-409122-C",
    fullName: "Marcus Aurelius Vance",
    email: "marcus@vancecap.gp",
    country: "Cayman Islands",
    transactionSize: 1200000,
    submittedAt: "2026-06-01T16:45:00Z",
    riskRating: 95.0,
    calculatedL1: 50.0,
    calculatedL2: 45.0,
    status: "denied",
    rulesFired: [
      { id: "RULE_SANCTION_HIT", name: "OFAC Sanctions Hit", condition: "Sanctions Database Match == TRUE", score: 50.0, category: "identity" },
      { id: "RULE_MEGA_VOLUME", name: "Excessive Volume Outliers", condition: "Volume > $1,000,000", score: 30.0, category: "transaction" },
      { id: "RULE_POBOX_ADDRESS", name: "PO Box Address Detection", condition: "AddressType == PO_BOX", score: 15.0, category: "geography" }
    ],
    inputPayload: JSON.stringify({
      entity: {
        type: "individual",
        firstName: "Marcus",
        lastName: "Vance",
        citizenship: "CYM"
      },
      payment: {
        amount: 1200000.00,
        currency: "USD",
        destinationCountry: "PAN"
      }
    }, null, 2),
    outputPayload: JSON.stringify({
      evaluation: {
        engineVersion: "v2.4.1",
        timestamp: "2026-06-01T16:45:20Z"
      },
      result: {
        score: 95.0,
        decision: "DENIED_COMPLIANCE_LOCK",
        tier: "VIOLATION"
      }
    }, null, 2)
  }
];
