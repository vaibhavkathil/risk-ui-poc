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

export interface ExecutedRule {
  id: string;
  name: string;
  status: 'FAILED' | 'CRITICAL' | 'PASSED';
  category: string;
  duration: string;
}

export interface TimelineEvent {
  time: string;
  title: string;
  description: string;
}

export interface TransactionRecord {
  id: string;
  entityName: string;
  category: 'Retail' | 'Corporate' | 'FI';
  riskRating: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  score: number; // e.g. 0.92
  status: 'Flagged' | 'Approved' | 'Denied';
  duration: string; // e.g. '45ms'
  processedAt: string; // ISO date string
  submittedAgo: string; // e.g. '15 mins ago'
  flags: string[]; // e.g. ['PEP/SANCTIONS MATCH', 'CRITICAL RISK']
  rules: ExecutedRule[];
  timeline: TimelineEvent[];
  inputPayload: string;
  outputPayload: string;
}

export interface StageConfig {
  id: string;
  name: string;
  isActive: boolean;
}

export interface RuleActivation {
  id: string;
  name: string;
  type: 'JSON' | 'DB' | 'AI' | 'API';
  isActive: boolean;
  stageId: string;
}

// Initial Transaction Records
export const initialTransactions: TransactionRecord[] = [
  {
    id: "T-9034-A",
    entityName: "Investigation: Corporate Liquidity Sweep",
    category: "Corporate",
    riskRating: "CRITICAL",
    score: 0.92,
    status: "Flagged",
    duration: "45ms",
    processedAt: "2026-06-08T11:30:00Z",
    submittedAgo: "15 mins ago",
    flags: ["PEP/SANCTIONS MATCH", "CRITICAL RISK"],
    rules: [
      { id: "FL-0121", name: "Jurisdiction Risk: Russia check", status: "FAILED", category: "Compliance", duration: "22.4ms" },
      { id: "FL-0212", name: "AML Entity: Sanction Match", status: "CRITICAL", category: "Screening", duration: "12.0ms" },
      { id: "FL-0331", name: "Aggregate Daily Limit validation", status: "PASSED", category: "Limit", duration: "5.0ms" }
    ],
    timeline: [
      { time: "10:45:00 UTC", title: "Analysis Started", description: "System triggered automated elements (API gateway)." },
      { time: "10:45:05 UTC", title: "Alert Warning Generated", description: "Sanctions Screening returned potential match on Beneficiary entity." },
      { time: "10:46:12 UTC", title: "Assigned to S. Henderson", description: "Workflow engine moved record to manual review queue." }
    ],
    inputPayload: JSON.stringify({
      transaction_id: "T-9034-A",
      amount: 4500000.00,
      currency: "EUR",
      beneficiary: {
        name: "GLOBAL LOGISTICS LTD",
        jurisdiction: "RU"
      },
      metadata: {
        origin_ip: "185.112.2.43",
        client_type: "corporate"
      }
    }, null, 2),
    outputPayload: JSON.stringify({
      score: 0.92,
      recommended_verdict: "FLAGGED_FOR_MANUAL_REVIEW",
      triggered_rules: [
        "JURISDICTION_RUSSIA_CHECK",
        "AML_SANCTION_MATCH"
      ]
    }, null, 2)
  },
  {
    id: "T-9034-B",
    entityName: "Marcus Aurelius Vance",
    category: "FI",
    riskRating: "HIGH",
    score: 0.78,
    status: "Flagged",
    duration: "65ms",
    processedAt: "2026-06-08T10:15:00Z",
    submittedAgo: "1 hour ago",
    flags: ["HIGH VALUE VOLATILITY", "PEPEP MATCH"],
    rules: [
      { id: "FL-0112", name: "High Net Worth volume screening", status: "FAILED", category: "Limit", duration: "35.2ms" },
      { id: "FL-0221", name: "PEP Watchlist screening match", status: "FAILED", category: "Screening", duration: "18.4ms" },
      { id: "FL-0442", name: "Biometric Liveness Verification", status: "PASSED", category: "Identity", duration: "8.2ms" }
    ],
    timeline: [
      { time: "09:15:00 UTC", title: "Analysis Started", description: "Triggered standard HNW evaluation checks." },
      { time: "09:15:15 UTC", title: "PEP Flag Triggered", description: "Direct PEP hit found on database search." }
    ],
    inputPayload: JSON.stringify({
      transaction_id: "T-9034-B",
      amount: 1250000.00,
      currency: "USD",
      originator: {
        name: "Marcus Aurelius Vance",
        jurisdiction: "CYM"
      }
    }, null, 2),
    outputPayload: JSON.stringify({
      score: 0.78,
      recommended_verdict: "FLAGGED",
      triggered_rules: [
        "HNW_VOLUME_SCREENING",
        "PEP_WATCHLIST"
      ]
    }, null, 2)
  },
  {
    id: "T-9034-C",
    entityName: "Yuki Tanaka",
    category: "Retail",
    riskRating: "LOW",
    score: 0.15,
    status: "Approved",
    duration: "25ms",
    processedAt: "2026-06-08T09:40:00Z",
    submittedAgo: "2 hours ago",
    flags: [],
    rules: [
      { id: "FL-0101", name: "Basic Identity scan check", status: "PASSED", category: "Identity", duration: "12.0ms" },
      { id: "FL-0321", name: "Sanctions list verification", status: "PASSED", category: "Screening", duration: "11.2ms" }
    ],
    timeline: [
      { time: "09:39:00 UTC", title: "Analysis Started", description: "Automated processing checks initiated." },
      { time: "09:40:00 UTC", title: "System Approved", description: "No checks triggered. Case resolved automatically." }
    ],
    inputPayload: JSON.stringify({
      transaction_id: "T-9034-C",
      amount: 15000.00,
      currency: "JPY",
      originator: {
        name: "Yuki Tanaka",
        jurisdiction: "JPN"
      }
    }, null, 2),
    outputPayload: JSON.stringify({
      score: 0.15,
      recommended_verdict: "APPROVED",
      triggered_rules: []
    }, null, 2)
  },
  {
    id: "T-9034-D",
    entityName: "Carlos Mendoza",
    category: "Corporate",
    riskRating: "CRITICAL",
    score: 0.95,
    status: "Denied",
    duration: "112ms",
    processedAt: "2026-06-07T14:20:00Z",
    submittedAgo: "1 day ago",
    flags: ["SANCTIONS SEVERE MATCH", "PO BOX VIOLATION"],
    rules: [
      { id: "FL-0105", name: "Sanctions Database strict check", status: "CRITICAL", category: "Screening", duration: "68.2ms" },
      { id: "FL-0402", name: "PO Box address constraint", status: "FAILED", category: "Compliance", duration: "32.0ms" }
    ],
    timeline: [
      { time: "14:18:00 UTC", title: "Analysis Started", description: "Batch evaluation started." },
      { time: "14:20:00 UTC", title: "Automatic Reject", description: "Severe sanctions match triggered block." }
    ],
    inputPayload: JSON.stringify({
      transaction_id: "T-9034-D",
      amount: 950000.00,
      currency: "COP",
      originator: {
        name: "Carlos Mendoza",
        address: "P.O. Box 4839, Bogota"
      }
    }, null, 2),
    outputPayload: JSON.stringify({
      score: 0.95,
      recommended_verdict: "DENIED",
      triggered_rules: [
        "SANCTIONS_SEVERE_MATCH",
        "PO_BOX_VIOLATION"
      ]
    }, null, 2)
  }
];

