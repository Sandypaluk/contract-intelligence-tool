import { useState } from 'react';

export default function PlainEnglishSummary({ summary }) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!summary) return null;

  // Split into sentences for numbered display
  const sentences = summary
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0)
    .slice(0, 5);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden h-fit">
      {/* Header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-myne-gold rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="text-left">
            <h2 className="text-base font-bold text-gray-900">Plain English</h2>
            <p className="text-xs text-gray-400">5-sentence summary</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
          {/* Quote mark decoration */}
          <div className="text-6xl text-myne-gold/20 font-serif leading-none mb-1 -mt-2">
            "
          </div>

          <div className="space-y-3 -mt-3">
            {sentences.map((sentence, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-myne-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px] font-bold">{i + 1}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{sentence.trim()}</p>
              </div>
            ))}
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              copied
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-myne-navy hover:text-white hover:border-myne-navy'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Summary
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-3">
            Suitable for sharing with non-legal stakeholders
          </p>
        </div>
      )}
    </div>
  );
}
