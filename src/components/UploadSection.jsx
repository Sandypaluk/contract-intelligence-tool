import { useState, useRef, useCallback } from 'react';

const ACCEPTED_TYPES = ['application/pdf'];
const MAX_FILE_SIZE_MB = 20;

export default function UploadSection({ onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState(null);
  const inputRef = useRef(null);

  const validateAndUpload = (file) => {
    setFileError(null);

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError('Only PDF files are supported. Please upload a .pdf document.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    onFileUpload(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndUpload(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    validateAndUpload(file);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero text */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-myne-red text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI-Powered Legal Analysis
        </div>

        <h1 className="text-4xl font-bold text-myne-navy mb-4 leading-tight">
          Understand Your Contract
          <br />
          <span className="text-myne-red">Before You Sign</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          Upload any vacation home co-ownership agreement. Our AI extracts key data,
          flags risks, and explains everything in plain English — in seconds.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-200 group
          ${isDragging
            ? 'border-myne-red bg-red-50 scale-[1.01]'
            : 'border-gray-300 bg-white hover:border-myne-red hover:bg-red-50/30'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleInputChange}
        />

        {/* Upload Icon */}
        <div className={`
          w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all
          ${isDragging ? 'bg-red-100' : 'bg-gray-100 group-hover:bg-red-50'}
        `}>
          <svg
            className={`w-10 h-10 transition-colors ${isDragging ? 'text-myne-red' : 'text-gray-400 group-hover:text-myne-red'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {isDragging ? 'Release to analyse' : 'Drop your contract here'}
        </h3>
        <p className="text-gray-500 mb-4">
          or{' '}
          <span className="text-myne-red font-semibold underline underline-offset-2">
            browse files
          </span>{' '}
          from your computer
        </p>

        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            PDF format
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            English &amp; German
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Up to 20MB
          </span>
        </div>
      </div>

      {/* Error */}
      {fileError && (
        <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {fileError}
        </div>
      )}

      {/* Feature tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
        {[
          { icon: '🔍', title: 'Data Extraction', desc: 'Parties, price, dates' },
          { icon: '🚨', title: 'Risk Analysis', desc: 'Red & yellow flags' },
          { icon: '📋', title: 'Obligations', desc: 'Buyer & seller duties' },
          { icon: '💬', title: 'Q&A Chat', desc: 'Ask any question' },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white border border-gray-200 rounded-xl p-4 text-center"
          >
            <div className="text-2xl mb-1.5">{f.icon}</div>
            <div className="text-xs font-semibold text-gray-700">{f.title}</div>
            <div className="text-xs text-gray-400 mt-0.5">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Jurisdictions */}
      <p className="text-center text-xs text-gray-400 mt-6">
        Optimised for contracts governed by laws of{' '}
        <span className="font-medium text-gray-500">
          🇩🇪 Germany · 🇦🇹 Austria · 🇨🇭 Switzerland · 🇬🇧 United Kingdom · 🇫🇷 France
        </span>
      </p>
    </div>
  );
}