// Initial Stages Config (1 to 12)
export const initialStages: StageConfig[] = [
  { id: "stg-1", name: "1. Identity Check", isActive: true },
  { id: "stg-2", name: "2. Document OCR", isActive: true },
  { id: "stg-3", name: "3. Biometric Match", isActive: true },
  { id: "stg-4", name: "4. Sanction Screening", isActive: true },
  { id: "stg-5", name: "5. PEP Validation", isActive: true },
  { id: "stg-6", name: "6. Adverse Media", isActive: false },
  { id: "stg-7", name: "7. Geolocation Risk", isActive: true },
  { id: "stg-8", name: "8. Velocity Check", isActive: true },
  { id: "stg-9", name: "9. Source of Funds", isActive: false },
  { id: "stg-10", name: "10. Transaction Flow", isActive: true },
  { id: "stg-11", name: "11. Compliance Audit", isActive: true },
  { id: "stg-12", name: "12. Final Approval", isActive: true }
];

// Initial Rule Activations grouped by stages
export const initialRuleActivations: RuleActivation[] = [
  // Stage 1: Identity Checks
  { id: "ID-001", name: "Syntax Regex Validation", type: "JSON", isActive: true, stageId: "stg-1" },
  { id: "ID-002", name: "Duplicate Email Check", type: "DB", isActive: true, stageId: "stg-1" },
  
  // Stage 3: Biometric Match
  { id: "BIO-01", name: "Facial Liveness Detection", type: "AI", isActive: true, stageId: "stg-3" },
  { id: "BIO-02", name: "Template Signature Analysis", type: "AI", isActive: false, stageId: "stg-3" },
  
  // Stage 4: Sanction Screening
  { id: "SANC-01", name: "OFAC SDN Match", type: "API", isActive: true, stageId: "stg-4" },
  { id: "SANC-02", name: "EU Consolidated List Check", type: "API", isActive: true, stageId: "stg-4" },
  { id: "SANC-03", name: "Interpol Notice Verification", type: "API", isActive: false, stageId: "stg-4" },
  
  // Stage 7: Geolocation Risk
  { id: "GEO-01", name: "Russia Ingress Check", type: "API", isActive: true, stageId: "stg-7" },
  { id: "GEO-02", name: "Sanctioned Countries Inbound", type: "JSON", isActive: true, stageId: "stg-7" }
];
