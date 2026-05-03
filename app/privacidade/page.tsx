import Link from "next/link";

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-orange-500/30 flex flex-col">
      {/* HEADER SIMPLIFICADO */}
      <header className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">V</div>
            <span className="font-bold tracking-wide text-zinc-100">Vértice Tech</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
            ← Voltar ao Início
          </Link>
        </div>
      </header>

      {/* CONTEÚDO DA POLÍTICA */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Política de Privacidade</h1>
          <p className="text-zinc-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="space-y-6 text-zinc-400 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">1. Introdução</h2>
            <p>A Vértice Tech ("nós", "nosso", "site") respeita a sua privacidade. Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações quando você utiliza nosso serviço de geração de roteiros e receitas via Inteligência Artificial.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">2. Coleta de Dados e Inteligência Artificial</h2>
            <p>Para fornecer nossos serviços, utilizamos a API do Google Gemini. Quando você digita ingredientes ou envia uma foto, esses dados são processados momentaneamente pela IA para gerar o seu roteiro. <strong>Nós não armazenamos suas fotos ou textos em nossos servidores.</strong> O processamento é feito em tempo real e descartado logo após a geração da resposta.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">3. Cookies e Publicidade (Google AdSense)</h2>
            <p>Utilizamos o Google AdSense para exibir anúncios. O Google utiliza cookies (como o cookie DoubleClick) para veicular anúncios baseados em suas visitas anteriores ao nosso site ou a outros sites na internet.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecedores de terceiros, incluindo o Google, usam cookies para veicular anúncios com base nas visitas anteriores do usuário.</li>
              <li>Você pode desativar o uso de cookies de publicidade personalizada acessando as <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Configurações de anúncios do Google</a>.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">4. Links de Afiliados (Amazon)</h2>
            <p>Nosso site participa do Programa de Associados da Amazon, um programa de publicidade de afiliados projetado para fornecer um meio para sites ganharem taxas de publicidade por meio de links para a Amazon.com.br. Ao clicar nesses links, a Amazon pode inserir um cookie no seu navegador para rastrear a origem da venda.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">5. Seus Direitos</h2>
            <p>Como não exigimos criação de conta, login ou fornecimento de dados pessoais identificáveis (como nome ou e-mail) para o uso da ferramenta principal, sua navegação é anônima. Os únicos dados rastreados são métricas de navegação genéricas (como o Google Analytics ou métricas do AdSense).</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">6. Contato</h2>
            <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através do e-mail: <strong>contato@verticetech.com</strong> (Substitua pelo seu e-mail real se desejar).</p>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-zinc-900 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-zinc-600">
          © {new Date().getFullYear()} Vértice Tech. Construído do zero.
        </div>
      </footer>
    </div>
  );
}