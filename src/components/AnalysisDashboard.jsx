import ExtractedData from './ExtractedData';
import RiskIntelligence from './RiskIntelligence';
import ObligationsTracker from './ObligationsTracker';
import PlainEnglishSummary from './PlainEnglishSummary';

export default function AnalysisDashboard({ analysis }) {
  const { extractedData, riskIntelligence, obligations, plainEnglishSummary } =
    analysis || {};

  return (
    <div className="space-y-5">
      {/* Risk Score Banner */}
      <RiskScoreBanner riskIntelligence={riskIntelligence} />

      {/* Top row: Extracted Data + Plain English (on larger screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ExtractedData data={extractedData} />
        </div>
        <div>
          <PlainEnglishSummary summary={plainEnglishSummary} />
        </div>
      </div>

      {/* Risk Intelligence — full width */}
      <RiskIntelligence riskIntelligence={riskIntelligence} />

      {/* Obligations Tracker — full width */}
      <ObligationsTracker obligations={obligations} />
    </div>
  );
}

function RiskScoreBanner({ riskIntelligence }) {
  const score = riskIntelligence?.overallRiskScore ?? 50;
  const summary = riskIntelligence?.riskSummary ?? '';

  const { label, bgClass, borderClass, textClass, barClass } =
    getRiskLevel(score);

  return (
    <div className={`${bgClass} ${borderClass} border rounded-2xl p-5`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Score circle */}
        <div className="flex items-center gap-4">
          <div
            className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 ${borderClass} bg-white shadow-sm flex-shrink-0`}
          >
            <span className={`text-3xl font-black ${textClass}`}>{score}</span>
            <span className="text-xs text-gray-400 font-medium">/100</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-lg font-bold ${textClass}`}>{label}</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                Risk Level
              </span>
            </div>
            {/* Score bar */}
            <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`${barClass} h-2 rounded-full transition-all duration-1000`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="sm:border-l sm:border-current/20 sm:pl-5 sm:ml-auto sm:max-w-md">
            <p className="text-sm font-medium text-gray-700 leading-relaxed">
              {summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getRiskLevel(score) {
  if (score <= 30) {
    return {
      label: 'Low Risk',
      bgClass: 'bg-green-50',
      borderClass: 'border-green-200',
      textClass: 'text-green-700',
      barClass: 'bg-green-500',
    };
  } else if (score <= 60) {
    return {
      label: 'Medium Risk',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-200',
      textClass: 'text-amber-700',
      barClass: 'bg-amber-500',
    };
  } else if (score <= 80) {
    return {
      label: 'High Risk',
      bgClass: 'bg-orange-50',
      borderClass: 'border-orange-200',
      textClass: 'text-orange-700',
      barClass: 'bg-orange-500',
    };
  } else {
    return {
      label: 'Critical Risk',
      bgClass: 'bg-red-50',
      borderClass: 'border-red-200',
      textClass: 'text-red-700',
      barClass: 'bg-red-500',
    };
  }
}
