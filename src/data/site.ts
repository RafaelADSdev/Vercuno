const siteName = "Vercuno";
const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const productionUrl = (process.env.NEXT_PUBLIC_SITE_URL || (deploymentHost ? `https://${deploymentHost}` : undefined))?.replace(/\/+$/, "");

export const siteConfig = {
  name: siteName,
  email: "contato@vercuno.com.br",
  logo: { src: "/assets/brand/vercuno.svg", width: 527, height: 103 },
  description:
    "A Vercuno cria landing pages, sites institucionais, sites catálogo e sistemas web sob medida. Conheça os projetos e fale com a equipe pelo WhatsApp.",
  productionUrl,
  url: productionUrl || "http://localhost:3000",
  nav: [
    { label: "Serviços", href: "#servicos" },
    { label: "Portfólio", href: "/portfolio" },
    { label: "Sócios", href: "#equipe" },
  ],
} as const;

export const services = [
  {
    slug: "landing-pages",
    projectType: "landing-page",
    title: "Landing pages",
    searchTitle: "Criação de landing pages",
    description: "Uma página para apresentar sua oferta e gerar contatos.",
    details: "Para campanhas, lançamentos e serviços com uma oferta bem definida. Organizamos o texto, o visual e o caminho até o contato em uma página pensada para o celular.",
    deliverables: [
      "Estrutura e texto da página",
      "Design responsivo",
      "Medição de cliques",
    ],
    whatsappMessage:
      `Olá! Vim pelo site da ${siteName} e quero conversar sobre uma landing page.`,
  },
  {
    slug: "sites-institucionais",
    projectType: "site-institucional",
    title: "Sites institucionais",
    searchTitle: "Desenvolvimento de sites institucionais",
    description: "Seu negócio, seus serviços e seus projetos no mesmo endereço.",
    details: "Estruturamos as páginas, o portfólio e os canais de contato da sua empresa. O site é construído para funcionar bem no celular e ter uma base que facilite a indexação no Google.",
    deliverables: [
      "Organização das páginas",
      "Identidade visual aplicada ao site",
      "Publicação e SEO técnico",
    ],
    whatsappMessage:
      `Olá! Vim pelo site da ${siteName} e quero conversar sobre um site institucional.`,
  },
  {
    slug: "sites-catalogo",
    projectType: "site-catalogo",
    title: "Sites catálogo",
    searchTitle: "Criação de sites catálogo",
    description: "Seus produtos em um catálogo online, com pedidos pelo WhatsApp.",
    details: "Organizamos seus produtos por categoria, com fotos, preços e busca para facilitar a escolha. O site funciona bem no celular e cada produto pode abrir uma conversa no WhatsApp com o item já indicado.",
    deliverables: [
      "Catálogo com fotos e preços",
      "Busca e filtros de produtos",
      "Pedidos pelo WhatsApp",
    ],
    whatsappMessage:
      `Olá! Vim pelo site da ${siteName} e quero conversar sobre um site catálogo.`,
  },
  {
    slug: "sistemas-web",
    projectType: "sistema-web",
    title: "Sistemas web",
    searchTitle: "Desenvolvimento de sistemas web sob medida",
    description: "Painéis, integrações e automações para a sua equipe.",
    details: "Mapeamos o processo com sua equipe e definimos as telas, as regras e as integrações conforme a operação. O escopo pode incluir um painel interno, uma área de clientes ou a automação de tarefas repetitivas.",
    deliverables: [
      "Mapeamento do processo",
      "Painéis sob medida",
      "Integrações e automações",
    ],
    whatsappMessage:
      `Olá! Vim pelo site da ${siteName} e quero conversar sobre um sistema web sob medida.`,
  },
] as const;

export const differentiators = [
  {
    title: "Contato direto",
    description: "Você conversa com quem faz o projeto.",
  },
  {
    title: "Design e código próprios",
    description: "Desenhamos as telas e escrevemos o código do projeto.",
  },
  {
    title: "Performance e acessibilidade",
    description: "Celular, teclado e carregamento fazem parte da entrega.",
  },
] as const;

export const team = [
  {
    name: "Miguel Leite",
    description:
      "Organiza os projetos e acompanha os prazos combinados.",
    image: "/assets/team/miguel-leite.webp",
  },
  {
    name: "Kaio Seabra",
    description:
      "Conversa com você primeiro. Entende o que você precisa e alinha escopo, prazo e preço.",
    image: "/assets/team/kaio-seabra.webp",
  },
  {
    name: "Rafael Arcanjo",
    description:
      "Escreve o código do projeto. Continua cuidando dele depois que o site entra no ar.",
    image: "/assets/team/rafael-arcanjo.webp",
  },
] as const;

// Número comercial publicado no site. A variável de ambiente tem prioridade
// para trocar o canal sem novo deploy de código.
export const whatsappNumber = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "558185019006"
).replace(/\D/g, "");

export function buildWhatsappHref(message: string) {
  return whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    : null;
}

export const whatsappHref = buildWhatsappHref(
  `Olá! Vim pelo site da ${siteName}. Quero conversar sobre um projeto.`,
);
