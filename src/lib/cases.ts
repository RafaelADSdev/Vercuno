export const caseTypes = {
  "landing-page": { singular: "Landing page", plural: "Landing pages" },
  "site-institucional": { singular: "Site institucional", plural: "Sites institucionais" },
  "site-catalogo": { singular: "Site catálogo", plural: "Sites catálogo" },
  "sistema-web": { singular: "Sistema web", plural: "Sistemas web" },
} as const;

type ImageDimensions = { width: number; height: number };

export type CaseStudy = {
  slug: string;
  client: string;
  sector: string;
  projectType: keyof typeof caseTypes;
  year: number;
  liveUrl?: string;
  repositoryUrl?: string;
  summary: string;
  challenge: string;
  scope: string[];
  features: string[];
  technicalNotes: string[];
  stack?: string[];
  evidenceNote: string;
  images: {
    desktopAfter: string;
    mobileAfter?: string;
    desktopBefore?: string;
    mobileBefore?: string;
    alt: { desktop: string; mobile?: string };
    dimensions: { desktop: ImageDimensions; mobile?: ImageDimensions };
    desktopPreviewWidths?: readonly number[];
    caption: { desktop: string; mobile?: string; comparison?: string };
  };
  featured?: boolean;
};

export const nauticaDesktopPreviewWidths = [480, 750, 1080] as const;
export const nauticaLiveUrl = "https://nautica.srv1113578.stayx.cloud/";

