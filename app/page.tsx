"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [inputTexto, setInputTexto] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [metodoAtual, setMetodoAtual] = useState("fogao"); 
  const [isVegano, setIsVegano] = useState(false);
  const [cacheResultados, setCacheResultados] = useState<Record<string, any>>({});
  const [status, setStatus] = useState<"ocioso" | "vendo_anuncio" | "gerando" | "pronto">("ocioso");

  const topReceitas = [
    { cat: "🔥 Top Fogão", pratos: ["Strogonoff Clássico", "Macarrão à Carbonara", "Arroz de Forno Cremoso", "Picadinho de Carne", "Panqueca de Carne", "Omelete Recheado"] },
    { cat: "💨 Top Airfryer", pratos: ["Batata Rústica", "Frango a Passarinho Crocante", "Dadinho de Tapioca", "Pão de Alho Caseiro", "Torresmo Pururuca", "Coxinha Fit"] },
    { cat: "♨️ Top Micro-ondas", pratos: ["Bolo de Caneca de Chocolate", "Pudim de Leite Rápido", "Omelete de Caneca", "Pipoca Caramelizada", "Arroz de Micro-ondas", "Macarrão com Queijo"] },
    { cat: "❄️ Receitas Frias", pratos: ["Salada Caprese", "Wrap de Atum", "Ceviche de Tilápia", "Patê de Frango", "Salpicão Tradicional", "Sanduíche Natural"] },
    { cat: "🥗 Favoritos Vegetarianos/Veganos", pratos: ["Escondidinho de Cogumelos", "Hambúrguer de Grão de Bico", "Moqueca de Banana da Terra", "Lasanha de Berinjela", "Risoto de Alho-poró", "Salada de Quinoa"] },
  ];

  const metodos = [
    { id: "fogao", nome: "Fogão", icone: "🔥" },
    { id: "airfryer", nome: "Airfryer", icone: "💨" },
    { id: "microondas", nome: "Micro", icone: "♨️" },
    { id: "geladeira", nome: "Frios", icone: "❄️" },
    { id: "viralizar", nome: "TikTok", icone: "📱" },
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagem(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function buscarNaAPI(metodo: string) {
    try {
      if (metodo === "viralizar") {
        const response = await fetch("/api/viralizar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredient: inputTexto, image: imagem, vegano: isVegano }),
        });
        const data = await response.json();
        setCacheResultados(prev => ({ ...prev, [metodo]: { tipo: "viral", dados: data.receitas } }));
      } else {
        const response = await fetch("/api/cozinhar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredientes: inputTexto, metodo, image: imagem, vegano: isVegano }),
        });
        const data = await response.json();
        setCacheResultados(prev => ({ ...prev, [metodo]: { tipo: "json_receita", dados: data.resultado } }));
      }
      setStatus("pronto");
    } catch (error) {
      alert("Deu um erro na geração! Tente de novo.");
      setStatus("ocioso");
    }
  }

  async function iniciarGeracao() {
    if (!inputTexto && !imagem) {
      alert("A geladeira não pode estar vazia! Digite algo ou envie uma foto.");
      return;
    }
    setCacheResultados({});
    setStatus("vendo_anuncio");
    setTimeout(() => {
      setStatus("gerando");
      buscarNaAPI(metodoAtual);
    }, 3000); 
  }

  async function handleTrocarMetodo(novoMetodo: string) {
    setMetodoAtual(novoMetodo);
    if (status === "ocioso") return;
    if (cacheResultados[novoMetodo]) {
      setStatus("pronto");
      return;
    }
    setStatus("vendo_anuncio");
    setTimeout(() => {
      setStatus("gerando");
      buscarNaAPI(novoMetodo);
    }, 3000);
  }

  // NOVA FUNÇÃO: O "Cérebro" do clique no Top 30
  function selecionarPratoTop30(prato: string, categoria: string) {
    // 1. Preenche a caixa de texto
    setInputTexto(`Gostaria da receita de: ${prato}`);
    
    // 2. Descobre qual é a aba correta com base no título da categoria
    let abaCorreta = "fogao";
    if (categoria.includes("Airfryer")) abaCorreta = "airfryer";
    else if (categoria.includes("Micro-ondas")) abaCorreta = "microondas";
    else if (categoria.includes("Frias")) abaCorreta = "geladeira";
    
    // 3. Muda a aba lá em cima
    setMetodoAtual(abaCorreta);

    // 4. Se for da categoria vegana, já liga o interruptor verde sozinho!
    if (categoria.includes("Vegetarianos")) {
      setIsVegano(true);
    } else {
      setIsVegano(false);
    }

    // 5. Rola a tela suavemente para o topo para o usuário ver o que aconteceu
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-orange-500/30 flex flex-col relative">
      
      {status === "vendo_anuncio" && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6">
            <span className="text-5xl animate-bounce">📢</span>
            <h2 className="text-xl font-bold text-white">Apoiando o FazRango...</h2>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-orange-500 animate-[progress_3s_ease-in-out_forwards]"></div>
            </div>
          </div>
        </div>
      )}

      <header className="w-full pt-8 pb-4">
        <div className="max-w-5xl mx-auto px-4 flex justify-center">
          <h1 className="font-extrabold tracking-tight text-white text-3xl md:text-5xl drop-shadow-lg">
            Faz<span className="text-orange-500">Rango</span>
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 flex flex-col gap-6 mt-4 pb-12">
        
        <div className="w-full flex overflow-x-auto no-scrollbar bg-zinc-900/60 border border-zinc-800 rounded-2xl p-1.5 gap-1.5">
          {metodos.map((m) => {
            const isAtivo = metodoAtual === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleTrocarMetodo(m.id)}
                className={`flex-1 min-w-[100px] flex flex-col md:flex-row items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs md:text-sm font-bold transition-all border ${
                  isAtivo ? "bg-zinc-800 text-orange-400 shadow-md border-orange-500/30" : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className="text-xl">{m.icone}</span>
                <span>{m.nome}</span>
              </button>
            );
          })}
        </div>

        <div className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-2 shadow-lg flex flex-col animate-fade-in">
          <textarea
            value={inputTexto}
            onChange={(e) => {
              setInputTexto(e.target.value);
              if(status !== "ocioso") setStatus("ocioso");
            }}
            placeholder={metodoAtual === "viralizar" ? "Qual tema do vídeo?" : "O que tem na geladeira hoje?"}
            className="w-full bg-transparent text-zinc-100 placeholder:text-zinc-600 focus:outline-none resize-none min-h-[90px] p-4 text-lg"
          />
          
          <div className="px-4 pb-4 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800/50 pt-4 mt-2">
            {!imagem ? (
              <label className="flex items-center gap-3 w-max bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-5 py-2.5 rounded-xl cursor-pointer transition-colors text-sm font-bold shadow-md">
                <span className="text-lg">📸</span>
                <span className="hidden sm:inline">Anexar Foto da Geladeira</span>
                <span className="sm:hidden">Foto</span>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            ) : (
              <div className="flex items-center gap-4 bg-zinc-950 p-2 rounded-xl w-max border border-zinc-700 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagem} alt="Preview" className="w-14 h-14 rounded-lg object-cover" />
                <button onClick={() => setImagem(null)} className="text-red-400 text-sm font-bold pr-3">Remover Foto</button>
              </div>
            )}

            <label className={`flex items-center gap-3 px-5 py-2.5 rounded-xl cursor-pointer transition-all border text-sm font-bold shadow-md ${
              isVegano ? "bg-green-500/10 border-green-500/50 text-green-400" : "bg-zinc-800/50 border-zinc-700/50 text-zinc-500 hover:bg-zinc-800"
            }`}>
              <input type="checkbox" checked={isVegano} onChange={(e) => { setIsVegano(e.target.checked); if(status !== "ocioso") setStatus("ocioso"); }} className="hidden" />
              <span className="text-lg grayscale-0">🌱</span>
              <span>Modo Vegano</span>
              <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${isVegano ? "bg-green-500" : "bg-zinc-600"}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isVegano ? "translate-x-4" : "translate-x-0"}`}></div>
              </div>
            </label>
          </div>
          
          {status === "ocioso" && (
            <button
              onClick={iniciarGeracao}
              className={`w-full text-white font-bold text-xl py-4 rounded-2xl transition-all shadow-lg mx-auto mb-2 w-[96%] ${
                metodoAtual === "viralizar" ? "bg-purple-600 shadow-purple-600/20" : "bg-orange-600 shadow-orange-600/20"
              }`}
            >
              {metodoAtual === "viralizar" ? "Gerar Roteiro Viral" : "Cozinhar com IA"}
            </button>
          )}
        </div>

        {status === "gerando" && (
          <div className="w-full p-16 flex flex-col items-center justify-center gap-6 text-zinc-500 animate-pulse">
            <span className="text-5xl">{isVegano ? "🌱" : "👨‍🍳"}</span>
            <p className="font-medium text-lg">Analisando e gerando a receita perfeita...</p>
          </div>
        )}

        {status === "ocioso" && (
          <div className="w-full animate-fade-in mt-8 space-y-12">
            <div className="text-center space-y-3 mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-white">Sem ideias? Veja o Top 30</h2>
              <p className="text-zinc-400">As receitas mais buscadas pela nossa comunidade.</p>
            </div>
            {topReceitas.map((categoria, idx) => (
              <div key={idx} className="space-y-6">
                <h3 className={`text-xl font-black ${categoria.cat.includes("Vegetarianos") ? "text-green-500" : "text-zinc-200"}`}>
                  {categoria.cat}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categoria.pratos.map((prato, pratoIdx) => (
                    // ADICIONADO O ONCLICK AQUI!
                    <div 
                      key={pratoIdx} 
                      onClick={() => selecionarPratoTop30(prato, categoria.cat)}
                      className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                    >
                      <span className="text-sm md:text-base font-bold text-zinc-300 group-hover:text-orange-400 transition-colors">{prato}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {status === "pronto" && cacheResultados[metodoAtual] && (
          <div className="w-full animate-fade-in flex flex-col gap-8 mt-2">
            
            {cacheResultados[metodoAtual].tipo === "json_receita" && cacheResultados[metodoAtual].dados?.erro ? (
               <div className="w-full bg-red-500/10 border border-red-500/30 rounded-3xl p-8 text-center space-y-4">
                 <span className="text-4xl">🛑</span>
                 <h2 className="text-xl font-bold text-red-400">Não consegui criar a receita!</h2>
                 <p className="text-zinc-300">{cacheResultados[metodoAtual].dados.erro}</p>
                 <button onClick={() => setStatus("ocioso")} className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-white transition-colors">Tentar Outros Ingredientes</button>
               </div>
            ) : cacheResultados[metodoAtual].tipo === "json_receita" && cacheResultados[metodoAtual].dados && (
              <div className="relative overflow-hidden bg-zinc-900 border border-orange-500/20 rounded-3xl p-6 md:p-10 shadow-2xl">
                <div className={`absolute top-0 left-0 w-full h-2 ${isVegano ? "bg-gradient-to-r from-green-600 to-emerald-400" : "bg-gradient-to-r from-orange-600 to-yellow-500"}`}></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-zinc-800/60 pb-6">
                  <h2 className="text-2xl md:text-4xl font-black text-white">
                    {cacheResultados[metodoAtual].dados.titulo}
                    {isVegano && <span className="ml-3 text-2xl" title="Receita Vegana">🌱</span>}
                  </h2>
                  <div className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-4 py-2 rounded-full text-sm font-bold">
                    ⏱️ {cacheResultados[metodoAtual].dados.tempo}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800">
                    <h4 className="text-lg font-black text-orange-400 mb-4">🛒 Ingredientes</h4>
                    <ul className="space-y-3">
                      {cacheResultados[metodoAtual].dados.ingredientes?.map((ing: string, i: number) => (
                        <li key={i} className="flex gap-3 text-zinc-300"><span className="text-orange-500">•</span> {ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-zinc-100 mb-4">👨‍🍳 Preparo</h4>
                    <div className="space-y-4">
                      {cacheResultados[metodoAtual].dados.preparo?.map((passo: string, i: number) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center border border-orange-500/30">{i + 1}</div>
                          <p className="text-zinc-300 pt-1">{passo}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        )}

      </main>

      {/* TEXTO DE SEO PARA O GOOGLE ADSENSE (Sempre visível no final da página) */}
      <section className="w-full max-w-5xl mx-auto px-4 py-16 border-t border-zinc-900 mt-12 animate-fade-in">
        <div className="prose prose-invert max-w-none text-zinc-400">
          <h2 className="text-2xl font-bold text-zinc-200 mb-4">Como funciona a Inteligência Artificial do FazRango?</h2>
          <p className="mb-4">
            O FazRango é a sua assistente culinária inteligente projetada para acabar com o desperdício de alimentos e facilitar o seu dia a dia na cozinha. Nossa plataforma utiliza modelos avançados de Inteligência Artificial para analisar os ingredientes que você já tem na sua geladeira ou despensa e gerar receitas práticas, saudáveis e deliciosas em questão de segundos.
          </p>
          <h3 className="text-xl font-bold text-zinc-200 mt-6 mb-3">Receitas para Airfryer, Micro-ondas e muito mais</h3>
          <p className="mb-4">
            Seja você um cozinheiro iniciante ou experiente, nossa ferramenta se adapta ao seu método de preparo favorito. Você pode solicitar receitas exclusivas para Airfryer (fritadeira elétrica), métodos tradicionais de fogão, receitas rápidas de micro-ondas ou até mesmo pratos frios que não exigem cozimento. Além disso, contamos com um filtro exclusivo para alimentação vegana e vegetariana, garantindo opções para todos os estilos de vida.
          </p>
          <h3 className="text-xl font-bold text-zinc-200 mt-6 mb-3">Criação de Conteúdo Viral para TikTok e Reels</h3>
          <p className="mb-4">
            Além da gastronomia do dia a dia, o FazRango possui uma ferramenta dedicada a criadores de conteúdo focados em culinária. Ao usar a aba de "Roteiro Viral", nossa IA estrutura um roteiro completo para redes sociais, incluindo o "Hook" (gancho dos 3 primeiros segundos), a lista de ingredientes, a legenda otimizada com SEO e as melhores hashtags para o Instagram Reels, TikTok e YouTube Shorts.
          </p>
        </div>
      </section>

      <footer className="w-full border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md py-8 mt-auto z-40">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-400">FazRango</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 font-medium">
            <Link href="/privacidade" className="hover:text-orange-400 transition-colors">Política de Privacidade</Link>
            <Link href="/termos" className="hover:text-orange-400 transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `@keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }`}} />
    </div>
  );
}