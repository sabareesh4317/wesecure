import { GoogleGenAI, Type } from "@google/genai";
import type { NewsArticle } from '../types';


const getApiKey = (): string => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable is not set.");
    }
    return apiKey;
};

export const getSecurityAnalysis = async (prompt: string, schema: object): Promise<string> => {
  try {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: schema
        }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for security analysis:", error);
    if (error instanceof Error) {
        if (error.message.includes("API_KEY")) {
            throw new Error(`[API Key Error] Your API key is invalid or not configured correctly.`);
        }
        if (error.message.toLowerCase().includes('fetch failed')) {
             throw new Error(`[Network Error] Connection to the AI service failed. Please check your internet connection and try again.`);
        }
        throw new Error(`[API Error] The AI service couldn't complete the analysis. Details: ${error.message}`);
    }
    throw new Error("[Unknown Error] An unknown error occurred while communicating with the Gemini API.");
  }
};

export const isUrlActive = async (url: string): Promise<{ isValid: boolean; message: string }> => {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!parsedUrl.hostname.includes('.') && parsedUrl.hostname !== 'localhost') {
      return { isValid: false, message: 'The hostname in the URL appears to be invalid (e.g., "example.com").' };
    }
  } catch (_) {
    return { isValid: false, message: 'The URL format is invalid. Please include http:// or https://' };
  }

  // Bypassing the live fetch check as requested. We now only validate the format.
  return { isValid: true, message: '' };
};

export const getContentAnalysis = async (prompt: string, image?: { inlineData: { data: string; mimeType: string } }): Promise<string> => {
  try {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });

    const parts: any[] = [{ text: prompt }];
    if (image) {
      parts.push(image);
    }
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: parts },
        config: {
            responseMimeType: 'application/json'
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for content analysis:", error);
    if (error instanceof Error) {
        if (error.message.includes("API_KEY")) {
            throw new Error(`[API Key Error] Your API key is invalid or not configured correctly.`);
        }
        if (error.message.toLowerCase().includes('fetch failed')) {
             throw new Error(`[Network Error] Connection to the AI service failed. Please check your internet connection and try again.`);
        }
        throw new Error(`[API Error] The AI service couldn't complete the analysis. Details: ${error.message}`);
    }
    throw new Error("[Unknown Error] An unknown error occurred while communicating with the Gemini API.");
  }
};

export const getAiAssistantResponse = async (userMessage: string): Promise<string> => {
  try {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: `You are a friendly and professional AI Security Assistant for the "Wesecure" application. Your name is Guardi. Your goal is to be a cybersecurity co-pilot. You must answer questions about security scans, vulnerabilities, and best practices. Use a helpful, encouraging tone and include security-themed emojis like 🛡️, ⚠️, 🔍, 💡, ✅. Keep responses concise and easy to understand for beginners. Do not mention that you are a language model.`
      }
    });

    return response.text;

  } catch (error) {
    console.error("Error calling Gemini API for AI Assistant:", error);
    if (error instanceof Error) {
        if (error.message.includes("API_KEY")) {
            throw new Error(`[API Key Error] Your API key is invalid or not configured correctly.`);
        }
        if (error.message.toLowerCase().includes('fetch failed')) {
             throw new Error(`[Network Error] Connection to the AI service failed. Please check your internet connection and try again.`);
        }
        throw new Error(`[API Error] The AI assistant couldn't respond. Details: ${error.message}`);
    }
    throw new Error("[Unknown Error] An unknown error occurred while communicating with the AI Assistant.");
  }
};


export const getCyberSecurityNews = async (): Promise<NewsArticle[]> => {
  // Simulate API call latency
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Mocked data from credible cybersecurity sources
  // FIX: Explicitly cast the array literal to NewsArticle[] before sorting.
  // This provides contextual typing to the array elements, preventing TypeScript
  // from widening the `category` string literal to `string`, which would cause a type error.
  const newsData: NewsArticle[] = ([
    {
      id: 'thn-1',
      title: 'Critical RCE Vulnerability Discovered in Popular \'FancyCache\' WordPress Plugin',
      url: 'https://thehackernews.com/',
      source: 'The Hacker News',
      publishedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
      category: 'vulnerability',
      tags: ['#WordPress', '#Plugin', '#RCE', '#CVE-2023-XXXX'],
    },
    {
      id: 'bleep-1',
      title: 'LockBit Ransomware Gang Claims Attack on Major US Hospital Network',
      url: 'https://www.bleepingcomputer.com/',
      source: 'BleepingComputer',
      publishedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // 5 hours ago
      category: 'ransomware',
      tags: ['#LockBit', '#Healthcare', '#Breach'],
    },
     {
      id: 'zdnet-1',
      title: 'CISA Warns of Actively Exploited Flaw in Barracuda Email Security Gateways',
      url: 'https://www.zdnet.com/topic/security/',
      source: 'ZDNet Security',
      publishedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
      category: 'alert',
      tags: ['#CISA', '#ZeroDay', '#Government'],
    },
    {
      id: 'dk-1',
      title: 'Social Engineering: The \'Scattered Spider\' Hacking Group Is Raising Alarms at the FBI',
      url: 'https://darkreading.com',
      source: 'Dark Reading',
      publishedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), // 2 days ago
      category: 'hacking',
      tags: ['#SocialEngineering', '#FBI'],
    },
    {
      id: 'krebs-1',
      title: 'Phishing Scam Uses Fake "Account Suspension" Alerts to Steal Microsoft 365 Credentials',
      url: 'https://krebsonsecurity.com/',
      source: 'Krebs on Security',
      publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), // 3 days ago
      category: 'phishing',
      tags: ['#Microsoft365', '#Credentials'],
    }
  ] as NewsArticle[]).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Simulate a potential API failure
  if (Math.random() > 0.95) {
    throw new Error("[Network Error] Failed to fetch news from the source.");
  }

  return newsData;
};