// O ano indica quando o projeto foi registrado em código ou em capturas verificáveis.
export const cases: readonly CaseStudy[] = [
  {
    slug: "nautica-engenharia",
    client: "Náutica Engenharia",
    sector: "Engenharia",
    projectType: "landing-page",
    year: 2026,
    liveUrl: nauticaLiveUrl,
    featured: true,
    // TODO: confirmar com Rafael o desafio original do projeto.
    summary: "Landing page de serviços de engenharia com pedido de orçamento pelo WhatsApp.",
    challenge: "Apresentar os serviços e a cobertura regional da Náutica Engenharia em uma página com acesso direto ao orçamento.",
    scope: ["Arquitetura de conteúdo", "Direção de interface", "Desenvolvimento responsivo"],
    features: ["Navegação para serviços, casos e parceiros", "Pedido de orçamento pelo WhatsApp"],
    technicalNotes: [
      "No desktop, o menu inclui o pedido de orçamento.",
      "No celular, o menu se recolhe e os botões de serviços e contato aparecem na abertura.",
    ],
    evidenceNote: "As capturas registram as duas versões da página em desktop e celular. A versão da Vercuno está documentada no comparador.",
    images: {
      desktopAfter: "/assets/cases/nautica-after-desktop.webp",
      mobileAfter: "/assets/cases/nautica-after-mobile.webp",
      desktopBefore: "/assets/cases/nautica-before-desktop.webp",
      mobileBefore: "/assets/cases/nautica-before-mobile.webp",
      alt: {
        desktop: "Página da Náutica Engenharia com título sobre a foto de um capacete de obra",
        mobile: "Abertura da página da Náutica Engenharia no celular, com menu compacto e dois botões",
      },
      dimensions: { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } },
      desktopPreviewWidths: nauticaDesktopPreviewWidths,
      caption: {
        desktop: "O menu dá acesso ao pedido de orçamento.",
        mobile: "Os botões de contato e serviços ocupam a largura da tela.",
        comparison: "Apresentação dos serviços e acesso ao orçamento antes e depois, em desktop e celular.",
      },
    },
  },
  {
    slug: "caio-leonardi",
    client: "Caio Leonardi · Psicologia Online",
    sector: "Psicologia clínica",
    projectType: "site-institucional",
    year: 2026,
    liveUrl: "https://caio.srv1113578.stayx.cloud/",
    summary: "Site institucional com informações sobre atendimento psicológico online e agendamento pelo WhatsApp.",
    // TODO: confirmar com Rafael o desafio original do projeto.
    challenge: "Apresentar o profissional e explicar como funciona o atendimento online antes do primeiro contato.",
    scope: ["Identidade visual", "Organização do conteúdo", "Agendamento pelo WhatsApp"],
    features: [
      "Apresentação do profissional e roteiro de atendimento em quatro etapas",
      "Lista expansível de temas atendidos e publicações incorporadas do Instagram",
      "Política de privacidade e orientação para situações de emergência",
    ],
    technicalNotes: [
      "O site usa azul-marinho e títulos em itálico.",
      "Os temas atendidos usam controles nativos de expansão. A incorporação do Instagram usa carregamento adiado.",
      "O HTML inclui descrição da página e URL canônica para busca.",
    ],
    stack: ["HTML", "CSS", "JavaScript"],
    evidenceNote: "O rodapé do site publicado credita a Vercuno. As capturas registram a abertura da página nos dois formatos.",
    images: {
      desktopAfter: "/assets/cases/caio-leonardi-after-desktop.webp",
      mobileAfter: "/assets/cases/caio-leonardi-after-mobile.webp",
      alt: {
        desktop: "Site de Caio Leonardi com fundo azul-marinho, título parcialmente em itálico e retrato do psicólogo",
        mobile: "Abertura do site de Caio Leonardi no celular, com título claro sobre fundo azul-marinho e botão de agendamento",
      },
      dimensions: { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } },
      desktopPreviewWidths: [480, 750],
      caption: {
        desktop: "O retrato acompanha a apresentação e o agendamento.",
        mobile: "O botão de agendamento aparece logo abaixo do título.",
      },
    },
  },
  {
    slug: "suzzy-alves-fotografia",
    client: "Suzzy Alves Fotografia",
    sector: "Fotografia",
    projectType: "site-institucional",
    year: 2026,
    liveUrl: "https://fotografia.srv1113578.stayx.cloud/",
    summary: "Site de estúdio fotográfico em Guarulhos com galeria de ensaios e agendamento pelo WhatsApp.",
    // TODO: confirmar com Rafael o desafio original do projeto.
    challenge: "Reunir os ensaios, as informações do estúdio e o contato para agendar sessões de gestantes, bebês e famílias.",
    scope: ["Identidade visual", "Galeria de ensaios", "Agendamento pelo WhatsApp"],
    features: [
      "Retrato de abertura, seção de ensaios e página de galeria",
      "Local e horários com mapa do OpenStreetMap, link de rota e feed do Instagram",
      "Oferta de 5% de desconto e mensagens de WhatsApp por seção",
    ],
    technicalNotes: [
      "A paleta creme dá destaque às fotografias.",
      "O Astro gera as páginas do site e da galeria, com imagens em tamanhos adaptados à tela.",
      "O mapa e as publicações do Instagram usam carregamento adiado.",
    ],
    stack: ["Astro"],
    evidenceNote: "O rodapé do site publicado credita a Vercuno. As capturas mostram a apresentação da fotógrafa e o acesso ao agendamento.",
    images: {
      desktopAfter: "/assets/cases/suzzy-desktop.webp",
      mobileAfter: "/assets/cases/suzzy-mobile.webp",
      alt: {
        desktop: "Suzzy Alves com uma câmera ao lado do texto de apresentação do estúdio, em fundo creme",
        mobile: "Retrato de Suzzy Alves acima da apresentação do estúdio no celular",
      },
      dimensions: { desktop: { width: 1440, height: 692 }, mobile: { width: 390, height: 619 } },
      desktopPreviewWidths: [480, 750],
      caption: {
        desktop: "O retrato divide espaço com a apresentação e os botões.",
        mobile: "Os links de agendamento e portfólio aparecem logo abaixo da apresentação.",
      },
    },
  },
  {
    slug: "marly-cestas-e-flores",
    client: "Marly Cestas e Flores",
    sector: "Floricultura",
    projectType: "site-catalogo",
    year: 2026,
    liveUrl: "https://marly.srv1113578.stayx.cloud/",
    summary: "Catálogo de buquês, cestas e presentes em Recife, com busca por produto e pedidos pelo WhatsApp.",
    challenge: "Facilitar a escolha de um presente com fotos e preços e levar o cliente direto ao pedido.",
    scope: ["Catálogo de produtos", "Pedidos pelo WhatsApp", "Interface responsiva"],
    features: [
      "Filtros para buquês e flores, cestas e cafés, presentes e itens de Natal",
      "Busca por nome, fotos e preços no catálogo",
      "Atalho para encomendar cada produto pelo WhatsApp e informações de localização",
    ],
    technicalNotes: [
      "A busca e os filtros atualizam a lista na própria página.",
      "Cada item abre o WhatsApp com uma mensagem que identifica o produto.",
    ],
    stack: ["Astro"],
    evidenceNote: "As capturas mostram a abertura do catálogo publicado em computador e celular.",
    images: {
      desktopAfter: "/assets/cases/marly-cestas-e-flores-v2-desktop.webp",
      mobileAfter: "/assets/cases/marly-cestas-e-flores-v2-mobile.webp",
      alt: {
        desktop: "Site da Marly com a logo com laço no cabeçalho e fotos de buquês na abertura",
        mobile: "Site da Marly no celular com a logo com laço acima da apresentação e das fotos de buquês",
      },
      dimensions: { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } },
      desktopPreviewWidths: [480, 750],
      caption: {
        desktop: "As fotos dos buquês acompanham o acesso ao catálogo na abertura.",
        mobile: "O botão Explorar catálogo aparece logo abaixo da apresentação.",
      },
    },
  },
  {
    slug: "zelo",
    client: "Zelo",
    sector: "Atendimento comercial",
    projectType: "sistema-web",
    year: 2026,
    liveUrl: "https://zelo.srv1113578.stayx.cloud/",
    repositoryUrl: "https://github.com/RafaelADSdev/Zelo",
    summary: "Painel de atendimento pelo WhatsApp com catálogo, assistente de IA e revisão de campanhas.",
    challenge: "Reunir as conversas, os materiais e as regras de atendimento em um painel com controle para a equipe.",
    scope: ["Atendimento pelo WhatsApp", "Catálogo para a IA", "Campanhas com revisão"],
    features: [
      "Busca de contatos, histórico de mensagens e resposta manual",
      "Configuração do tom de voz e da prioridade dos modelos de IA",
      "Revisão de destinatários e da mensagem antes de confirmar a campanha",
    ],
    technicalNotes: [
      "As prioridades de modelos para texto e transcrição de áudio são independentes.",
      "O painel pode ser instalado como aplicativo web e usa a mesma autenticação do site.",
    ],
    stack: ["Node.js", "JavaScript", "Supabase", "SQLite"],
    evidenceNote: "As capturas da documentação mostram o painel com contatos e mensagens fictícios.",
    images: {
      desktopAfter: "/assets/cases/zelo-after-desktop.webp",
      mobileAfter: "/assets/cases/zelo-after-mobile.webp",
      alt: {
        desktop: "Painel de conversas do Zelo com lista de contatos e histórico de mensagens",
        mobile: "Conversa aberta no Zelo para celular com mensagens e campo de resposta",
      },
      dimensions: { desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } },
      caption: {
        desktop: "No desktop, a lista de contatos fica ao lado da conversa.",
        mobile: "No celular, a conversa e o campo de resposta ocupam a tela.",
      },
    },
  },
  {
    slug: "prumo",
    client: "Prumo",
    sector: "Gestão financeira",
    projectType: "sistema-web",
    year: 2026,
    liveUrl: "https://prumo.srv1113578.stayx.cloud/",
    repositoryUrl: "https://github.com/RafaelADSdev/prumo",
    summary: "Sistema financeiro para acompanhar recebimentos, pagamentos, serviços e despesas recorrentes.",
    challenge: "Organizar os compromissos financeiros e acompanhar o que entrou, o que saiu e o que ainda está previsto.",
    scope: ["Visão geral do financeiro", "Lançamentos e baixas", "Relatórios por período"],
    features: [
      "Registro de receitas, despesas e baixas parciais",
      "Controle de serviços, despesas fixas e custos de veículos",
      "Relatórios de caixa e competência com exportação CSV",
    ],
    technicalNotes: [
      "O Next.js serve a interface e o Prisma dá suporte a SQLite local ou PostgreSQL no Supabase.",
      "O período selecionado acompanha a navegação entre o painel e os lançamentos.",
    ],
    stack: ["Next.js", "Prisma", "SQLite", "PostgreSQL"],
    evidenceNote: "A imagem publicada no repositório mostra o sistema com registros e valores fictícios de teste.",
    images: {
      desktopAfter: "/assets/cases/prumo-desktop.webp",
      alt: { desktop: "Painel do Prumo com indicadores de recebimentos e pagamentos, gráfico de entradas e saídas e lançamentos recentes" },
      dimensions: { desktop: { width: 1500, height: 1458 } },
      caption: { desktop: "Visão geral do Prumo com dados fictícios de um ambiente de testes." },
    },
  },
];
