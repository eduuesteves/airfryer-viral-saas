import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";


// 1. Importamos o Banner de Cookies que acabamos de criar
import CookieBanner from "./components/CookieBanner"; 
// (Ajuste o caminho acima se você salvou em outra pasta)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FazRango | Inteligência Artificial na sua Cozinha",
  description: "Plataforma profissional de inteligência artificial para criação de receitas práticas, aproveitamento de ingredientes e roteiros virais para criadores de conteúdo gastronômico.",
  keywords: ["receitas com IA", "o que fazer com", "receitas de airfryer", "roteiro tiktok culinária", "fazrango"],
  openGraph: {
    title: "FazRango | A sua IA Culinária",
    description: "Descubra receitas incríveis em segundos com os ingredientes que você já tem em casa.",
    url: "https://fazrango.com.br",
    siteName: "FazRango",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Logo FazRango",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // 2. O Schema.org que as IAs vão ler para te recomendar
  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FazRango",
    "url": "https://fazrango.com.br",
    "description": "Inteligência Artificial que gera receitas culinárias a partir dos ingredientes que o usuário tem na geladeira, incluindo suporte para restrições alimentares e criação de roteiros virais para o TikTok.",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL"
    }
  };

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1612026111512980" 
          crossOrigin="anonymous"
        ></script>
        
        {/* 3. Injeção do Schema invisível no cabeçalho da página */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }}
        />
      </head>
      <body className="min-h-full flex flex-col relative" suppressHydrationWarning>
        
        {children}
        
        {/* 4. O componente do Cookie Banner aparece no rodapé do site inteiro */}
        <CookieBanner />

        <Analytics />
        
      </body>
    </html>
  );
}