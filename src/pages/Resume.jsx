import React, { useState } from 'react';
import useResumeTips from '../hooks/useResumeTips';

export default function Resume() {
  const [jobDescription, setJobDescription] = useState('');
  const [currentResume, setcurrentResume] = useState('');
  const { tips, loading, error, getTips } = useResumeTips();

  const handleGetTips = async (event) => {
    event.preventDefault();
    if (!jobDescription || !currentResume) {
      return;
    }

    getTips( jobDescription, currentResume );
  };

  const formatTip = (text) => {
    // 1. Strip the leading numbers (e.g., "1. ") so the cards look cleaner
    const cleanText = text.replace(/^\d+\.\s*/, '');
    // 2. Convert Gemini's **bold** markdown into actual styled HTML
    const htmlText = cleanText.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-indigo-900">$1</span>');
    return { __html: htmlText };
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-10">
      
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          AI Resume Optimizer
        </h1>
        <p className="text-gray-500 font-medium">
          Tailor your resume to any job description instantly.
        </p>
      </div>

      {/* Main Form Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-600">
        <form onSubmit={handleGetTips} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Job Description Input */}
            <div className="space-y-2">
              <label htmlFor="jobDescription" className="block text-sm font-semibold text-black uppercase tracking-wider">
                Job Description
              </label>
              <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              rows={10}
              placeholder="Paste the requirements here..."
              // ADDED text-black HERE:
              className="w-full p-4 bg-gray-100 text-black border border-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"/>
  
            </div>

            {/* Current Resume Input */}
            <div className="space-y-2">
              <label htmlFor="currentResume" className="block text-sm font-semibold text-black uppercase tracking-wider">
                Current Resume
              </label>
              <textarea
                id="currentResume"
                value={currentResume}
                onChange={(event) => setcurrentResume(event.target.value)}
                rows={10}
                placeholder="Paste your resume text here..."
                className="w-full p-4 bg-gray-100 text-black border border-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 shadow-md font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing Match...</span>
                </>
              ) : (
                <span>Generate Smart Tips</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {tips && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">Recommended Updates</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Split the tips string by newline, remove empty lines, and map to cards */}
            {tips.split('\n').filter(tip => tip.trim() !== '').map((tip, index) => (
              <div 
                key={index} 
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow border-l-4 border-l-indigo-500 flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                  {index + 1}
                </div>
                <p 
                  className="text-gray-700 leading-relaxed pt-1"
                  dangerouslySetInnerHTML={formatTip(tip)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}