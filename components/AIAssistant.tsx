
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateAIResponse, hasApiKeySelected, openApiKeySelection } from '../services/geminiService';
import { APP_NAME } from '../constants';
import { useAppContext } from '../AppContext';

interface AIAssistantProps {
  // currentChannelName agora vem do contexto, não precisa ser prop aqui.
  // currentChannelName: string | null;
}

const AIAssistant: React.FC<AIAssistantProps> = () => {
  const { selectedChannel, selectedVodContent } = useAppContext();
  const currentContentName = selectedChannel?.name || selectedVodContent?.name || null;

  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyPrompted, setApiKeyPrompted] = useState<boolean>(false);
  const responseRef = useRef<HTMLDivElement>(null);

  const checkApiKey = useCallback(async () => {
    const hasKey = await hasApiKeySelected();
    if (!hasKey && !apiKeyPrompted) {
      setError("AI features require a Gemini API key. Please select one to proceed.");
      setApiKeyPrompted(true);
      // Open the selection dialog directly, no need for user interaction, as per guidance.
      // Assuming a success here to avoid race condition and proceed to app.
      openApiKeySelection();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setError(null); // Clear error, assuming selection was successful
    }
  }, [apiKeyPrompted]);

  useEffect(() => {
    checkApiKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }, []);

  const handleAsk = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a question for the AI.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(''); // Clear previous response

    // Prepend channel context if available
    const fullPrompt = currentContentName 
      ? `Considering the content "${currentContentName}", ${prompt}` 
      : prompt;

    try {
      const aiResponse = await generateAIResponse(fullPrompt);
      setResponse(aiResponse);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        // If the error is about API key not found, prompt again.
        if (err.message.includes("Invalid or unselected Gemini API key")) {
          setApiKeyPrompted(false); // Reset to allow re-prompting
          checkApiKey(); // Try to check/prompt again
        }
      } else {
        setError("An unknown error occurred with the AI assistant.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, currentContentName, checkApiKey]);

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-grow flex flex-col p-3 bg-zinc-800 rounded-lg overflow-y-auto mb-4 text-gray-200 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800 border border-zinc-700">
        {response ? (
          <p className="whitespace-pre-wrap">{response}</p>
        ) : (
          <p className="text-gray-400 italic">
            Pergunte-me qualquer coisa sobre o conteúdo atual ou entretenimento em geral! Por exemplo:
            <br />- "Que tipo de programas costumam passar em {currentContentName || 'neste canal/filme/série'}?"
            <br />- "Sugira um filme para hoje à noite."
            <br />- "Conte-me sobre a história do IPTV."
          </p>
        )}
        {isLoading && (
          <div className="flex items-center justify-center mt-4">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Pensando...
          </div>
        )}
        {error && (
          <p className="mt-4 text-red-400">{error}</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <textarea
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Digite sua pergunta aqui..."
          rows={2}
          className="flex-grow p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-glow-primary text-gray-100 placeholder-gray-400 resize-none transition-all duration-200"
          disabled={isLoading}
        />
        <button
          onClick={handleAsk}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
          disabled={isLoading}
        >
          Perguntar
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Para mais informações sobre faturamento do uso da API Gemini, visite <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">ai.google.dev/gemini-api/docs/billing</a>.
      </p>
    </div>
  );
};

export default AIAssistant;