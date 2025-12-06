
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePoem = async (
  recipientName: string, 
  occasion: string, 
  flowerNames: string[],
  language: 'en' | 'tr'
): Promise<string> => {
  try {
    const bouquetStr = flowerNames.length > 0 ? flowerNames.join(", ") : (language === 'tr' ? "güzel çiçekler" : "beautiful flowers");
    
    const prompt = `
      Recipient: ${recipientName}
      Occasion: ${occasion}
      Bouquet Composition: ${bouquetStr}
      Target Language: ${language === 'tr' ? 'Turkish' : 'English'}
      
      Please write a short, emotional, and romantic poem (max 4-5 lines) for ${recipientName} for ${occasion}.
      You may subtly reference the flowers in the bouquet (${bouquetStr}), but it is not mandatory.
      Language: ${language === 'tr' ? 'Turkish' : 'English'}.
      Tone: Romantic, sincere, poetic.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are the world's most romantic poet. You write short, impactful, and heart-touching verses for people's loved ones.",
        temperature: 0.8,
      }
    });

    return response.text || (language === 'tr' ? "Seni seviyorum, kelimeler yetersiz..." : "I love you, words are not enough...");
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback
    if (language === 'tr') {
      return `${recipientName},\n\nBu ${occasion} gününde yanımda olman,\nHayattaki en büyük şansım inan.\nBirlikte yaşlanmak tek dileğim,\nSeni çok seviyorum çiçeğim...`;
    }
    return `${recipientName},\n\nHaving you by my side on this ${occasion},\nIs my life's greatest gift.\nTo grow old with you is my only wish,\nI love you so much...`;
  }
};
