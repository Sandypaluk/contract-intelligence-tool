export default function Header({ onReset }) {
  return (
    <header className="bg-myne-navy shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Product Name */}
          <div className="flex items-center gap-4">
            <button
              onClick={onReset}
              className="flex items-center gap-3 group"
              title="Back to home"
            >
              {/* MYNE Logo Mark */}
              <div className="relative">
                <div className="w-9 h-9 bg-myne-red rounded-lg flex items-center justify-center shadow-sm group-hover:bg-red-700 transition-colors">
                  <span className="text-white font-black text-sm tracking-tight">M</span>
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-bold text-lg tracking-tight leading-none">
                    MYNE Homes
                  </span>
                  <span className="hidden sm:inline text-gray-400 text-xs font-medium">
                    ·
                  </span>
                  <span className="hidden sm:inline text-gray-300 text-xs font-medium tracking-wide uppercase">
                    Contract Intelligence
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-300 font-medium">
                Powered by Gemini 1.5 Pro
              </span>
            </div>

            {onReset && (
              <button
                onClick={onReset}
                className="bg-myne-red hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden sm:inline">New Analysis</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
