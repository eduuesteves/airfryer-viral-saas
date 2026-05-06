"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou no passado
    const consent = localStorage.getItem("fazrango-cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-800 p-4 sm:p-6 z-[999] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex-1 max-w-4xl">
        <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
          Nós utilizamos cookies para personalizar anúncios e melhorar a sua experiência. 
          Ao continuar navegando, você concorda com a nossa{" "}
          <Link href="/privacidade" className="text-orange-400 font-bold hover:underline">
            Política de Privacidade
          </Link>.
        </p>
      </div>
      <button 
        onClick={() => {
          localStorage.setItem("fazrango-cookie-consent", "true");
          setShow(false);
        }} 
        className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-orange-600/20"
      >
        Entendi e Aceito
      </button>
    </div>
  );
}