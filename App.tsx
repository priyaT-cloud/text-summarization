
import React, { useState, useCallback, useRef } from 'react';
import { generateSummary } from './services/geminiService';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import Header from './components/Header';
import { LoaderIcon } from './components/Icons';

// Use 'any' for window objects from CDNs
declare const window: any;

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [summaryText, setSummaryText] = useState<string>('');
  const [summaryDiagram, setSummaryDiagram] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSummarize = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSummaryText('');
    setSummaryDiagram('');

    try {
      const { summary, diagram } = await generateSummary(inputText);
      setSummaryText(summary);
      setSummaryDiagram(diagram);
    } catch (err) {
      console.error(err);
      setError('Failed to generate summary. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setInputText('');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
        const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
        }
        setInputText(fullText);
      } catch (err) {
        console.error(err);
        setError('Failed to parse the PDF file.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
    
    // Reset file input value to allow re-uploading the same file
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, []);

  const handleDownloadPdf = useCallback(() => {
    if (!summaryText) return;
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      const margin = 15;
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const usableWidth = pageWidth - margin * 2;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Generated Summary", pageWidth / 2, margin, { align: "center" });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(summaryText, usableWidth);
      
      let y = margin + 15;
      for (let i = 0; i < splitText.length; i++) {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(splitText[i], margin, y);
        y += 7; 
      }
      
      doc.save('summary.pdf');
    } catch (err) {
      console.error(err);
      setError('Failed to generate PDF for download.');
    }
  }, [summaryText]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <Header />

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-lg">
              <LoaderIcon className="w-16 h-16 animate-spin text-indigo-400" />
              <p className="mt-4 text-lg">Processing, please wait...</p>
            </div>
          )}
          <InputSection
            inputText={inputText}
            setInputText={setInputText}
            onSummarize={handleSummarize}
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
            fileInputRef={fileInputRef}
          />
          <OutputSection
            summaryText={summaryText}
            summaryDiagram={summaryDiagram}
            onDownloadPdf={handleDownloadPdf}
            isLoading={isLoading}
          />
        </main>

        <footer className="text-center text-gray-500 mt-12">
            <p>&copy; {new Date().getFullYear()} AI Text Summarizer. Built with React & Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
