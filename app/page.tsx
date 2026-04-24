"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [ingredient, setIngredient] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'recipe'>('video');
  
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
    setActiveTab('video'); // Volta para a aba de vídeo ao gerar um novo
    
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
    } catch (error) {
      alert("Erro ao gerar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const textToCopy = `${result.titulo}\n\n${result.legenda}\n\n${result.hashtags.join(" ")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-orange-500/30 overflow-x-hidden flex flex-col">
      <header className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-bold shadow-lg">
              V
            </div>
            <span className="font-bold tracking-wide text-zinc-100">Vértice Tech</span>
          </div>
          <div className="text-xs font-semibold px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400">
            MVP v2.1
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
        
        {/* LADO ESQUERDO */}
        <div className="w-full max-w-lg space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 pb-2">
              Airfryer Viralizer
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl">
              Tire uma foto do que sobrou na geladeira e crie um hit no TikTok em segundos.
            </p>
          </div>

          <div className="bg-zinc-900/40 p-1.5 rounded-3xl border border-zinc-800/50 backdrop-blur-sm shadow-2xl">
            <div className="p-6 md:p-8 space-y-5 bg-zinc-900/50 rounded-2xl">
              
              <label className="block text-sm font-bold text-zinc-300 uppercase tracking-widest">
                Ingredientes ou Foto
              </label>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                    placeholder="Ex: Frango e Batata"
                    className="w-full p-4 pl-12 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-lg shadow-inner"
                    onKeyDown={(e) => e.key === 'Enter' && generateViralPost()}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">🧊</span>
                </div>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-xl border border-zinc-700 transition-colors flex items-center justify-center text-2xl"
                  title="Tirar foto da geladeira"
                >
                  📷
                </button>
              </div>

              {image && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-orange-500/50">
                  <img src={image} alt="Preview" className="w-full h-full object-cover opacity-80" />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors text-sm font-bold"
                  >
                    X
                  </button>
                </div>
              )}
              
              <button
                onClick={generateViralPost}
                disabled={loading || (!ingredient && !image)}
                className="w-full relative group overflow-hidden bg-zinc-100 hover:bg-white text-zinc-950 p-4 font-bold text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-zinc-950 group-hover:border-white border-t-transparent group-hover:border-t-transparent rounded-full animate-spin"></div>
                      Analisando...
                    </>
                  ) : (
                    "⚡ Gerar Vídeo Viral"
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* LADO DIREITO (RESULTADOS) */}
        <div className="w-full max-w-[340px] flex-shrink-0 flex flex-col items-center gap-6">
          
          {/* Seletor de Abas (Aparece apenas quando há resultado e não está carregando) */}
          {!loading && result && (
            <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 w-full animate-in fade-in zoom-in duration-500">
              <button 
                onClick={() => setActiveTab('video')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'video' ? 'bg-orange-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              >
                📱 Vídeo Viral
              </button>
              <button 
                onClick={() => setActiveTab('recipe')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'recipe' ? 'bg-orange-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              >
                🍳 Ver Receita
              </button>
            </div>
          )}

          {activeTab === 'video' ? (
            /* CELULAR MOCKUP */
            <div className={`relative w-full aspect-[9/16] bg-zinc-900 rounded-[3rem] border-[10px] border-black shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between ring-1 ring-white/10 transition-all duration-500 ${loading ? 'animate-pulse shadow-[0_0_50px_rgba(249,115,22,0.2)]' : ''}`}>
              <div className="absolute top-0 inset-x-0 h-7 bg-black z-20 rounded-b-3xl flex justify-center w-[140px] mx-auto">
                <div className="w-16 h-1.5 bg-zinc-800 rounded-full mt-2"></div>
              </div>

              {loading ? (
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center flex-col gap-4 p-8">
                  <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                  <p className="text-orange-500 font-medium animate-pulse text-center">Processando ingredientes...</p>
                </div>
              ) : result ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black z-0"></div>
                  <div className="relative z-10 flex-1 flex items-center justify-center p-6 animate-in zoom-in duration-500">
                    <div className="bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl transform hover:scale-105 transition-transform cursor-pointer">
                      <h2 className="text-2xl font-black text-white leading-tight text-center drop-shadow-lg">
                        {result.hook}
                      </h2>
                    </div>
                  </div>
                  <div className="relative z-10 p-5 bg-gradient-to-t from-black via-black/90 to-transparent pt-20 animate-in slide-in-from-bottom-10 duration-500">
                    <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pb-2 pr-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-base text-white flex items-center gap-2">
                          <span>@verticetech</span>
                        </h3>
                      </div>
                      <p className="text-sm text-zinc-200 leading-relaxed">
                        <span className="font-bold text-white">{result.titulo}</span> — {result.legenda}
                      </p>
                      <p className="text-xs font-semibold text-orange-400 leading-relaxed">
                        {result.hashtags?.join(" ")}
                      </p>
                      <button 
                        onClick={copyToClipboard}
                        className={`w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10'}`}
                      >
                        {copied ? "✅ Copiado!" : "📋 Copiar Legenda"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center">
                  <div className="text-center p-8 space-y-4 opacity-40">
                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-inner border border-zinc-800 transform rotate-12">📱</div>
                    <p className="text-sm font-semibold tracking-wide uppercase">Seu feed começa aqui</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* CARD DA RECEITA */
            <div className="w-full aspect-[9/16] bg-zinc-900 rounded-[3rem] border border-zinc-800 shadow-2xl p-8 overflow-y-auto custom-scrollbar animate-in flip-in-y duration-500">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white leading-tight">{result.titulo}</h2>
                  <div className="w-12 h-1.5 bg-orange-500 mt-4 rounded-full"></div>
                </div>
                
                <div>
                  <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2 text-lg">🛒 Ingredientes</h3>
                  <ul className="space-y-3">
                    {result.ingredientes.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-zinc-300">
                        <span className="text-orange-500 text-lg leading-none">•</span>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2 text-lg">👨‍🍳 Passo a Passo</h3>
                  <ol className="space-y-4">
                    {result.preparo.map((passo: string, i: number) => (
                      <li key={i} className="flex gap-4 text-zinc-300">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-orange-400 text-sm">
                          {i + 1}
                        </span>
                        <span className="leading-snug mt-0.5">{passo}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}