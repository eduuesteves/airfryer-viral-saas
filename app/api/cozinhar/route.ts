import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Agora recebemos a variável 'vegano' que virá do botão no Front-end
    const { ingredientes, metodo, image, vegano } = body;

    if (!ingredientes && !image) {
      return NextResponse.json({ error: "Faltam ingredientes ou imagem." }, { status: 400 });
    }

    const metodoMap: Record<string, string> = {
      fogao: "no Fogão",
      airfryer: "na Airfryer",
      microondas: "no Micro-ondas",
      geladeira: "sem ir ao fogo",
    };
    const preparoEscolhido = metodoMap[metodo] || "Cozinha tradicional";

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    // O Prompt agora é dinâmico e se adapta caso o usuário seja vegano
    let prompt = `
      Atue como um chef de cozinha amigável e cuidadoso com a segurança alimentar.
      O usuário quer preparar uma refeição ${preparoEscolhido}.
      
      🚨 REGRA DE SEGURANÇA MÁXIMA:
      Analise os ingredientes solicitados ou a imagem enviada. Se não houver nenhum alimento real e comestível, se a foto for de objetos aleatórios, ou se o usuário pedir para misturar coisas que não fazem o menor sentido culinário, VOCÊ DEVE RECUSAR EDUCADAMENTE.
      Nesse caso, retorne EXATAMENTE este JSON: 
      { "erro": "Poxa, parece que esses ingredientes não combinam muito com uma receita culinária (ou não são alimentos reais). Que tal tentar com outras coisas gostosas que você tenha na geladeira?", "titulo": "", "tempo": "", "ingredientes": [], "preparo": [] }

      🍳 REGRA DE OURO (Caso seja seguro): 
      Pressuponha e adicione itens básicos de despensa (sal, pimenta, óleo, etc).
      ${vegano ? "🌱 ATENÇÃO OBRIGATÓRIA: O usuário ativou o MODO VEGANO. A receita DEVE ser 100% vegana, sem nenhuma carne, ovos, leite animal, manteiga ou mel. Use alternativas vegetais." : ""}
      
      Retorne APENAS um JSON válido com a estrutura:
      {
        "erro": null,
        "titulo": "Nome do Prato",
        "tempo": "X min",
        "ingredientes": ["1 item com medida"],
        "preparo": ["Passo 1", "Passo 2"]
      }
    `;

    if (ingredientes) prompt += `\nIngredientes: ${ingredientes}.`;
    if (image) prompt += `\nAnalise a imagem enviada com atenção. Só aceite se for comida de verdade.`;

    let result;
    if (image) {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      result = await model.generateContent([prompt, { inlineData: { data: base64Data, mimeType } }]);
    } else {
      result = await model.generateContent(prompt);
    }

    const text = result.response.text();
    return NextResponse.json({ resultado: JSON.parse(text) });

  } catch (error) {
    console.error("ERRO NA API COZINHAR:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}