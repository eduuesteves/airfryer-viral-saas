import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { ingredient, image } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    let prompt = `
      Atue como um chef criativo e roteirista de TikTok para pratos de Airfryer.
      Você receberá uma lista de ingredientes ou uma foto. 
      Crie DUAS opções de receitas diferentes.
      Regra 1: Você pode e deve incluir ingredientes básicos de despensa (sal, pimenta, azeite, alho, cebola, farinha) para que a receita faça sentido e fique gostosa.
      Regra 2: Retorne APENAS um objeto JSON com o array 'receitas' contendo exatamente 2 opções.
    `;

    if (ingredient) prompt += `\nIngredientes principais do usuário: ${ingredient}.`;
    if (image) prompt += `\nAnalise a imagem e use os ingredientes visíveis como base.`;

    prompt += `
      Formato EXATO do JSON esperado:
      {
        "receitas": [
          {
            "titulo": "título chamativo 1",
            "ingredientes": ["item principal", "tempero básico", "etc"],
            "preparo": ["passo 1", "passo 2"],
            "hook": "gancho impactante do vídeo 1",
            "legenda": "legenda viral 1",
            "hashtags": ["#tag1", "#tag2"]
          },
          {
            "titulo": "título chamativo 2",
            "ingredientes": ["item alternativo", "tempero básico", "etc"],
            "preparo": ["passo 1", "passo 2"],
            "hook": "gancho impactante do vídeo 2",
            "legenda": "legenda viral 2",
            "hashtags": ["#tag3", "#tag4"]
          }
        ]
      }
    `;

    let result;
    if (image) {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      result = await model.generateContent([prompt, { inlineData: { data: base64Data, mimeType } }]);
    } else {
      result = await model.generateContent(prompt);
    }

    const text = await result.response.text();
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("ERRO:", error);
    return NextResponse.json({ error: "Erro na geração" }, { status: 500 });
  }
}