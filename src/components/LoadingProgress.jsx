const STEPS = [
  {
    id: 1,
    label: 'Reading document...',
    description: 'Extracting text content from your PDF',
    icon: '📄',
  },
  {
    id: 2,
    label: 'Extracting key data...',
    description: 'Identifying parties, prices, dates and ownership details',
    icon: '🔍',
  },
  {
    id: 3,
    label: 'Identifying risk clauses...',
    description: 'Scanning for red flags, obligations and legal risks',
    icon: '⚠️',
  },
  {
    id: 4,
    label: 'Generating summary...',
    description: 'Creating plain English explanation and final report',
    icon: '✨',
  },
];

export default function LoadingProgress({ currentStep, filename }) {
  const progressPercent =
    currentStep === 0 ? 5 : Math.min((currentStep / STEPS.length) * 100, 100);

  const activeStep = STEPS[Math.min(currentStep - 1, STEPS.length - 1)];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-myne-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white animate-pulse-slow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-myne-navy mb-1">
            Analysing Your Contract
          </h2>
          {filename && (
            <p className="text-sm text-gray-400 font-medium truncate max-w-xs mx-auto">
              {filename}
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">
              {activeStep ? activeStep.label : 'Starting analysis...'}
            </span>
            <span className="text-sm font-bold text-myne-red">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-myne-red to-red-400 h-2.5 rounded-full progress-bar"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {activeStep && (
            <p className="text-xs text-gray-400 mt-2">{activeStep.description}</p>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step) => {
            const isDone = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 ${
                  isActive
                    ? 'bg-red-50 border border-red-100'
                    : isDone
                    ? 'bg-green-50 border border-green-100'
                    : 'bg-gray-50 border border-transparent'
                }`}
              >
                {/* Status icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isDone
                      ? 'bg-green-500'
                      : isActive
                      ? 'bg-myne-red'
                      : 'bg-gray-200'
                  }`}
                >
                  {isDone ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : isActive ? (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  ) : (
                    <span className="text-gray-400 text-xs font-bold">{step.id}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-semibold ${
                      isDone
                        ? 'text-green-700'
                        : isActive
                        ? 'text-myne-red'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </div>
                  {isActive && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {step.description}
                    </div>
                  )}
                </div>

                <div className="text-lg flex-shrink-0">
                  {isPending ? (
                    <span className="opacity-30">{step.icon}</span>
                  ) : (
                    step.icon
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          This typically takes 15–30 seconds depending on document length
        </p>
      </div>
    </div>
  );
}
