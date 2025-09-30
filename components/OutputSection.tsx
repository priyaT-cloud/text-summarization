
import React, { useState, useEffect, useRef } from 'react';
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
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Mermaid.js with a dark theme when the component mounts
    if (window.mermaid) {
      window.mermaid.initialize({ startOnLoad: false, theme: 'dark' });
    }
  }, []);

  useEffect(() => {
    // When the diagram content changes and the tab is active, render the diagram
    if (activeTab === 'diagram' && summary