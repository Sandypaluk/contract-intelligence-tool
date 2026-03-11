import { useState, useRef, useEffect } from 'react';

const SUGGESTED_QUESTIONS = [
  'What happens if the buyer misses a payment deadline?',
  'What is the exact ownership share and what does it include?',
  'Can the buyer exit the co-ownership arrangement early?',
  'What are the annual maintenance fees and who pays them?',
  'What happens in the event of a dispute between co-owners?',
];

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-myne-navy' : 'bg-gray-100 border border-gray-200'
      }`}>
        {isUser ? (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ) : (
          <span className="text-xs font-black text-myne-red">M</span>
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'chat-bubble-user text-white rounded-tr-sm'
          : message.isError
          ? 'bg-red-50 border border-red-200 text-red-700 rounded-tl-sm'
          : 'chat-bubble-assistant rounded-tl-sm'
      }`}>
        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
          isUser ? 'text-white' : message.isError ? 'text-red-700' : 'text-gray-800'
        }`}>
          {message.content}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-black text-myne-red">M</span>
      </div>
      <div className="chat-bubble-assistant rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QAChat({ messages, onAskQuestion, isAnswering }) {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAnswering]);

  const handleSubmit = (question) => {
    const q = (question || input).trim();
    if (!q || isAnswering) return;
    onAskQuestion(q);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-myne-navy to-myne-navy-light rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="text-left">
            <h2 className="text-base font-bold text-gray-900">Ask Questions</h2>
            <p className="text-xs text-gray-400">
              {messages.length > 0
                ? `${messages.length} message${messages.length !== 1 ? 's' : ''} in this session`
                : 'Ask anything about this contract'}
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
          {/* Chat history */}
          {messages.length > 0 ? (
            <div className="max-h-96 overflow-y-auto scrollbar-thin px-6 py-4 space-y-4">
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {isAnswering && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          ) : (
            <div className="px-6 pt-5">
              {/* Welcome message */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-black text-myne-red">M</span>
                </div>
                <div className="chat-bubble-assistant rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    I've analysed your contract. Ask me anything about it — I'll answer based strictly on what's in the document.
                  </p>
                </div>
              </div>

              {/* Suggested questions */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Suggested questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSubmit(q)}
                      disabled={isAnswering}
                      className="text-xs bg-gray-50 border border-gray-200 text-gray-600 hover:bg-myne-navy hover:text-white hover:border-myne-navy px-3 py-1.5 rounded-full transition-all font-medium disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* After first message — show suggested questions as compact strip */}
          {messages.length > 0 && (
            <div className="px-6 pb-2">
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSubmit(q)}
                    disabled={isAnswering}
                    className="text-xs bg-gray-50 border border-gray-200 text-gray-500 hover:bg-myne-navy hover:text-white hover:border-myne-navy px-3 py-1.5 rounded-full transition-all disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-6 pb-5 pt-3">
            <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-myne-navy focus-within:ring-1 focus-within:ring-myne-navy/20 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about this contract..."
                rows={1}
                disabled={isAnswering}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-relaxed max-h-28 disabled:opacity-50"
              />
              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isAnswering}
                className="w-9 h-9 bg-myne-red hover:bg-red-700 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
              >
                {isAnswering ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg
                    className="w-4 h-4 text-white disabled:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Press Enter to send · Shift+Enter for new line · Answers are based on this contract only
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
