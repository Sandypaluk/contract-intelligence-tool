import { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function ExportOptions({ analysis, filename }) {
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const baseName = filename
    ? filename.replace(/\.pdf$/i, '')
    : 'contract-analysis';

  // ── JSON Export ──────────────────────────────────────────────────────────
  const handleJSONExport = () => {
    const blob = new Blob([JSON.stringify(analysis, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}-analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Copy JSON ────────────────────────────────────────────────────────────
  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
      setCopiedJSON(true);
      setTimeout(() => setCopiedJSON(false), 2000);
    } catch {
      handleJSONExport(); // Fallback to download
    }
  };

  // ── PDF Export ───────────────────────────────────────────────────────────
  const handlePDFExport = async () => {
    setExportingPDF(true);
    try {
      await generatePDF(analysis, baseName);
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-myne-navy rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">Export Analysis</h2>
          <p className="text-xs text-gray-400">Download or share your contract analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* PDF Report */}
        <button
          onClick={handlePDFExport}
          disabled={exportingPDF}
          className="group flex flex-col items-center gap-3 p-5 border-2 border-dashed border-gray-200 rounded-xl hover:border-myne-red hover:bg-red-50/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
            {exportingPDF ? (
              <div className="w-5 h-5 border-2 border-myne-red/30 border-t-myne-red rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6 text-myne-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800 group-hover:text-myne-red transition-colors">
              {exportingPDF ? 'Generating...' : 'PDF Report'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Full analysis as PDF</p>
          </div>
        </button>

        {/* JSON Export */}
        <button
          onClick={handleJSONExport}
          className="group flex flex-col items-center gap-3 p-5 border-2 border-dashed border-gray-200 rounded-xl hover:border-myne-navy hover:bg-blue-50/20 transition-all"
        >
          <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-myne-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800 group-hover:text-myne-navy transition-colors">
              JSON Data
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Structured data export</p>
          </div>
        </button>

        {/* Copy JSON */}
        <button
          onClick={handleCopyJSON}
          className="group flex flex-col items-center gap-3 p-5 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50/30 transition-all"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            copiedJSON ? 'bg-green-100' : 'bg-gray-50 group-hover:bg-green-50'
          }`}>
            {copiedJSON ? (
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-400 group-hover:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <div className="text-center">
            <p className={`text-sm font-bold transition-colors ${
              copiedJSON ? 'text-green-700' : 'text-gray-800 group-hover:text-green-700'
            }`}>
              {copiedJSON ? 'Copied!' : 'Copy JSON'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Copy to clipboard</p>
          </div>
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        All exports are for internal use only. Do not share raw AI analysis as legal advice.
      </p>
    </div>
  );
}

// ── PDF Generation ────────────────────────────────────────────────────────────
async function generatePDF(analysis, baseName) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ── Helper: add new page if needed ────────────────────────────────────────
  const checkPage = (neededHeight = 20) => {
    if (y + neededHeight > 270) {
      doc.addPage();
      y = 18;
    }
  };

  const addText = (text, x, yPos, opts = {}) => {
    doc.text(String(text || ''), x, yPos, opts);
  };

  // ── Cover / Header ────────────────────────────────────────────────────────
  // Navy header band
  doc.setFillColor(13, 33, 55); // myne-navy
  doc.rect(0, 0, pageW, 42, 'F');

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  addText('MYNE Homes', margin, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 180, 200);
  addText('Contract Intelligence Report', margin, 26);
  addText(
    `Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    margin, 33
  );

  // Red accent bar
  doc.setFillColor(196, 30, 58);
  doc.rect(0, 42, pageW, 2, 'F');

  y = 54;

  // ── Risk Score Banner ─────────────────────────────────────────────────────
  const ri = analysis.riskIntelligence || {};
  const score = ri.overallRiskScore ?? '—';
  const scoreNum = Number(score);
  const [r, g, b] = scoreNum <= 30 ? [22, 163, 74] : scoreNum <= 60 ? [217, 119, 6] : [220, 38, 38];

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentW, 22, 3, 3, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(margin, y, contentW, 22, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(r, g, b);
  addText(String(score), margin + 6, y + 14);

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  addText('/ 100', margin + 16, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  const riskLabel = scoreNum <= 30 ? 'LOW RISK' : scoreNum <= 60 ? 'MEDIUM RISK' : scoreNum <= 80 ? 'HIGH RISK' : 'CRITICAL RISK';
  addText(riskLabel, margin + 32, y + 11);

  if (ri.riskSummary) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    const summaryLines = doc.splitTextToSize(ri.riskSummary, contentW - 40);
    doc.text(summaryLines.slice(0, 2), margin + 32, y + 17);
  }

  y += 30;

  // ── Section helper ────────────────────────────────────────────────────────
  const addSection = (title) => {
    checkPage(14);
    doc.setFillColor(13, 33, 55);
    doc.rect(margin, y, 3, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(13, 33, 55);
    addText(title, margin + 7, y + 6);
    y += 13;
  };

  const addField = (label, value) => {
    if (!value || value === 'Not specified') return;
    checkPage(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    addText(label.toUpperCase(), margin, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(String(value), contentW);
    doc.text(lines, margin, y);
    y += lines.length * 4.5 + 3;
  };

  // ── Extracted Data ────────────────────────────────────────────────────────
  const ed = analysis.extractedData || {};
  addSection('EXTRACTED CONTRACT DATA');

  const parties = ed.parties || {};
  const partyFields = [
    ['Buyer', parties.buyer], ['Seller', parties.seller],
    ['Notary', parties.notary], ['Agent / Broker', parties.agent],
  ];
  partyFields.forEach(([l, v]) => addField(l, v));
  addField('Property Address', ed.propertyAddress);
  addField('Property Description', ed.propertyDescription);
  addField('Purchase Price', ed.purchasePrice);
  addField('Ownership Share', ed.ownershipShare);
  addField('Jurisdiction', ed.jurisdiction);
  addField('Governing Law', ed.governingLaw);

  // Payment Schedule table
  if (ed.paymentSchedule && ed.paymentSchedule.length > 0) {
    checkPage(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    addText('PAYMENT SCHEDULE', margin, y);
    y += 5;

    doc.autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Amount', 'Due Date', 'Description']],
      body: ed.paymentSchedule.map((p) => [p.amount || '—', p.dueDate || '—', p.description || '—']),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [13, 33, 55], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  // Key Dates
  if (ed.keyDates && ed.keyDates.length > 0) {
    checkPage(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    addText('KEY DATES', margin, y);
    y += 5;

    doc.autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Date', 'Event']],
      body: ed.keyDates.map((d) => [d.date || '—', d.event || '—']),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [13, 33, 55], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  // ── Plain English Summary ─────────────────────────────────────────────────
  if (analysis.plainEnglishSummary) {
    checkPage(20);
    addSection('PLAIN ENGLISH SUMMARY');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    const summLines = doc.splitTextToSize(analysis.plainEnglishSummary, contentW);
    checkPage(summLines.length * 4.5 + 5);
    doc.text(summLines, margin, y);
    y += summLines.length * 4.5 + 8;
  }

  // ── Risk Intelligence ─────────────────────────────────────────────────────
  addSection('RISK INTELLIGENCE');

  const flagSections = [
    { key: 'redFlags', label: 'HIGH RISK — Red Flags', color: [220, 38, 38] },
    { key: 'yellowFlags', label: 'REVIEW NEEDED — Amber Flags', color: [217, 119, 6] },
    { key: 'greenFlags', label: 'STANDARD & SAFE — Green Flags', color: [22, 163, 74] },
  ];

  flagSections.forEach(({ key, label, color }) => {
    const flags = ri[key] || [];
    if (flags.length === 0) return;
    checkPage(15);

    doc.setFillColor(...color.map((c) => Math.round(c * 0.15 + 240)));
    doc.roundedRect(margin, y, contentW, 7, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...color);
    addText(label, margin + 4, y + 5);
    y += 10;

    flags.forEach((flag) => {
      checkPage(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 30, 30);
      const clauseLines = doc.splitTextToSize(`• ${flag.clause || ''}`, contentW - 4);
      doc.text(clauseLines, margin + 2, y);
      y += clauseLines.length * 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      const descLines = doc.splitTextToSize(flag.description || '', contentW - 8);
      checkPage(descLines.length * 4.5);
      doc.text(descLines, margin + 6, y);
      y += descLines.length * 4.5;

      if (flag.recommendation) {
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(...color);
        const recLines = doc.splitTextToSize(`→ ${flag.recommendation}`, contentW - 8);
        checkPage(recLines.length * 4.5);
        doc.text(recLines, margin + 6, y);
        y += recLines.length * 4.5;
      }
      y += 4;
    });
    y += 4;
  });

  // ── Obligations ───────────────────────────────────────────────────────────
  const ob = analysis.obligations || {};
  const obSections = [
    { key: 'buyer', label: 'Buyer Obligations', color: [13, 33, 55] },
    { key: 'seller', label: 'Seller Obligations', color: [109, 40, 217] },
    { key: 'shared', label: 'Shared Obligations', color: [13, 148, 136] },
  ];

  const hasObligation = obSections.some((s) => (ob[s.key] || []).length > 0);
  if (hasObligation) {
    addSection('OBLIGATIONS TRACKER');
    obSections.forEach(({ key, label, color }) => {
      const items = ob[key] || [];
      if (items.length === 0) return;
      checkPage(15);

      doc.autoTable({
        startY: y,
        margin: { left: margin, right: margin },
        head: [[label, 'Deadline', 'Consequence']],
        body: items.map((it) => [it.obligation || '—', it.deadline || '—', it.consequence || '—']),
        styles: { fontSize: 7.5, cellPadding: 3 },
        headStyles: { fillColor: color, textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: contentW * 0.5 },
          1: { cellWidth: contentW * 0.2 },
          2: { cellWidth: contentW * 0.3 },
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });
      y = doc.lastAutoTable.finalY + 6;
    });
  }

  // ── Footer on all pages ───────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 285, pageW, 12, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    addText('MYNE Homes · Contract Intelligence · For internal use only · AI analysis is guidance — not legal advice', margin, 292);
    addText(`Page ${i} of ${totalPages}`, pageW - margin - 20, 292);
  }

  doc.save(`${baseName}-myne-analysis.pdf`);
}
