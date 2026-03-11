import { useState } from 'react';

function Field({ label, value }) {
  if (!value || value === 'Not specified') {
    return (
      <div>
        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
          {label}
        </dt>
        <dd className="text-sm text-gray-400 italic">Not specified</dd>
      </div>
    );
  }
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </dt>
      <dd className="text-sm font-medium text-gray-800 leading-snug">{value}</dd>
    </div>
  );
}

export default function ExtractedData({ data }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!data) return null;

  const { parties, propertyAddress, propertyDescription, purchasePrice,
    paymentSchedule, ownershipShare, keyDates, jurisdiction, governingLaw } = data;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-myne-navy rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-left">
            <h2 className="text-base font-bold text-gray-900">Extracted Contract Data</h2>
            <p className="text-xs text-gray-400">Parties, property, price and key information</p>
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
        <div className="px-6 pb-6">
          <div className="border-t border-gray-100 pt-5">

            {/* Parties */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-myne-navy uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1 h-3 bg-myne-red rounded-full inline-block"></span>
                Parties Involved
              </h3>
              <dl className="grid grid-cols-2 gap-4">
                <Field label="Buyer" value={parties?.buyer} />
                <Field label="Seller" value={parties?.seller} />
                <Field label="Notary" value={parties?.notary} />
                <Field label="Agent / Broker" value={parties?.agent} />
              </dl>
            </div>

            {/* Property */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-myne-navy uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1 h-3 bg-myne-red rounded-full inline-block"></span>
                Property Details
              </h3>
              <dl className="grid grid-cols-1 gap-4">
                <Field label="Address" value={propertyAddress} />
                <Field label="Description" value={propertyDescription} />
              </dl>
            </div>

            {/* Financial */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-myne-navy uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1 h-3 bg-myne-red rounded-full inline-block"></span>
                Financial Terms
              </h3>
              <dl className="grid grid-cols-2 gap-4 mb-4">
                <Field label="Purchase Price" value={purchasePrice} />
                <Field label="Ownership Share" value={ownershipShare} />
              </dl>

              {/* Payment Schedule */}
              {paymentSchedule && paymentSchedule.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Payment Schedule
                  </p>
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</th>
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paymentSchedule.map((p, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-myne-navy">{p.amount || '—'}</td>
                            <td className="px-4 py-3 text-gray-600">{p.dueDate || '—'}</td>
                            <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.description || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Dates & Jurisdiction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Key Dates */}
              {keyDates && keyDates.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-myne-navy uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1 h-3 bg-myne-red rounded-full inline-block"></span>
                    Key Dates
                  </h3>
                  <div className="space-y-2">
                    {keyDates.map((d, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-myne-red mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-semibold text-myne-navy block">{d.date}</span>
                          <span className="text-xs text-gray-500">{d.event}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jurisdiction */}
              <div>
                <h3 className="text-xs font-bold text-myne-navy uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1 h-3 bg-myne-red rounded-full inline-block"></span>
                  Legal Framework
                </h3>
                <dl className="space-y-3">
                  <Field label="Jurisdiction" value={jurisdiction} />
                  <Field label="Governing Law" value={governingLaw} />
                </dl>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
