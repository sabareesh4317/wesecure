export type SecurityScore = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' | string;
export type ScanMode = 'quick' | 'deep';
export type CurrentPage = 'dashboard' | 'results' | 'scan' | 'account' | 'learn' | 'threats';

export interface User {
  email: string;
}

export interface AnalysisOption {
  id: string;
  label: string;
  description: string;
}

export interface OutputFormatOption {
  id: string;
  label: string;
}

export interface AnalysisCheck {
  category: string;
  risk: 'High' | 'Medium' | 'Low' | 'Informational' | 'Pass' | 'Undetermined' | string;
  findings: string;
  recommendation: string;
}

export interface AnalysisDetail {
  risk: 'High' | 'Medium' | 'Low' | 'Informational' | 'Pass' | string;
  findings: string[];
  recommendation: string[];
}

export interface StructuredAnalysisResult {
  score: SecurityScore;
  summary: string;
  checks: AnalysisCheck[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  prompt: string;
  result: StructuredAnalysisResult;
  websiteUrl: string;
  scanMode: ScanMode;
}

export interface ContentAnalysisResult {
  threatLevel: 'Safe' | 'Suspicious' | 'Malicious' | 'Unknown' | string;
  summary: string;
  findings: string[];
}

export interface AiChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'typing';
}

export type NewsCategory = 'vulnerability' | 'ransomware' | 'alert' | 'hacking' | 'phishing' | 'malware' | 'breach';

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  category: NewsCategory;
  tags: string[];
}

// --- Learning Module Types ---

export interface InteractiveQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  feedbackCorrect: string;
  feedbackIncorrect: string;
}

export interface LessonStep {
  step: number;
  title: string;
  content: string[];
  keyTakeaways: string[];
  interactiveQuestion?: InteractiveQuestion;
}

export interface FinalQuiz {
  questions: InteractiveQuestion[];
}

export interface CompletionScreen {
  title: string;
  summary: string;
  badgePrompt: string;
}

export interface LearningModuleContent {
  title: string;
  objective: string;
  lessonSteps: LessonStep[];
  finalQuiz: FinalQuiz;
  completionScreen: CompletionScreen;
}
