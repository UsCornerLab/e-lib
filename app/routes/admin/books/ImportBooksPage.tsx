import React, { useState } from "react";
import FileUpload from "../../../components/book-catalog/FileUpload";

const ImportBooksPage: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

 
  const handleUploadProgress = (progressEvent: any) => {
    if (progressEvent.lengthComputable) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setProgress(percentCompleted);
    }
  };

  const handleUploadComplete = (response: any) => {
    setUploadStatus('processing');
    setProgress(100);
  
    setTimeout(() => {
      setUploadStatus('success');
      setResults(response);
    }, 1500);
  };

  const handleUploadError = (error: any) => {
    setUploadStatus('error');
    setErrorMessage(error.message || 'An error occurred during upload');
    setProgress(0);
  };

  const handleReset = () => {
    setUploadStatus('idle');
    setProgress(0);
    setResults(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Books</h2>
          <p className="text-gray-600 mb-6">Upload a CSV or Excel file with your book catalog</p>
          
          {uploadStatus === 'idle' && (
            <FileUpload 
              uploadUrl="http://127.0.0.1:8000/api/books/import"
              onProgress={handleUploadProgress}
              onComplete={handleUploadComplete}
              onError={handleUploadError}
              acceptedFiles=".csv,.xlsx,.xls"
            />
          )}
          
          {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
            <div className="my-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {uploadStatus === 'uploading' ? 'Uploading...' : 'Processing...'}
                </span>
                <span className="text-sm font-medium text-gray-700">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {uploadStatus === 'success' && results && (
            <div className="my-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-medium text-green-800">Import Successful!</h3>
              </div>
              
              <div className="mt-3 text-sm text-green-700">
                <p><span className="font-medium">{results.imported || 0}</span> books imported successfully</p>
                {results.skipped > 0 && (
                  <p className="mt-1"><span className="font-medium">{results.skipped || 0}</span> books skipped</p>
                )}
                {results.errors && results.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Some issues occurred:</p>
                    <ul className="list-disc pl-5 mt-1">
                      {results.errors.slice(0, 3).map((error: any, index: number) => (
                        <li key={index}>{error.message}</li>
                      ))}
                      {results.errors.length > 3 && (
                        <li>...and {results.errors.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleReset}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Import Another File
              </button>
            </div>
          )}
          
          {uploadStatus === 'error' && (
            <div className="my-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-medium text-red-800">Import Failed</h3>
              </div>
              
              <p className="text-sm text-red-700 mt-2">{errorMessage}</p>
              
              <button
                onClick={handleReset}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          )}
          
          <div className="mt-6 text-xs text-gray-500">
            <p>Supported formats: CSV, XLSX</p>
            <p className="mt-1">Maximum file size: 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportBooksPage;