import React, { useState, useRef } from "react";

interface FileUploadProps {
  uploadUrl: string;
  onProgress?: (progress: number) => void;
  onComplete?: (response: any) => void;
  onError?: (error: any) => void;
  acceptedFiles?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  uploadUrl, 
  onProgress, 
  onComplete, 
  onError,
  acceptedFiles = ".xlsx,.xls,.csv"
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = acceptedFiles.split(',').map(ext => ext.replace('.', '').trim());
      
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        setStatus(`Please select a supported file type (${acceptedFiles})`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        setStatus("File size is too large. Please select a file under 10MB.");
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      setFile(selectedFile);
      setStatus("");
      setUploadProgress(0);
    }
  };

  const getUserFriendlyError = (error: any): string => {
    
    if (error.name === 'AbortError') {
      return "Upload was cancelled.";
    }
    
    const errorMessage = error.message || "An unexpected error occurred.";
    
    
    if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
      return "Network connection failed. Please check your internet connection and try again.";
    }
    
    if (errorMessage.includes("Server error:")) {
      const statusMatch = errorMessage.match(/Server error: (\d+)/);
      if (statusMatch) {
        const statusCode = statusMatch[1];
        switch(statusCode) {
          case "413":
            return "The file is too large. Please select a smaller file.";
          case "415":
            return "Unsupported file type. Please use a different format.";
          case "500":
          case "502":
          case "503":
          case "504":
            return "The server is currently unavailable. Please try again later.";
          default:
            return `Server error (${statusCode}). Please try again.`;
        }
      }
    }
    
    if (errorMessage.includes("Unexpected token") || errorMessage.includes("JSON")) {
      return "Received an invalid response from the server. Please try again.";
    }
    
    if (errorMessage.includes("timeout") || errorMessage.includes("Timeout")) {
      return "The request timed out. Please check your connection and try again.";
    }
    
    if (errorMessage.includes("File") && errorMessage.includes("format")) {
      return "The file format is not supported. Please use a different file.";
    }
    
    return "Something went wrong during the upload. Please try again.";
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 90) {
        clearInterval(interval);
        return;
      }
      setUploadProgress(progress);
      if (onProgress) onProgress(progress);
    }, 500);
    
    return interval;
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setStatus("Uploading your file...");
    setUploadProgress(0);
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    const progressInterval = simulateProgress();

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        signal: signal
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      if (onProgress) onProgress(100);

      if (!response.ok) {
        
        let errorText = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.text();
          if (errorData) errorText = errorData;
        } catch (e) {
          
        }
        
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log("Upload success:", result);
      
      setStatus("File uploaded successfully!");
      if (onComplete) {
        onComplete(result);
      }
    } catch (error: any) {
      
      const friendlyError = getUserFriendlyError(error);
      setStatus(friendlyError);
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsUploading(false);
    setUploadProgress(0);
    setStatus("Upload cancelled");
  };

  const handleReset = () => {
    setFile(null);
    setStatus("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("border-blue-400", "bg-blue-50");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-50");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-50");
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const selectedFile = droppedFiles[0];
      
      const fakeEvent = {
        target: {
          files: [selectedFile]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleFileChange(fakeEvent);
    }
  };

  return (
    <div className="p-6 border rounded-md shadow-md w-full max-w-md bg-white">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Upload Book Catalog</h2>
      
      <div 
        className={`border-2 border-dashed rounded-md p-6 mb-4 text-center ${
          file ? "border-green-400 bg-green-50" : "border-gray-300 bg-gray-50"
        } transition-colors duration-300`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedFiles}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          ref={fileInputRef}
          disabled={isUploading}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400 mb-2" 
            stroke="currentColor" 
            fill="none" 
            viewBox="0 0 48 48"
          >
            <path 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          <p className="text-sm text-gray-600">
            {file ? file.name : "Drag and drop or click to select a file"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: {acceptedFiles}
          </p>
        </label>
      </div>

      {file && !isUploading && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-sm text-gray-700 truncate">{file.name}</span>
          </div>
          <button 
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Remove file"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}

      {isUploading && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Uploading...</span>
            <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`flex-1 px-4 py-2 rounded-md font-medium ${
            !file || isUploading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } transition-colors duration-200`}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        
        {isUploading && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
        )}
      </div>

      {status && (
        <div className={`mt-3 p-3 rounded-md text-sm ${
          status.includes("Please select") || status.includes("File size") || status.includes("cancelled") || status.includes("Something went wrong")
            ? "bg-yellow-100 text-yellow-700 border border-yellow-200" 
            : status.includes("Uploading") 
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : status.includes("successfully")
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
        }`}>
          <div className="flex items-start">
            {status.includes("successfully") ? (
              <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : status.includes("Uploading") ? (
              <svg className="w-5 h-5 mr-2 text-blue-500 mt-0.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            ) : status.includes("cancelled") || status.includes("Please select") ? (
              <svg className="w-5 h-5 mr-2 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
            <span>{status}</span>
          </div>
          
          {status.includes("Network connection failed") && (
            <div className="mt-2 text-xs">
              <p className="font-medium">Try these steps:</p>
              <ul className="list-disc pl-4 mt-1">
                <li>Check your internet connection</li>
                <li>Try again in a few moments</li>
                <li>If using Wi-Fi, verify you're connected</li>
              </ul>
            </div>
          )}
          
          {status.includes("file is too large") && (
            <div className="mt-2 text-xs">
              <p className="font-medium">Suggestions:</p>
              <ul className="list-disc pl-4 mt-1">
                <li>Compress the file if possible</li>
                <li>Split data across multiple files</li>
                <li>Remove unnecessary data from the file</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;