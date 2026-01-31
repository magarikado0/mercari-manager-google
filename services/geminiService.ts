
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface OptimizationResult {
  title: string;
  description: string;
  suggestedPrice: number;
}

export const optimizeListing = async (rawTitle: string, rawDescription: string, category: string): Promise<OptimizationResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `メルカリの出品商品としての情報を最適化してください。
    カテゴリー: ${category}
    現在のタイトル: ${rawTitle}
    現在の説明文: ${rawDescription}
    
    ターゲット層に刺さりやすく、検索されやすいキーワードを含め、丁寧かつ魅力的な文章にしてください。
    また、相場に基づいた適正価格も提案してください。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: '最適化されたタイトル（40文字以内）' },
          description: { type: Type.STRING, description: '魅力的な説明文' },
          suggestedPrice: { type: Type.NUMBER, description: '提案価格（円）' }
        },
        required: ["title", "description", "suggestedPrice"]
      }
    }
  });

  return JSON.parse(response.text);
};
