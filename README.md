# 📄 MYNE Contract Intelligence Tool

An AI-powered legal document analysis tool that instantly extracts 
key information, flags risks, and explains complex contracts in plain 
English — built for European vacation home co-ownership transactions.

Built with Claude API to eliminate manual document review for legal, 
operations and sales teams handling high volumes of property agreements.

## 🚀 Live Demo
[Live App][https://contract-intelligence-tool.vercel.app/]

## 💡 The Problem It Solves
Real estate transactions involve mountains of legal paperwork — 
purchase contracts, notary agreements, co-ownership agreements, 
and rental contracts across multiple European jurisdictions and 
languages. Reviewing these manually is slow, expensive, and 
error-prone.

This tool eliminates that bottleneck:
- Legal teams no longer need to manually review every document 
  from scratch
- Non-legal stakeholders can instantly understand what they're 
  signing
- Risk clauses are automatically surfaced before they become 
  problems
- Reduces document review time from hours to seconds
- Works across English and German documents — critical for 
  DACH market operations

## ✨ Features

### 📤 Smart PDF Upload
- Drag and drop any legal document up to 20MB
- Supports contracts in English and German
- Animated progress bar with live status messages while 
  AI analyses

### 🔍 Intelligent Data Extraction
- Parties involved (buyer, seller, notary, agent)
- Property address and full description
- Purchase price and payment schedule
- Ownership share percentage (critical for co-ownership)
- Key dates and deadlines
- Jurisdiction and governing law

### 🚨 Risk Intelligence Engine
- 🔴 Red flags — high risk clauses requiring immediate attention
- 🟡 Amber flags — clauses needing review before signing
- 🟢 Green flags — standard, safe clauses
- Overall risk score 0-100 with plain English explanation

### 📋 Obligations Tracker
- Buyer obligations with deadlines
- Seller obligations with deadlines
- Shared obligations between parties

### 💬 Plain English Summary
- Complex legal language translated into clear sentences
- Suitable for non-legal stakeholders and international buyers
- One-click copy to clipboard

### 🤖 Interactive Q&A
- Ask any question about the specific document
- Claude answers based only on the uploaded contract content
- Full chat history maintained throughout session
- e.g. "What happens if the buyer misses the payment deadline?"

### 📥 Export Options
- Export full analysis as branded PDF report
- Download structured data as JSON
- Copy summary to clipboard

## 📊 Business Impact
| Metric | Before | After |
|---|---|---|
| Time to review one contract | 2-3 hours (lawyer) | Under 60 seconds |
| Risk identification | Manual, error-prone | Automated, consistent |
| Accessibility | Legal expertise required | Anyone can understand |
| Cost per review | High (legal fees) | Near zero |
| Languages supported | One at a time | English + German |
| Bottleneck to sales closing | 5 day backlog | Same day for standard contracts |

## 🏠 Real Estate Use Cases
Optimised for contracts governed by laws of:
- 🇩🇪 **Germany** — Kaufvertrag, Mietvertrag, Notarvertrag
- 🇦🇹 **Austria** — Co-ownership and property agreements
- 🇨🇭 **Switzerland** — Stockwerkeigentum agreements
- 🇬🇧 **United Kingdom** — Purchase and rental agreements
- 🇫🇷 **France** — Compromis de vente

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **PDF Parsing:** pdf-parse (server-side text extraction)
- **PDF Export:** jsPDF + jspdf-autotable
- **Deployment:** Vercel Serverless Functions

## ⚙️ Run Locally
```bash
git clone https://github.com/Sandypaluk/contract-intelligence-tool
cd contract-intelligence-tool
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev
```

Open http://localhost:5173

## 🧠 How It Works
1. User uploads a PDF contract via drag-and-drop interface
2. Backend extracts raw text using pdf-parse library
3. Extracted text is sent to Claude API in a single optimised call
4. Claude returns structured JSON with all analysis sections
5. Frontend renders a full intelligence dashboard with 
   collapsible sections
6. User can ask follow-up questions via the interactive Q&A chat
7. Full analysis exportable as PDF report or JSON
## ⚡ Engineering Decisions

**Single API call architecture:**
All analysis — extraction, risk scoring, obligations tracking, 
plain English summary — happens in one Claude API call returning 
structured JSON. This minimises latency and cost while maximising 
consistency of output.

**Server-side PDF parsing:**
PDF text extraction happens on the Express backend, not in the 
browser. This handles large files efficiently and keeps processing 
off the client device.

## 💼 Why This Matters for PropTech
Co-ownership vacation home transactions involve complex multi-party 
agreements across different European legal systems. A tool that 
instantly surfaces risks and obligations doesn't just save time — 
it reduces legal liability, builds buyer confidence, and directly 
accelerates sales cycles by eliminating the legal review bottleneck 
that delays closings.

In a company processing 50+ contracts per month, this tool saves 
an estimated 100-150 hours of legal review time monthly.

## 👩‍💻 Built By
Sandra Paluku — AI & Automation Builder
