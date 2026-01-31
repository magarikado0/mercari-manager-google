import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// vite.config.ts の define セクションで定義された環境変数を使用します
const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface OptimizationResult {
  title: string;
  description: string;
  suggestedPrice: number;
}

export const optimizeListing = async (rawTitle: string, rawDescription: string, category: string): Promise<OptimizationResult> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key (GEMINI_API_KEY) が設定されていません。.env ファイルを確認してください。");
  }

  try {
    // モデルの取得と生成設定（JSONモードの強制）
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING, description: '最適化されたタイトル（40文字以内）' },
            description: { type: SchemaType.STRING, description: '魅力的な説明文' },
            suggestedPrice: { type: SchemaType.NUMBER, description: '提案価格（円）' }
          },
          required: ["title", "description", "suggestedPrice"]
        }
      }
    });

    const prompt = `メルカリの出品商品としての情報を最適化してください。
    カテゴリー: ${category}
    現在のタイトル: ${rawTitle}
    現在の説明文: ${rawDescription}
    
    ターゲット層に刺さりやすく、検索されやすいキーワードを含め、丁寧かつ魅力的な文章にしてください。
    また、相場に基づいた適正価格も提案してください。`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("AIからのレスポンスが空です。");
    }

    try {
      const parsed = JSON.parse(text);
      return parsed as OptimizationResult;
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", text);
      throw new Error("AIの回答形式が正しくありません。もう一度お試しください。");
    }
  } catch (error) {
    console.error("AI Optimization Error:", error);
    throw error;
  }
};
