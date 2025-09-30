import React, { useState, useEffect } from 'react';
import { DownloadIcon, TextIcon, DiagramIcon } from './Icons';

// Declare mermaid on the window object
declare const window: any;

interface OutputSectionProps {
  summaryText: string;
  summaryDiagram: string;
  onDownloadPdf: () => void;
  isLoading: boolean;
}

const OutputSection: React.FC<OutputSectionProps> = ({ summaryText, summaryDiagram, onDownloadPdf, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'diagram'>('text');
  const [diagramSvg, setDiagramSvg] = useState<string>('');
  const [isRenderingDiagram, setIsRenderingDiagram] = useState<boolean>(false);

  useEffect(() => {
    // Initialize Mermaid.js with a dark theme when the component mounts
    if (window.mermaid) {
      window.mermaid.initialize({ startOnLoad: false, theme: 'dark' });
    }
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (activeTab === 'diagram' && summaryDiagram && window.mermaid) {
        setIsRenderingDiagram(true);
        setDiagramSvg(''); // Clear previous diagram
        try {
          // Use the modern promise-based render API which is more reliable
          const { svg } = await window.mermaid.render(`mermaid-graph-${Date.now()}`, summaryDiagram);
          setDiagramSvg(svg);
        } catch (e) {
          console.error("Mermaid rendering error:", e);
          setDiagramSvg(`<div class="text-red-400 p-4">Error rendering diagram. The diagram syntax might be invalid.</div>`);
        } finally {
            setIsRenderingDiagram(false);
        }
      }
    };

    renderDiagram();
  }, [activeTab, summaryDiagram]);
  
  // When a new summary is generated, switch back to the text tab for better UX
  useEffect(() => {
      if (summaryText) {
          setActiveTab('text');
      }
  }, [summaryText]);

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-200">Summary</h2>
        {summaryText && !isLoading && (
          <button
            onClick={onDownloadPdf}
            className="inline-flex items-center px-4 py-2 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            <DownloadIcon className="w-5 h-5 mr-2" />
            Download PDF
          </button>
        )}
      </div>

      {summaryText && !isLoading && (
        <div className="mb-4">
          <div className="border-b border-gray-600">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('text')}
                className={`${
                  activeTab === 'text'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-400'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm inline-flex items-center gap-2 transition-colors duration-200`}
              >
                <TextIcon className="w-5 h-5" />
                Text
              </button>
              <button
                onClick={() => setActiveTab('diagram')}
                className={`${
                  activeTab === 'diagram'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-400'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm inline-flex items-center gap-2 transition-colors duration-200`}
              >
                <DiagramIcon className="w-5 h-5" />
                Diagram
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="flex-grow bg-gray-900 border border-gray-600 rounded-lg p-4 overflow-auto min-h-[300px] lg:min-h-0 relative">
        {(isLoading || !summaryText) ? (
            <div className="flex items-center justify-center h-full text-gray-500">
                {isLoading ? 'Generating summary...' : 'Your generated summary will appear here.'}
            </div>
        ) : (
            <>
                {activeTab === 'text' && (
                    <div className="text-gray-300 leading-relaxed">
                        {/* Use <pre> to preserve all whitespace and newlines from the API response */}
                        <pre className="whitespace-pre-wrap font-sans text-base">{summaryText}</pre>
                    </div>
                )}
                {activeTab === 'diagram' && (
                    isRenderingDiagram ? (
                        <div className="flex items-center justify-center h-full text-gray-400">Rendering diagram...</div>
                    ) : (
                        <div 
                            className="w-full h-full flex justify-center items-center"
                            dangerouslySetInnerHTML={{ __html: diagramSvg }}
                        />
                    )
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default OutputSection;
