"use client";

import { useState, useRef } from "react";

// As 30 receitas mais buscadas para a aba "Em Alta"
const TOP_30_RECEITAS = [
  "Batata Frita Crocante", "Pão de Queijo Rápido", "Frango a Passarinho", "Torresmo Sequinho", 
  "Coxinha Fit", "Dadinho de Tapioca", "Pudim de Leite", "Bolo de Caneca", "Bife Acebolado", 
  "Linguiça Toscana", "Mandioca Frita", "Churrasco", "Peixe Empanado", "Nuggets Caseiro", 
  "Pastel de Vento", "Chips de Batata Doce", "Omelete Recheado", "Bacon Crocante", "Cebola Empanada",
  "Lasanha em Porção", "Legumes Assados", "Maçã com Canela", "Pizza de Frigideira", "Polenta Frita", 
  "Kibe Assado", "Misto Quente", "Salmão Grelhado", "Costelinha de Porco", "Pão de Alho", "Torta Salgada"
];

export default function Home() {
  const [activeMainTab, setActiveMainTab] = useState<'create' | 'trending'>('create');
  
  // Estados da Geração
  const [ingredient, setIngredient] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null); // Guardará as 2 receitas
  const [copied, setCopied] = useState(false);
  
  // Estados da Interface de Resultados
  const [activeSubTab, setActiveSubTab] = useState<'video' | 'recipe'>('video');
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0); // 0 = Opção 1, 1 = Opção 2
  const [unlockedRecipe2, setUnlockedRecipe2] = useState(false);
  
  // Estados do Anúncio (Rewarded Ad)
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateViralPost = async () => {
    if (!ingredient && !image) return; 
    setLoading(true);
    setCopied(false);
    setSelectedRecipeIndex(0);
    setUnlockedRecipe2(false); // Reseta o bloqueio a cada nova geração
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredient, image }),
      });
      
      const data = await res.json();
      if (data.error) {
        alert("Erro da API: " + data.error);
        return;
      }
      setResult(data);
      setActiveSubTab('video');
    } catch (error) {
      alert("Erro ao gerar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result || !result.receitas) return;
    const currentRecipe = result.receitas[selectedRecipeIndex];
    const textToCopy = `${currentRecipe.titulo}\n\n${currentRecipe.legenda}\n\n${currentRecipe.hashtags.join(" ")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Função que simula o usuário assistindo a um anúncio para desbloquear a Opção 2
  const watchAdToUnlock = () => {
    setAdModalOpen(true);
    setAdCountdown(5);
    
    const interval = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setUnlockedRecipe2(true);
          setSelectedRecipeIndex(1);
          setAdModalOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-orange-500/30 overflow-x-hidden flex flex-col">
      
      {/* HEADER E NAVEGAÇÃO PRINCIPAL */}
      <header className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-bold shadow-lg">V</div>
            <span className="font-bold tracking-wide text-zinc-100 hidden sm:block">Vértice Tech</span>
          </div>
          
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button 
              onClick={() => setActiveMainTab('create')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeMainTab === 'create' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              ✨ Criar Receita
            </button>
            <button 
              onClick={() => setActiveMainTab('trending')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeMainTab === 'trending' ? 'bg-zinc-800 text-orange-500' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              🔥 Top 30 Em Alta
            </button>
          </div>
        </div>
      </header>

      {/* ABA: TOP 30 EM ALTA */}
      {activeMainTab === 'trending' && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 animate-in fade-in">
          <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">O que o mundo está fritando?</h2>
          <p className="text-zinc-400 mb-8">As 30 receitas mais procuradas e virais para Airfryer nesta semana. Clique em uma para gerar agora!</p>
          
          {/* BANNER ADSENSE MOCK */}
          <div className="w-full h-24 bg-zinc-900 border border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center mb-8 text-zinc-500">
            <span className="text-xs uppercase tracking-widest mb-1">Publicidade (Google AdSense)</span>
            <span>Aqui ficará o seu banner do AdSense</span>
          </div>

          {/* LISTA INTERATIVA DO TOP 30 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pb-12">
            {TOP_30_RECEITAS.map((item, index) => (
              <button 
                key={index} 
                onClick={() => {
                  setIngredient(item); // 1. Preenche o input
                  setImage(null); // Limpa imagem, se houver
                  setActiveMainTab('create'); // 2. Volta pra aba principal
                  
                  // 3. Aguarda o React atualizar o texto e clica no botão principal
                  setTimeout(() => {
                    const btn = document.getElementById("btn-gerar-oculto");
                    if (btn) btn.click();
                  }, 100);
                }}
                className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 hover:border-orange-500/50 transition-all cursor-pointer flex flex-col items-center text-center gap-3 group shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 group-hover:border-orange-500/50 flex items-center justify-center font-black text-orange-500 text-lg transition-colors">
                  #{index + 1}
                </div>
                <span className="font-semibold text-sm text-zinc-300 group-hover:text-white">{item}</span>
                <span className="text-[10px] text-zinc-600 group-hover:text-orange-400 uppercase tracking-widest transition-colors">Gerar Roteiro</span>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* ABA: CRIAR RECEITA (O SaaS Principal) */}
      {activeMainTab === 'create' && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          
          {/* PAINEL ESQUERDO */}
          <div className="w-full max-w-lg space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 pb-2">
                Airfryer Viralizer
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl">
                Tire uma foto ou digite. Nós criamos 2 roteiros virais para você.
              </p>
            </div>

            <div className="bg-zinc-900/40 p-1.5 rounded-3xl border border-zinc-800/50 backdrop-blur-sm shadow-2xl">
              <div className="p-6 md:p-8 space-y-5 bg-zinc-900/50 rounded-2xl">
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => setIngredient(e.target.value)}
                      placeholder="Ex: Frango e Batata"
                      className="w-full p-4 pl-12 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-orange-500 text-lg"
                      onKeyDown={(e) => e.key === 'Enter' && generateViralPost()}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">🧊</span>
                  </div>
                  
                  <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-xl border border-zinc-700 flex items-center justify-center text-2xl">📷</button>
                </div>

                {image && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-orange-500/50">
                    <img src={image} alt="Preview" className="w-full h-full object-cover opacity-80" />
                    <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500 text-sm font-bold">X</button>
                  </div>
                )}
                
                <button 
                  id="btn-gerar-oculto"
                  onClick={generateViralPost} 
                  disabled={loading || (!ingredient && !image)} 
                  className="w-full relative group bg-zinc-100 hover:bg-white text-zinc-950 p-4 font-bold text-lg rounded-xl transition-all disabled:opacity-50"
                >
                  <span className="relative flex items-center justify-center gap-2 group-hover:text-orange-600 transition-colors">
                    {loading ? "Processando IA..." : "⚡ Gerar Duas Opções Virais"}
                  </span>
                </button>
              </div>
            </div>

            {/* BANNER DE AFILIADO AMAZON */}
            <a href="https://amzn.to/4d5UPZX" target="_blank" rel="noopener noreferrer" className="block bg-gradient-to-r from-blue-900 to-blue-950 p-5 rounded-2xl border border-blue-800 hover:border-orange-500 transition-all shadow-lg">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🛒</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm md:text-base">Sua Airfryer não é mais tão crocante?</h3>
                  <p className="text-xs md:text-sm text-blue-300">Aproveite descontos de até 40% nas Airfryers mais potentes na Amazon. <span className="text-orange-400 font-bold underline">Compre agora.</span></p>
                </div>
              </div>
            </a>
            <a href="https://amzn.to/4cVMAj6" target="_blank" rel="noopener noreferrer" className="block bg-gradient-to-r from-blue-900 to-blue-950 p-5 rounded-2xl border border-blue-800 hover:border-orange-500 transition-all shadow-lg">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🛒</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm md:text-base">Sua Airfryer não é mais tão crocante?</h3>
                  <p className="text-xs md:text-sm text-blue-300">Aproveite descontos de até 40% nas Airfryers mais potentes na Amazon. <span className="text-orange-400 font-bold underline">Compre agora.</span></p>
                </div>
              </div>
            </a>
          </div>

          {/* PAINEL DIREITO: RESULTADOS */}
          <div className="w-full max-w-[340px] flex-shrink-0 flex flex-col items-center gap-4">
            
            {/* SELETOR DE OPÇÕES (GRÁTIS vs ANÚNCIO) */}
            {!loading && result?.receitas && (
              <div className="flex gap-2 w-full animate-in slide-in-from-top">
                <button 
                  onClick={() => setSelectedRecipeIndex(0)}
                  className={`flex-1 p-2 rounded-lg text-xs font-bold border transition-all ${selectedRecipeIndex === 0 ? 'bg-orange-500 border-orange-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                >
                  Opção 1 (Grátis)
                </button>
                
                <button 
                  onClick={() => unlockedRecipe2 ? setSelectedRecipeIndex(1) : watchAdToUnlock()}
                  className={`flex-1 p-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 ${selectedRecipeIndex === 1 ? 'bg-orange-500 border-orange-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  {unlockedRecipe2 ? "Opção 2" : <>🔒 Opção 2 (Ver Anúncio)</>}
                </button>
              </div>
            )}

            {/* SELETOR DE VÍDEO / RECEITA */}
            {!loading && result?.receitas && (
              <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 w-full animate-in fade-in">
                <button onClick={() => setActiveSubTab('video')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'video' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>📱 Vídeo Viral</button>
                <button onClick={() => setActiveSubTab('recipe')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'recipe' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>🍳 Passo a Passo</button>
              </div>
            )}

            {/* CONTEÚDO (CELULAR OU CARD) */}
            {activeSubTab === 'video' ? (
              <div className={`relative w-full aspect-[9/16] bg-zinc-900 rounded-[3rem] border-[10px] border-black shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between ring-1 ring-white/10 ${loading ? 'animate-pulse' : ''}`}>
                <div className="absolute top-0 inset-x-0 h-7 bg-black z-20 rounded-b-3xl flex justify-center w-[140px] mx-auto"><div className="w-16 h-1.5 bg-zinc-800 rounded-full mt-2"></div></div>

                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
                ) : result?.receitas ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black z-0"></div>
                    <div className="relative z-10 flex-1 flex items-center justify-center p-6">
                      <div className="bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-black text-white text-center drop-shadow-lg">{result.receitas[selectedRecipeIndex].hook}</h2>
                      </div>
                    </div>
                    <div className="relative z-10 p-5 bg-gradient-to-t from-black via-black/90 to-transparent pt-12">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        <p className="text-sm text-zinc-200"><span className="font-bold">{result.receitas[selectedRecipeIndex].titulo}</span> — {result.receitas[selectedRecipeIndex].legenda}</p>
                        <p className="text-xs font-semibold text-orange-400 mt-2">{result.receitas[selectedRecipeIndex].hashtags.join(" ")}</p>
                        <button onClick={copyToClipboard} className="w-full mt-4 py-2 bg-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/20">{copied ? "✅ Copiado!" : "📋 Copiar Legenda"}</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center opacity-30 text-4xl">📱</div>
                )}
              </div>
            ) : (
              <div className="w-full aspect-[9/16] bg-zinc-900 rounded-[3rem] border border-zinc-800 p-8 overflow-y-auto custom-scrollbar text-sm">
                <h2 className="text-xl font-bold text-white mb-4">{result.receitas[selectedRecipeIndex].titulo}</h2>
                <h3 className="font-bold text-orange-400 mb-2">🛒 Ingredientes</h3>
                <ul className="mb-4 space-y-1">
                  {result.receitas[selectedRecipeIndex].ingredientes.map((i: string, idx: number) => <li key={idx} className="text-zinc-300">• {i}</li>)}
                </ul>
                <h3 className="font-bold text-orange-400 mb-2">👨‍🍳 Preparo</h3>
                <ol className="space-y-2">
                  {result.receitas[selectedRecipeIndex].preparo.map((p: string, idx: number) => <li key={idx} className="text-zinc-300">{idx + 1}. {p}</li>)}
                </ol>
              </div>
            )}
          </div>
        </main>
      )}

      {/* MODAL DO ANÚNCIO EM VÍDEO (REWARDED AD) */}
      {adModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center flex-col p-6 animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            {/* Espaço onde o script real do AdSense rodaria */}
            <div className="aspect-video bg-zinc-800 flex items-center justify-center flex-col text-center p-6 relative">
              <span className="absolute top-2 left-2 text-[10px] bg-black/50 px-2 py-1 rounded text-zinc-400 font-bold tracking-widest uppercase">Patrocinado</span>
              <span className="text-4xl mb-4">📺</span>
              <p className="font-bold text-white text-lg">Apoie a Vértice Tech</p>
              <p className="text-sm text-zinc-400">Assista este anúncio rápido para desbloquear sua receita exclusiva.</p>
            </div>
            <div className="p-4 bg-zinc-950 flex justify-between items-center border-t border-zinc-800">
              <span className="text-sm font-bold text-zinc-400">Liberando em: <span className="text-orange-500 text-lg">{adCountdown}s</span></span>
              {adCountdown === 0 ? (
                <button onClick={() => setAdModalOpen(false)} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 transition-colors text-white rounded-xl text-sm font-bold shadow-lg">Desbloquear Receita</button>
              ) : (
                <button disabled className="px-5 py-2.5 bg-zinc-800 text-zinc-500 rounded-xl text-sm cursor-not-allowed">Aguarde...</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}