
import React from 'react';
import { UploadIcon, SummarizeIcon } from './Icons';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSummarize: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const InputSection: React.FC<InputSectionProps> = ({
  inputText,
  setInputText,
  onSummarize,
  onFileUpload,
  isLoading,
  fileInputRef,
}) => {

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">Your Text</h2>
      <div className="flex-grow flex flex-col">
        <textarea
          className="w-full flex-grow p-4 bg-gray-900 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-300 min-h-[300px] lg:min-h-0"
          placeholder="Paste your text here or upload a PDF..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleUploadClick}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-dashed border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:border-indigo-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <UploadIcon className="w-5 h-5 mr-2" />
          Upload PDF
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileUpload}
          className="hidden"
          accept=".pdf"
          disabled={isLoading}
        />
        <button
          onClick={onSummarize}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !inputText.trim()}
        >
          <SummarizeIcon className="w-5 h-5 mr-2" />
          Summarize
        </button>
      </div>
    </div>
  );
};

export default InputSection;
