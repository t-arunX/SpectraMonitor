import { GoogleGenAI } from "@google/genai";
import { LogEntry, CrashReport } from '../types';

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return aiClient;
};

export const analyzeLogs = async (logs: LogEntry[]): Promise<string> => {
  const ai = getClient();
  const logsText = logs.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following application logs and identify any potential issues, errors, or performance bottlenecks. Group related logs if possible. Be concise and technical.\n\nLogs:\n${logsText}`,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Failed to analyze logs. Please check API Key configuration.";
  }
};

export const summarizeLogs = async (logs: LogEntry[]): Promise<string> => {
  const ai = getClient();
  // Take last 50 logs for summary to avoid token limits if list is huge
  const recentLogs = logs.slice(-50);
  const logsText = recentLogs.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following application logs. Highlight key events, errors, and the general state of the application. Keep it brief and structured.\n\nLogs:\n${logsText}`,
    });
    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Gemini summary failed:", error);
    return "Failed to summarize logs.";
  }
};

export const explainCrash = async (crash: CrashReport): Promise<string> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Explain this crash to a junior developer. Suggest a fix. \n\nError: ${crash.error}\nLocation: ${crash.affectedFile}\nStack: ${crash.stackTrace}`,
    });
    return response.text || "No explanation available.";
  } catch (error) {
    return "AI Service Unavailable.";
  }
};

export const generateBugReport = async (logs: LogEntry[], crash: CrashReport | null): Promise<string> => {
    const ai = getClient();
    const context = crash ? `Crash: ${crash.error}` : 'User reported issue.';
    const recentLogs = logs.slice(-20).map(l => `${l.timestamp}: ${l.message}`).join('\n');

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a structured bug report based on this context. Include Summary, Logs, and Potential Reproduction Steps.\n\nContext: ${context}\nRecent Logs:\n${recentLogs}`
        });
        return response.text || "Failed to generate report.";
    } catch (e) {
        return "AI Error.";
    }
};

export const getPerformanceTips = async (metrics: any): Promise<string> => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Given these app metrics: CPU ${metrics.cpu}%, Memory ${metrics.memory}%, provide 3 bullet points for optimization.`
        });
        return response.text || "Optimization tips unavailable.";
    } catch (e) {
        return "AI Service Unavailable.";
    }
}

export const chatWithAgent = async (history: {role: string, text: string}[], newMessage: string): Promise<string> => {
    const ai = getClient();
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a helpful AI support engineer for a mobile app monitoring platform called SpectraMonitor. You help developers debug issues based on context provided."
            }
        });
        
        const context = history.map(h => `${h.role}: ${h.text}`).join('\n');
        const prompt = `${context}\nuser: ${newMessage}\nmodel:`;
        
        const response = await chat.sendMessage({
            message: prompt
        });
        return response.text || "I didn't catch that.";

    } catch (error) {
        console.error("Gemini chat failed:", error);
        return "AI Service Unavailable.";
    }
}