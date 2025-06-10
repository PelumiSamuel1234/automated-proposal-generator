
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface JobInputFormProps {
  jobDescription: string;
  onJobDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  
  customPrompt: string;
  onCustomPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  showCustomPromptEditor: boolean;
  onToggleCustomPromptEditor: () => void;

  systemInstruction: string;
  onSystemInstructionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  showSystemInstructionEditor: boolean;
  onToggleSystemInstructionEditor: () => void;
  
  onSubmit: () => void;
  isLoading: boolean;
}

const ToggleButton: React.FC<{onClick: () => void, isExpanded: boolean, controlsId: string, labelShow: string, labelHide: string}> = 
  ({onClick, isExpanded, controlsId, labelShow, labelHide}) => (
  <button
    onClick={onClick}
    className="text-sm text-purple-400 hover:text-purple-300 focus:outline-none mb-2 flex items-center"
    aria-expanded={isExpanded}
    aria-controls={controlsId}
  >
    {isExpanded ? (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        {labelHide}
      </>
    ) : (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        {labelShow}
      </>
    )}
  </button>
);


export const JobInputForm: React.FC<JobInputFormProps> = ({
  jobDescription,
  onJobDescriptionChange,
  customPrompt,
  onCustomPromptChange,
  showCustomPromptEditor,
  onToggleCustomPromptEditor,
  systemInstruction,
  onSystemInstructionChange,
  showSystemInstructionEditor,
  onToggleSystemInstructionEditor,
  onSubmit,
  isLoading,
}) => {
  return (
    <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 transform transition-all hover:scale-[1.01] space-y-6">
      
      <div>
        <ToggleButton
          onClick={onToggleSystemInstructionEditor}
          isExpanded={showSystemInstructionEditor}
          controlsId="system-instruction-editor"
          labelShow="Show System Instruction Editor"
          labelHide="Hide System Instruction Editor"
        />
        {showSystemInstructionEditor && (
          <div id="system-instruction-editor" className="mt-2 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <label htmlFor="systemInstruction" className="block text-md font-semibold mb-2 text-purple-300">
              Customize System Instruction (AI Persona)
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Define the AI's role, persona, and high-level guidance. This instruction is sent separately to the AI.
            </p>
            <textarea
              id="systemInstruction"
              value={systemInstruction}
              onChange={onSystemInstructionChange}
              placeholder="e.g., You are a helpful assistant..."
              rows={8}
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-md text-slate-200 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-y min-h-[100px] placeholder-slate-400 text-sm"
              disabled={isLoading}
              aria-label="System instruction editor"
            />
          </div>
        )}
      </div>
      
      <div>
        <ToggleButton
          onClick={onToggleCustomPromptEditor}
          isExpanded={showCustomPromptEditor}
          controlsId="custom-prompt-editor"
          labelShow="Show Main Prompt Editor"
          labelHide="Hide Main Prompt Editor"
        />
        {showCustomPromptEditor && (
          <div id="custom-prompt-editor" className="mt-2 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <label htmlFor="customPrompt" className="block text-md font-semibold mb-2 text-purple-300">
              Customize Main Prompt (Task Structure)
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Edit the template for the main task. Ensure it includes the placeholder <code className="bg-slate-600 px-1 rounded text-purple-300">{'{JOB_DESCRIPTION}'}</code> where the job description will be inserted.
            </p>
            <textarea
              id="customPrompt"
              value={customPrompt}
              onChange={onCustomPromptChange}
              placeholder="Enter your custom prompt template here..."
              rows={12}
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-md text-slate-200 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-y min-h-[200px] placeholder-slate-400 text-sm"
              disabled={isLoading}
              aria-label="Custom main prompt editor"
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="jobDescription" className="block text-xl font-semibold mb-3 text-purple-300">
          Enter Job Description
        </label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={onJobDescriptionChange}
          placeholder="Paste the job description here... The more detailed, the better your proposal!"
          rows={10}
          className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-y min-h-[150px] placeholder-slate-500"
          disabled={isLoading}
          aria-label="Job description input"
        />
      </div>
      
      <button
        onClick={onSubmit}
        disabled={isLoading || !jobDescription.trim()}
        className="mt-6 w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Generate proposal button"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Generating Proposal...
          </>
        ) : (
          '✨ Generate Proposal'
        )}
      </button>
    </div>
  );
};
