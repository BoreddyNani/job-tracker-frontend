import { useRef, useState } from 'react';
import { uploadResume } from '../api/application';

export default function ResumeUploader({ application, onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      const result = await uploadResume(application.id, file, (percent) => {
        setProgress(percent);
      });
      // Inform parent component to update the UI
      onUploadSuccess(application.id, result.resumeUrl);
    } catch (err) {
      // Safely catch the 400 error from Multer
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (application.resumeUrl) {
    return (
      <a 
        href={application.resumeUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        View Resume
      </a>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="application/pdf"
        className="hidden"
      />
      
      {isUploading ? (
        <div className="w-24 bg-gray-200 rounded-full h-2.5 mt-2">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Upload PDF
        </button>
      )}
      
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}