import Link from "next/link";

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-orange-500/30 flex flex-col">
      {/* HEADER LIMPO */}
      <header className="w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold tracking-wide text-zinc-100 text-lg hover:opacity-80 transition-opacity">
            Faz<span className="text-orange-500">Rango</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            ← Voltar para o Início
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col gap-8 animate-fade-in">
        <div className="space-y-2 border-b border-zinc-800 pb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white">Política de Privacidade</h1>
          <p className="text-zinc-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">1. Introdução</h2>
            <p>
              Bem-vindo ao <strong>FazRango</strong>. A sua privacidade é muito importante para nós. Esta Política de Privacidade explica como coletamos, usamos, protegemos e processamos as suas informações ao utilizar a nossa aplicação web.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">2. Coleta e Uso de Dados</h2>
            <p>O FazRango foi desenhado para coletar o mínimo de dados possível. As informações que processamos incluem:</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li><strong>Textos e Preferências:</strong> Os ingredientes que você digita e a sua seleção de métodos de preparo (como Fogão ou Airfryer) ou filtros (como o Modo Vegano).</li>
              <li><strong>Imagens da Bancada/Geladeira:</strong> Quando você anexa uma foto para a IA analisar, a imagem é convertida em código de forma temporária no seu próprio navegador e enviada aos nossos provedores de Inteligência Artificial. <strong>Nós não armazenamos essas imagens nos nossos servidores.</strong> Elas são descartadas imediatamente após a geração da receita.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">3. Serviços de Terceiros e Inteligência Artificial</h2>
            <p>
              Para gerar as receitas mágicas e os roteiros virais, o FazRango utiliza a API do <strong>Google Gemini</strong>. Os dados inseridos por você (textos e fotos dos ingredientes) são enviados de forma anônima para a IA do Google para processamento. Recomendamos a leitura da Política de Privacidade do Google para entender como eles lidam com dados de IA.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">4. Cookies e Anúncios (Google AdSense)</h2>
            <p>
              Para manter o FazRango gratuito, exibimos anúncios fornecidos pelo <strong>Google AdSense</strong>. 
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>O Google e seus parceiros utilizam cookies para exibir anúncios com base em suas visitas anteriores ao nosso site ou a outros sites na internet.</li>
              <li>Os usuários podem desativar a publicidade personalizada acessando as <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">Configurações de Anúncios do Google</a>.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">5. Armazenamento Local (Cache)</h2>
            <p>
              Utilizamos a memória temporária do seu próprio dispositivo (Cache do navegador) para salvar as receitas geradas durante a sua sessão. Isso deixa o aplicativo mais rápido e evita o recarregamento desnecessário de dados. Se você fechar a aba ou recarregar a página, esses dados temporários serão apagados.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">6. Seus Direitos (LGPD)</h2>
            <p>
              Como não exigimos criação de conta (login) nem coletamos dados pessoais identificáveis (como nome, CPF ou e-mail de forma obrigatória), você navega de forma majoritariamente anônima. Caso venhamos a implementar contas de usuário no futuro, você terá direito total de acessar, corrigir ou excluir seus dados a qualquer momento.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100">7. Contato</h2>
            <p>
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o funcionamento do FazRango, entre em contato conosco através do e-mail: <strong className="text-orange-400">contato@seuemail.com</strong>
            </p>
          </section>
        </div>
        
        <div className="pt-8 pb-12">
          <Link href="/" className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-6 py-3 rounded-xl font-bold transition-all">
            Voltar para as Receitas
          </Link>
        </div>
      </main>
    </div>
  );
}