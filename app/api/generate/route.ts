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
      Atue como um roteirista de TikTok especializado em culinária para Airfryer.
      Crie uma receita barata e simples.
    `;

    if (ingredient) {
      prompt += `\nPriorize o uso destes ingredientes: ${ingredient}.`;
    }

    if (image) {
      prompt += `\nAnalise a imagem enviada, identifique os ingredientes disponíveis nela e crie a receita com base no que você "viu" e na Airfryer.`;
    }

    prompt += `
      Retorne APENAS um objeto JSON válido com:
      {
        "titulo": "título chamativo",
        "ingredientes": ["lista", "de", "itens"],
        "preparo": ["passo 1", "passo 2"],
        "hook": "gancho impactante de 3 segundos para o vídeo",
        "legenda": "legenda com emojis e gatilhos mentais",
        "hashtags": ["#tag1", "#tag2"]
      }
    `;

    let result;
    
    // Se tiver imagem, enviamos o texto + a foto
    if (image) {
      // O frontend manda a imagem como "data:image/jpeg;base64,/9j/4AAQ..."
      // Precisamos separar o cabeçalho dos dados reais
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      };
      result = await model.generateContent([prompt, imagePart]);
    } else {
      // Se não tiver imagem, enviamos só o texto
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("🔥 ERRO DETALHADO DO GEMINI:", error);
    return NextResponse.json({ error: "Erro na geração" }, { status: 500 });
  }
}