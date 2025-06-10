
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ProposalOutputProps {
  proposal: string | null;
  isLoading: boolean;
  error: string | null;
}

// Basic markdown-to-HTML (very simplified for headings, paragraphs, lists)
// This function is defined outside the component to be stable for useMemo if needed,
// or can be inside if it doesn't rely on component scope variables other than its arguments.
const renderMarkdownContent = (text: string) => {
  return text
    .split('\n')
    .map((line, index) => {
      if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-purple-300">{line.substring(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-purple-400 border-b border-slate-700 pb-1">{line.substring(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-extrabold mt-8 mb-4 text-purple-500 border-b-2 border-slate-600 pb-2">{line.substring(2)}</h1>;
      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={index} className="ml-6 list-disc text-slate-300">{line.substring(2)}</li>;
      if (line.trim() === '---') return <hr key={index} className="my-6 border-slate-700" />;
      if (line.trim() === '') return <br key={index} />; // Preserve empty lines as line breaks
      return <p key={index} className="text-slate-200 my-2 leading-relaxed">{line}</p>;
    });
};

export const ProposalOutput: React.FC<ProposalOutputProps> = ({ proposal, isLoading, error }) => {
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    if (proposal) {
      try {
        await navigator.clipboard.writeText(proposal);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      } catch (err) {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers or if navigator.clipboard is not available
        const textArea = document.createElement('textarea');
        textArea.value = proposal;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (execErr) {
            console.error('Fallback copy failed:', execErr);
            alert('Failed to copy text. Please copy manually.');
        }
        document.body.removeChild(textArea);
      }
    }
  };
  
  // Scroll to output when it appears or updates
  useEffect(() => {
    if ((proposal || error) && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [proposal, error]);

  const renderedMarkdown = useMemo(() => {
    if (!proposal) return null;
    return renderMarkdownContent(proposal);
  }, [proposal]);


  if (isLoading) {
    return (
      <div ref={outputRef} className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 mt-8 text-center min-h-[200px] flex flex-col justify-center items-center">
        <LoadingSpinner size="w-12 h-12" />
        <p className="mt-4 text-lg text-purple-300 animate-pulse">Generating your proposal... This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div ref={outputRef} className="bg-red-900 border border-red-700 shadow-2xl rounded-xl p-6 sm:p-8 mt-8 text-red-100">
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div ref={outputRef} className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 mt-8 text-center min-h-[200px] flex flex-col justify-center items-center">
        <p className="text-slate-400 text-lg">Your generated proposal will appear here.</p>
        <p className="text-slate-500 text-sm mt-2">Enter a job description above and click "Generate Proposal".</p>
      </div>
    );
  }

  return (
    <div ref={outputRef} className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 mt-8 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-purple-300">Generated Proposal</h3>
        <button
          onClick={handleCopy}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-150 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>{copied ? 'Copied!' : 'Copy Text'}</span>
        </button>
      </div>
      <div className="prose prose-invert max-w-none bg-slate-700/50 p-4 rounded-md max-h-[60vh] overflow-y-auto">
        {/* Using a simple renderer; for full markdown, react-markdown would be better */}
        {/* The `whitespace-pre-wrap` was removed as the renderMarkdown function now handles line breaks with <br/> */}
        {renderedMarkdown}
      </div>
    </div>
  );
};
