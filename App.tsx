
import React, { useState, useCallback, useEffect } from 'react';
import { JobInputForm } from './components/JobInputForm';
import { ProposalOutput } from './components/ProposalOutput';
import { generateProposalWithGemini } from './services/geminiService';
import { PROPOSAL_GENERATION_PROMPT_TEMPLATE, INITIAL_SYSTEM_INSTRUCTION, SYSTEM_INSTRUCTION_STORAGE_KEY } from './constants';

const App: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>(PROPOSAL_GENERATION_PROMPT_TEMPLATE);
  
  // Initialize systemInstruction from localStorage or use default
  const [systemInstruction, setSystemInstruction] = useState<string>(() => {
    try {
      const savedSystemInstruction = localStorage.getItem(SYSTEM_INSTRUCTION_STORAGE_KEY);
      return savedSystemInstruction ? savedSystemInstruction : INITIAL_SYSTEM_INSTRUCTION;
    } catch (error) {
      console.error("Failed to read system instruction from localStorage:", error);
      return INITIAL_SYSTEM_INSTRUCTION;
    }
  });

  const [showCustomPromptEditor, setShowCustomPromptEditor] = useState<boolean>(false);
  const [showSystemInstructionEditor, setShowSystemInstructionEditor] = useState<boolean>(false);
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateProposal = useCallback(async () => {
    if (!jobDescription.trim()) {
      setError('Job description cannot be empty.');
      setGeneratedProposal(null);
      return;
    }
    if (!customPrompt.trim()) {
        setError('Prompt template cannot be empty.');
        setGeneratedProposal(null);
        return;
    }
    if (!customPrompt.includes('{JOB_DESCRIPTION}')) {
        setError('Prompt template must include the placeholder "{JOB_DESCRIPTION}".');
        setGeneratedProposal(null);
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedProposal(null);

    try {
      const fullPrompt = customPrompt.replace('{JOB_DESCRIPTION}', jobDescription);
      const proposal = await generateProposalWithGemini(fullPrompt, systemInstruction.trim() || undefined);
      setGeneratedProposal(proposal);
    } catch (err) {
      console.error('Error generating proposal:', err);
      if (err instanceof Error) {
        setError(`Failed to generate proposal: ${err.message}. Ensure your API key is correctly configured.`);
      } else {
        setError('An unknown error occurred while generating the proposal.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [jobDescription, customPrompt, systemInstruction]);

  const handleJobDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
    if (error) setError(null);
  }, [error]);

  const handleCustomPromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPrompt(e.target.value);
    if (error) setError(null);
  }, [error]);

  const handleSystemInstructionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newSystemInstruction = e.target.value;
    setSystemInstruction(newSystemInstruction);
    try {
      localStorage.setItem(SYSTEM_INSTRUCTION_STORAGE_KEY, newSystemInstruction);
    } catch (error) {
        console.error("Failed to save system instruction to localStorage:", error);
        // Optionally, inform the user that settings couldn't be saved
    }
  }, []); // Empty dependency array as localStorage and SYSTEM_INSTRUCTION_STORAGE_KEY are stable

  const toggleCustomPromptEditor = useCallback(() => {
    setShowCustomPromptEditor(prev => !prev);
  }, []);

  const toggleSystemInstructionEditor = useCallback(() => {
    setShowSystemInstructionEditor(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          AI Proposal Generator
        </h1>
        <p className="mt-2 text-slate-400 text-lg">
          Craft compelling professional proposals from job descriptions instantly.
        </p>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <JobInputForm
          jobDescription={jobDescription}
          onJobDescriptionChange={handleJobDescriptionChange}
          customPrompt={customPrompt}
          onCustomPromptChange={handleCustomPromptChange}
          showCustomPromptEditor={showCustomPromptEditor}
          onToggleCustomPromptEditor={toggleCustomPromptEditor}
          systemInstruction={systemInstruction}
          onSystemInstructionChange={handleSystemInstructionChange}
          showSystemInstructionEditor={showSystemInstructionEditor}
          onToggleSystemInstructionEditor={toggleSystemInstructionEditor}
          onSubmit={handleGenerateProposal}
          isLoading={isLoading}
        />
        <ProposalOutput
          proposal={generatedProposal}
          isLoading={isLoading}
          error={error}
        />
      </main>
      
      <footer className="w-full max-w-4xl mt-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Proposal Generator. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
