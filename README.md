# KYC RiskEngine UI (Proof of Concept)

A high-fidelity compliance operations interface built in React and TypeScript. This application is modeled after the **Risk On Demand** (ROD) pipelines and **Risk Analysis** debugging wireframes.

---

## Key Features

1. **ROD Run Analytics Dashboard**
   - Summary statistics representing total pipeline runs, failure incidents, success rates, and average calculation latencies.
   - Interactive monthly volume column charts and success trend curves drawn using lightweight vector SVGs.
   - Core outcome ratios showing Approved vs. Flagged vs. Denied case breakdowns.

2. **Pipelines / ROD Runs Tracker Queue**
   - Execution pipeline queue filterable by statuses (`Ready`, `Running`, `Completed`, `Failed`, `Cancelled`).
   - Dynamic trigger buttons to manually Start, Stop, or Rerun batch verification runs.
   - Global status banners flagging pipelines ready for manual bulk actions.

3. **Individual Run Detail Screen**
   - Deep inspection view displaying batch-processing speed, overall success ratios, and outcome breakdown meters.
   - Step execution checklist (e.g., Data Ingestion, OCR Document Scan, Watchlist Match Scan, Core Calculation Engine) tracking progress and individual run times.

4. **Risk Analysis Record Index**
   - Searchable database index of evaluated customer records showing transaction sizes, source countries, calculated risk ratings, and compliance statuses.

5. **Decision Debugger & Result Explanation**
   - **Result Explanation Tree:** A hierarchical calculation chart drawn using SVG connector vectors mapping triggered rules directly to Level 1 and Level 2 score weights and summing them into the final rating.
   - **Technical Debugger:** Tabular engine rules evaluation list mapping logic conditions and score impact weights.
   - **Payload Comparison:** Side-by-side formatted JSON code views highlighting incoming ingest parameters (`payload_in.json`) vs. outgoing calculated verdicts (`payload_out.json`).
   - **Agent Discussion Panel:** An interactive AI chatbot assistant in context of the record to simulate PEP validation checks and explain matching birth date exceptions.
   - **Manual Override:** Verdict override popup to let compliance officers manually approve or block records with audit trail logging.

---

## Tech Stack & Architecture

- **Core Framework:** React 19 (Vite)
- **Programming Language:** TypeScript
- **Styling Method:** Custom Vanilla CSS (Dark-themed dashboard aesthetic, glassmorphism containers, neon status indicators, and smooth state animations)
- **Routing Engine:** React Router (BrowserRouter)
- **State Management:** React Context API (custom `useApp` hooks for real-time state updates across list and detail page views)
- **Icons Library:** Lucide React

---

## Local Development Instructions

### Prerequisites
Vite requires Node.js `^20.19.0` or `>=22.12.0`. A `.nvmrc` file is configured in the root directory.

### Quick Start
1. Ensure you have NVM (Node Version Manager) installed, then configure the compatible Node version:
   ```bash
   nvm use
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser:
   ```
   http://localhost:5173/
   ```

---

## Codebase Map

- `/src/App.tsx`: Main router routing table and shell navigation sidebar.
- `/src/index.css`: Design variables, CSS tokens, global reset styles, and utility classes.
- `/src/AppContext.tsx`: State Provider handling updates for batch pipeline runs, record reviews, and audit logging.
- `/src/mockData.ts`: Static interfaces and high-fidelity seed records.
- `/src/pages/`:
  - `Dashboard.tsx`: Performance indicators, monthly charts, and success trends.
  - `RunsList.tsx`: Pipelines list and execution controls.
  - `RunDetails.tsx`: Processing metrics and sub-execution checklists.
  - `RiskAnalysis.tsx`: Evaluated accounts search engine table.
  - `DebugDetail.tsx`: Tabs for Result Tree, JSON payload comparisons, AI Agent chat panel, and manual status overrides.
