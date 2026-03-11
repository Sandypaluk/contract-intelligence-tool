import { useState } from 'react';

function ObligationItem({ item, color }) {
  const colors = {
    buyer: {
      dot: 'bg-myne-navy',
      badge: 'bg-blue-50 text-blue-700 border-blue-100',
      deadlineBg: 'bg-blue-50',
      deadlineText: 'text-blue-700',
      consequenceStyle: 'bg-orange-50 border border-orange-100 text-orange-800',
    },
    seller: {
      dot: 'bg-purple-600',
      badge: 'bg-purple-50 text-purple-700 border-purple-100',
      deadlineBg: 'bg-purple-50',
      deadlineText: 'text-purple-700',
      consequenceStyle: 'bg-orange-50 border border-orange-100 text-orange-800',
    },
    shared: {
      dot: 'bg-teal-600',
      badge: 'bg-teal-50 text-teal-700 border-teal-100',
      deadlineBg: 'bg-teal-50',
      deadlineText: 'text-teal-700',
      consequenceStyle: '',
    },
  }[color];

  return (
    <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors bg-gray-50/50">
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full ${colors.dot} mt-1.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-snug mb-2">
            {item.obligation}
          </p>
          {item.deadline && item.deadline !== 'Not specified' && (
            <div className={`inline-flex items-center gap-1.5 ${colors.deadlineBg} ${colors.deadlineText} text-xs font-semibold px-2.5 py-1 rounded-full`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {item.deadline}
            </div>
          )}
          {item.consequence && item.consequence !== 'Not specified' && color !== 'shared' && (
            <div className={`${colors.consequenceStyle} rounded-lg px-3 py-2 mt-2`}>
              <span className="text-xs font-bold uppercase tracking-wide opacity-60 block mb-0.5">
                Consequence if missed
              </span>
              <span className="text-xs leading-snug">{item.consequence}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ObligationsTracker({ obligations }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('buyer');

  if (!obligations) return null;

  const { buyer = [], seller = [], shared = [] } = obligations;

  const tabs = [
    { id: 'buyer', label: 'Buyer', count: buyer.length, color: 'bg-myne-navy' },
    { id: 'seller', label: 'Seller', count: seller.length, color: 'bg-purple-600' },
    { id: 'shared', label: 'Shared', count: shared.length, color: 'bg-teal-600' },
  ];

  const activeItems = { buyer, seller, shared }[activeTab] || [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-myne-navy-light rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="text-left">
            <h2 className="text-base font-bold text-gray-900">Obligations Tracker</h2>
            <p className="text-xs text-gray-400">
              {buyer.length + seller.length + shared.length} total obligations identified
            </p>
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
        <div className="border-t border-gray-100">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-6 gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all -mb-px ${
                  activeTab === tab.id
                    ? 'border-myne-red text-myne-red'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-red-100 text-myne-red'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">No {activeTab} obligations found in this contract</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeItems.map((item, i) => (
                  <ObligationItem key={i} item={item} color={activeTab} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
