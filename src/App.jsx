import { useState, useCallback } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import LoadingProgress from './components/LoadingProgress';
import AnalysisDashboard from './components/AnalysisDashboard';
import QAChat from './components/QAChat';
import ExportOptions from './components/ExportOptions';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

export default function App() {
  const [appState, setAppState] = useState('idle'); // idle | analyzing | complete | error
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [contractText, setContractText] = useState('');
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [isAnswering, setIsAnswering] = useState(false);

  const handleFileUpload = useCallback(async (file) => {
    setUploadedFile(file);
    setError(null);
    setAppState('analyzing');
    setLoadingStep(0);

    // Staggered progress simulation while API call runs
    const t1 = setTimeout(() => setLoadingStep(1), 700);
    const t2 = setTimeout(() => setLoadingStep(2), 3500);
    const t3 = setTimeout(() => setLoadingStep(3), 7000);

    try {
      const dataUrl = await fileToBase64(file);
      const fileBase64 = dataUrl.split(',')[1];

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileBase64, filename: file.name }),
      });

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setLoadingStep(4);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Analysis failed. Please try again.');
      }

      const data = await response.json();

      // Brief pause so user sees the final step
      await new Promise((r) => setTimeout(r, 700));

      setAnalysis(data.analysis);
      setContractText(data.contractText);
      setChatMessages([]);
      setAppState('complete');
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setError(err.message);
      setAppState('error');
    }
  }, []);

  const handleReset = () => {
    setAppState('idle');
    setUploadedFile(null);
    setAnalysis(null);
    setContractText('');
    setError(null);
    setLoadingStep(0);
    setChatMessages([]);
  };

  const handleAskQuestion = async (question) => {
    const userMsg = { role: 'user', content: question };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsAnswering(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          contractText,
          chatHistory: chatMessages,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.answer },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I was unable to answer that question: ${err.message}`,
          isError: true,
        },
      ]);
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onReset={appState !== 'idle' ? handleReset : null} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {appState === 'idle' && (
          <UploadSection onFileUpload={handleFileUpload} />
        )}

        {appState === 'analyzing' && (
          <LoadingProgress
            currentStep={loadingStep}
            filename={uploadedFile?.name}
          />
        )}

        {appState === 'error' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white border border-red-200 rounded-2xl p-8 text-center shadow-sm">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analysis Failed
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">{error}</p>
              <button
                onClick={handleReset}
                className="bg-myne-navy text-white px-8 py-3 rounded-xl hover:bg-myne-navy-light transition-colors font-medium"
              >
                Try Another Document
              </button>
            </div>
          </div>
        )}

        {appState === 'complete' && analysis && (
          <div className="space-y-6 animate-slide-up">
            {/* File info banner */}
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-myne-red"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {uploadedFile?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Analysis complete ·{' '}
                    {new Date().toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-myne-navy font-medium transition-colors flex items-center gap-1.5"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                New Document
              </button>
            </div>

            <AnalysisDashboard analysis={analysis} />
            <QAChat
              messages={chatMessages}
              onAskQuestion={handleAskQuestion}
              isAnswering={isAnswering}
            />
            <ExportOptions analysis={analysis} filename={uploadedFile?.name} />
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-gray-400">
            © 2024 MYNE Homes. Contract Intelligence — Internal Use Only.
          </p>
          <p className="text-xs text-gray-400">
            AI analysis is for guidance only. Always consult a qualified legal
            professional.
          </p>
        </div>
      </footer>
    </div>
  );
}