export const getLearningModuleContent = async (topic: string): Promise<string> => {
  try {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Generate a complete, interactive cybersecurity learning module on the topic: "${topic}".
The module must be structured for a beginner, be highly engaging, and broken down into 4-5 clear, digestible steps.
The entire output must be a single, valid JSON object conforming to the provided schema.

**Module Structure Requirements:**
1.  **Welcome:** A clear title and a concise objective (2-3 sentences) explaining what the user will learn.
2.  **Lesson Steps (4 to 5 steps):**
    - Each step must have a title, 2-4 paragraphs of clear, simple explanatory content, and a "Key Takeaways" box with 2-3 bullet points.
    - Exactly two of these lesson steps (e.g., step 2 and step 4) MUST include an interactive multiple-choice question to reinforce learning. The other steps must NOT have a question.
3.  **Final Quiz:** A scored quiz with exactly 5 multiple-choice questions that cover content from the entire module.
4.  **Completion Screen:** A congratulatory message, a summary of knowledge gained, and a creative prompt for an AI image generator to create a "shareable badge".

**Content Guidelines:**
- **Tone:** Professional, encouraging, and clear. Use analogies and real-world examples (e.g., a phishing email pretending to be from a bank).
- **Quizzes:** Questions should be relevant and test understanding, not just memorization. Provide brief, helpful feedback for both correct and incorrect answers.
- **Badge Prompt:** The prompt for the badge should be descriptive and thematic, e.g., "A digital achievement badge for completing a cybersecurity module on Phishing, featuring a shield deflecting a stylized fish hook, in a modern, neon-accented, dark-themed style."
    `;

    const interactiveQuestionSchema = {
        type: Type.OBJECT,
        properties: {
            questionText: { type: Type.STRING, description: "The question to ask the user." },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 4 possible answers." },
            correctOptionIndex: { type: Type.NUMBER, description: "The 0-based index of the correct option in the 'options' array." },
            feedbackCorrect: { type: Type.STRING, description: "Positive feedback for a correct answer." },
            feedbackIncorrect: { type: Type.STRING, description: "Constructive feedback for an incorrect answer." },
        },
        required: ['questionText', 'options', 'correctOptionIndex', 'feedbackCorrect', 'feedbackIncorrect'],
    };
    
    const lessonStepSchema = {
        type: Type.OBJECT,
        properties: {
            step: { type: Type.NUMBER },
            title: { type: Type.STRING },
            content: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of paragraphs for the lesson content." },
            keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
            interactiveQuestion: { ...interactiveQuestionSchema, nullable: true },
        },
        required: ['step', 'title', 'content', 'keyTakeaways'],
    };

    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            objective: { type: Type.STRING },
            lessonSteps: { type: Type.ARRAY, items: lessonStepSchema },
            finalQuiz: {
                type: Type.OBJECT,
                properties: {
                    questions: { type: Type.ARRAY, items: interactiveQuestionSchema },
                },
                required: ['questions'],
            },
            completionScreen: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    badgePrompt: { type: Type.STRING },
                },
                required: ['title', 'summary', 'badgePrompt'],
            },
        },
        required: ['title', 'objective', 'lessonSteps', 'finalQuiz', 'completionScreen'],
    };
    
    // Using the same underlying function as it's just a generic JSON fetcher from Gemini
    return getSecurityAnalysis(prompt, schema);

  } catch (error) {
    console.error(`Error generating learning module for topic "${topic}":`, error);
     if (error instanceof Error) {
        throw new Error(`[AI Error] Failed to generate the learning module. Details: ${error.message}`);
    }
    throw new Error("[Unknown Error] An unknown error occurred while creating the learning module.");
  }
};