
import React, { useState, useCallback, useEffect } from 'react';
import { getSecurityAnalysis, isUrlActive, getAiAssistantResponse } from './services/geminiService';
import { ANALYSIS_OPTIONS, DEEP_ANALYSIS_OPTIONS } from './constants';
import type { HistoryItem, StructuredAnalysisResult, User, ScanMode, CurrentPage, AiChatMessage } from './types';
import * as authService from './services/authService';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import { Type } from '@google/genai';
import ScanPage from './components/ScanPage';
import Dashboard from './components/Dashboard';
import ResultsPage from './components/ResultsPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AccountPage from './components/AccountPage';
import AiAssistant from './components/AiAssistant';
import Footer from './components/Footer';
import LearnPage from './components/LearnPage';
import ThreatsPage from './components/ThreatsPage';
import LearningModule from './components/LearningModule';


const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [currentPage, setCurrentPage] = useState<CurrentPage>('dashboard');
  
  const [currentResult, setCurrentResult] = useState<HistoryItem | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [history, setHistory] = useState<HistoryItem[]>([]);

  // AI Assistant State
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([
    { id: crypto.randomUUID(), sender: 'ai', text: "Hi! 👋 I'm your Security AI Guard. How can I help you today? Ask me about scans, threats, or best practices! 🛡️" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Learning Module State
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  useEffect(() => {
    // Splash screen timer
    const timer = setTimeout(() => setShowSplash(false), 3000);
    // Check for logged in user
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Load history from localStorage when user logs in or out
    if (currentUser) {
      try {
        const storedHistory = localStorage.getItem(`wesecure_history_${currentUser.email}`);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        } else {
          setHistory([]);
        }
      } catch (e) {
        console.error("Failed to load history from localStorage", e);
        setHistory([]);
      }
    } else {
      setHistory([]); // Clear history on logout
    }
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleSignup = (user: User) => {
    setCurrentUser(user);
    setAuthPage('login'); // Switch to login page after successful signup
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };


  const handleStartScan = useCallback(async (websiteUrl: string, scanMode: ScanMode) => {
    if (!currentUser) {
      setError('You must be logged in to perform a scan.');
      return;
    }
    if (!websiteUrl) {
      setError('Please enter a website URL.');
      return;
    }
    
    setCurrentPage('dashboard'); // Ensure errors are shown on dashboard
    setIsValidating(true);
    setIsLoading(true);
    setError('');
    
    try {
      const validation = await isUrlActive(websiteUrl);
      setIsValidating(false);

      if (!validation.isValid) {
        setError(`URL Validation Failed: ${validation.message}`);
        setIsLoading(false);
        return;
      }

      const analysisScope = scanMode === 'deep' ? DEEP_ANALYSIS_OPTIONS : ANALYSIS_OPTIONS;
      const selectedTypesText = analysisScope.map(opt => `- ${opt.label}: ${opt.description}`).join('\n');

      const prompt = `
As an expert cybersecurity analyst, conduct a non-intrusive security assessment of the website at: ${websiteUrl}.

**Scan Mode:** ${scanMode.toUpperCase()}

**Analysis Scope:**
Analyze the following areas. For each, provide a risk level ('Pass', 'Informational', 'Low', 'Medium', 'High'), detailed findings, and a clear recommendation.
${selectedTypesText}

**Methodology:**
Base your analysis on passive reconnaissance and publicly available information (headers, source code, etc.). Do not perform active attacks.

**Final Output:**
Return a single, structured JSON object with three top-level keys: "score", "summary", and "checks".
1.  "score": A single string representing an overall security grade from "A+" (best) to "F" (worst).
2.  "summary": A concise, one-paragraph overview of the website's security posture.
3.  "checks": An array of objects, where each object represents a check from the Analysis Scope and contains four keys: "category" (string, e.g., "HTTPS / SSL"), "risk" (string), "findings" (string), and "recommendation" (string).
`;
      
      const trimmedPrompt = prompt.trim();

      const checkSchema = {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          risk: { type: Type.STRING },
          findings: { type: Type.STRING },
          recommendation: { type: Type.STRING }
        },
        required: ['category', 'risk', 'findings', 'recommendation']
      };

      const schema = {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.STRING },
          summary: { type: Type.STRING },
          checks: {
            type: Type.ARRAY,
            items: checkSchema
          }
        },
        required: ['score', 'summary', 'checks']
      };

      const resultJsonString = await getSecurityAnalysis(trimmedPrompt, schema);
      
      let resultObject: StructuredAnalysisResult;
      try {
        resultObject = JSON.parse(resultJsonString);
      } catch (parseError) {
        console.error("Failed to parse Gemini response as JSON.", parseError);
        setError("AI returned an invalid analysis format. Please try again.");
        setIsLoading(false);
        return;
      }

       const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        prompt: trimmedPrompt,
        result: resultObject,
        websiteUrl,
        scanMode
      };
      
      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem(`wesecure_history_${currentUser.email}`, JSON.stringify(updatedHistory));
      
      setCurrentResult(newHistoryItem);
      setCurrentPage('results');

    } catch (e: any) {
      const message = e.message || 'An unknown error occurred.';
      if (message.startsWith('[API Key Error]')) {
        setError('API Key Error: Please ensure your API key is configured correctly and has the necessary permissions.');
      } else if (message.startsWith('[Network Error]')) {
        setError('Network Error: Could not connect to the analysis service. Please check your internet connection.');
      } else if (message.startsWith('[API Error]')) {
        setError('AI Service Error: The analysis could not be completed. Please try again later.');
      } else {
        setError(`An unexpected error occurred: ${message}`);
      }
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  }, [history, currentUser]);

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setCurrentResult(item);
    setCurrentPage('results');
  };
  
  const handleClearHistory = () => {
    if (currentUser && window.confirm('Are you sure you want to clear all analysis history? This cannot be undone.')) {
        setHistory([]);
        localStorage.removeItem(`wesecure_history_${currentUser.email}`);
    }
  };
  
  const handleNavigate = (page: CurrentPage) => {
    setCurrentPage(page);
    setError('');
  };

  const handleSendAiMessage = async (message: string) => {
    if (!message.trim() || isAiLoading) return;
    
    const newUserMessage: AiChatMessage = { id: crypto.randomUUID(), sender: 'user', text: message };
    const typingIndicator: AiChatMessage = { id: crypto.randomUUID(), sender: 'typing', text: '...' };

    setAiMessages(prev => [...prev, newUserMessage, typingIndicator]);
    setIsAiLoading(true);

    try {
      const responseText = await getAiAssistantResponse(message);
      const newAiMessage: AiChatMessage = { id: crypto.randomUUID(), sender: 'ai', text: responseText };
      
      setAiMessages(prev => [...prev.filter(m => m.sender !== 'typing'), newAiMessage]);
    } catch (e: any) {
      let friendlyErrorText = 'Sorry, I encountered an unexpected error. Please try again later.';
      const message = e.message || 'An unknown error occurred.';

      if (message.startsWith('[API Key Error]')) {
        friendlyErrorText = 'I am currently unable to connect due to an API key issue. Please contact support.';
      } else if (message.startsWith('[Network Error]')) {
        friendlyErrorText = 'I am having trouble connecting. Please check your internet connection and try again.';
      } else if (message.startsWith('[API Error]')) {
        friendlyErrorText = 'I seem to be having some trouble right now. Please try asking me again in a few moments.';
      }

      const errorMessage: AiChatMessage = { id: crypto.randomUUID(), sender: 'ai', text: friendlyErrorText };
      setAiMessages(prev => [...prev.filter(m => m.sender !== 'typing'), errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleStartLesson = (lessonTitle: string) => {
    setActiveLesson(lessonTitle);
  };

  const handleCloseLesson = () => {
      setActiveLesson(null);
  };


  if (showSplash) {
    return <SplashScreen />;
  }
  
  if (!currentUser) {
    return authPage === 'login' ? (
      <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setAuthPage('signup')} />
    ) : (
      <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setAuthPage('login')} />
    );
  }


  const renderCurrentPage = () => {
    switch (currentPage) {
        case 'scan':
            return <ScanPage />;
        case 'account':
            return <AccountPage user={currentUser} />;
        case 'learn':
            return <LearnPage onStartLesson={handleStartLesson} />;
        case 'threats':
            return <ThreatsPage />;
        case 'results':
            return currentResult ? <ResultsPage result={currentResult} /> : <Dashboard 
                onStartScan={handleStartScan}
                isLoading={isLoading}
                isValidating={isValidating}
                error={"No result found. Please start a new scan."}
                history={history}
                onSelectHistoryItem={handleSelectHistoryItem}
            />;
        case 'dashboard':
        default:
            return <Dashboard 
                        onStartScan={handleStartScan}
                        isLoading={isLoading}
                        isValidating={isValidating}
                        error={error}
                        history={history}
                        onSelectHistoryItem={handleSelectHistoryItem}
                    />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header
        user={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <main className="flex-grow max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full pb-24">
        {renderCurrentPage()}
      </main>
      <Footer currentPage={currentPage} onNavigate={handleNavigate} />
      <AiAssistant
        isOpen={isAiAssistantOpen}
        onToggle={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
        messages={aiMessages}
        onSendMessage={handleSendAiMessage}
        isLoading={isAiLoading}
      />
      {activeLesson && (
        <LearningModule
            lessonTopic={activeLesson}
            onClose={handleCloseLesson}
        />
      )}
    </div>
  );
};

export default App;