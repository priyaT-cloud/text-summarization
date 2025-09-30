
import React from 'react';
import { SparklesIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <div className="flex items-center justify-center gap-3">
        <SparklesIcon className="w-10 h-10 text-indigo-400" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          AI Text Summarizer
        </h1>
      </div>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Effortlessly condense long articles, reports, or documents. Upload a PDF or paste text to get a quick, intelligent summary.
      </p>
    </header>
  );
};

export default Header;
