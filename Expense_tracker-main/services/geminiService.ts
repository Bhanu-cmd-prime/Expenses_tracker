
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Categorize expense using gemini-3-flash-preview following strict SDK rules
export const categorizeExpense = async (description: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Categorize this expense description into one of these: Food, Transport, Utilities, Entertainment, Health, or Other. Description: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING }
          },
          required: ["category"]
        }
      }
    });

    const data = JSON.parse(response.text || '{"category": "Other"}');
    return data.category;
  } catch (error) {
    console.error("Gemini categorization error:", error);
    return "Other";
  }
};

// Fix: Generate smart summary using gemini-3-flash-preview and handle potential undefined text property
export const getSmartSummary = async (expenses: any[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these expenses and provide a 2-sentence summary of the main spending trend: ${JSON.stringify(expenses)}`,
    });
    return response.text || "Spending insights currently unavailable.";
  } catch (error) {
    console.error("Gemini summary error:", error);
    return "Spending insights currently unavailable.";
  }
};
