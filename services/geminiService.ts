
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MentalHealthAnalysis, StudyTask, MoodEntry, StudyPlanResponse } from "../types";

// Always use named parameter and direct environment variable for API key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStudyPlan = async (subjects: string[], availableHours: number, currentMood?: string, imageData?: string): Promise<StudyPlanResponse> => {
  const moodContext = currentMood ? `The user is currently feeling: ${currentMood}. Adjust the intensity and include self-care breaks accordingly.` : "";
  
  const prompt = imageData 
    ? `Analyze the attached image and these subjects: ${subjects.join(', ')}. 
       Extract key topics from the image (like textbook pages or notes) and create a structured study plan for ${availableHours} hours. 
       ${moodContext} 
       Additionally, suggest 2-3 extra subjects or wellness topics the user should consider based on their input and mood.`
    : `Create a structured study plan for: ${subjects.join(', ')}. 
       Time: ${availableHours} hours. 
       ${moodContext}
       Additionally, suggest 2-3 extra subjects or wellness topics the user should consider based on their input and mood.`;

  const parts: any[] = [{ text: prompt }];
  
  if (imageData) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageData.split(',')[1] // Extract base64 part
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          plan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                duration: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
              },
              required: ["subject", "topic", "duration", "priority"]
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                reason: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["Academic", "Wellness"] }
              },
              required: ["title", "reason", "type"]
            }
          }
        },
        required: ["plan", "recommendations"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{"plan": [], "recommendations": []}');
  } catch (e) {
    console.error("Failed to parse study plan", e);
    return { plan: [], recommendations: [] };
  }
};

export const analyzeMentalHealth = async (thoughts: string): Promise<MentalHealthAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these thoughts for mental well-being: "${thoughts}". Provide a mood label, sentiment analysis, and 3 specific recommendations.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mood: { type: Type.STRING },
          sentiment: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          alertLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
        },
        required: ["mood", "sentiment", "recommendations", "alertLevel"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse analysis", e);
    return {
      mood: "Unknown",
      sentiment: "Neutral",
      recommendations: ["Take a deep breath.", "Consider talking to someone you trust."],
      alertLevel: "Low"
    };
  }
};

export const getHolisticConditionReport = async (entries: MoodEntry[]): Promise<string> => {
  if (entries.length === 0) return "Not enough data for a report.";
  
  const summary = entries.map(e => `[${new Date(e.date).toLocaleDateString()}] Mood: ${e.mood}, Note: ${e.note}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Based on the following recent mood logs, provide a compassionate 2-paragraph summary of the user's mental health condition and trends. Suggest if they need more rest or professional interaction.
    
    Logs:
    ${summary}`,
  });

  return response.text || "Unable to generate report at this time.";
};

export const getChatStream = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  return ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: "You are Mindy, a compassionate AI mental health companion. You listen without judgment and provide supportive, empathetic responses. You are not a doctor, so remind users to seek professional help if they are in crisis."
    }
  });
};
