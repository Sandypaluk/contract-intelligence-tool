import { useState } from 'react';

function FlagItem({ item, type }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const config = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-700',
      icon: (
        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      dot: 'bg-red-500',
      recLabel: 'Action Required',
      recStyle: 'bg-red-100 border border-red-200 text-red-800',
    },
    yellow: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-700',
      icon: (
        <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      dot: 'bg-amber-500',
      recLabel: 'Review Recommended',
      recStyle: 'bg-amber-50 border border-amber-200 text-amber-800',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-700',
      icon: (
        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ),
      dot: 'bg-green-500',
      recLabel: 'Standard Clause',
      recStyle: 'bg-green-50 border border-green-200 text-green-800',
    },
  }[type];

  return (
    <div className={`${config.bg} ${config.border} border rounded-xl overflow-hidden`}>
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full flex items-start gap-3 p-4 text-left hover:brightness-95 transition-all"
      >
        {config.icon}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-800 block leading-tight">
            {item.clause}
          </span>
          <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">
            {item.description}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-current/10 pt-3 space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
          {item.recommendation && (
            <div className={`${config.recStyle} rounded-lg px-3 py-2.5`}>
              <p className="text-xs font-bold uppercase tracking-wide mb-1 opacity-70">
                {config.recLabel}
              </p>
              <p className="text-sm font-medium leading-snug">{item.recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RiskIntelligence({ riskIntelligence }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!riskIntelligence) return null;

  const { redFlags = [], yellowFlags = [], greenFlags = [] } = riskIntelligence;
  const total = redFlags.length + yellowFlags.length + greenFlags.length;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-myne-red rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="text-left">
            <h2 className="text-base font-bold text-gray-900">Risk Intelligence</h2>
            <p className="text-xs text-gray-400">{total} clause{total !== 1 ? 's' : ''} analysed</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Flag count badges */}
          {redFlags.length > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {redFlags.length} Red
            </span>
          )}
          {yellowFlags.length > 0 && (
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {yellowFlags.length} Amber
            </span>
          )}
          {greenFlags.length > 0 && (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {greenFlags.length} Green
            </span>
          )}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ml-1 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Red Flags */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide">
                  High Risk ({redFlags.length})
                </h3>
              </div>
              {redFlags.length === 0 ? (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-green-600 font-medium">No high-risk clauses found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {redFlags.map((flag, i) => (
                    <FlagItem key={i} item={flag} type="red" />
                  ))}
                </div>
              )}
            </div>

            {/* Yellow Flags */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wide">
                  Review Needed ({yellowFlags.length})
                </h3>
              </div>
              {yellowFlags.length === 0 ? (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-green-600 font-medium">No clauses needing review</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {yellowFlags.map((flag, i) => (
                    <FlagItem key={i} item={flag} type="yellow" />
                  ))}
                </div>
              )}
            </div>

            {/* Green Flags */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide">
                  Standard &amp; Safe ({greenFlags.length})
                </h3>
              </div>
              {greenFlags.length === 0 ? (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-400">No standard clauses identified</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {greenFlags.map((flag, i) => (
                    <FlagItem key={i} item={flag} type="green" />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
