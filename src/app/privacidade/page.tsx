import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Como a ${siteConfig.name} trata dados de contato e de navegação.`,
  alternates: { canonical: "/privacidade" },
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link className="legal-back" href="/" prefetch={false}>
        <ArrowLeft size={17} aria-hidden="true" /> Voltar para o site
      </Link>
      <article>
        <p className="section-label">Documento legal</p>
        <h1>Política de Privacidade</h1>
        <p className="legal-updated">Última atualização: 24 de novembro de 2026.</p>

        <h2>Quais dados coletamos</h2>
        <p>
          O formulário pode coletar nome, e-mail, empresa, telefone, tipo de serviço e a mensagem enviada por
          você. A empresa e o telefone são opcionais.
        </p>

        <h2>Por que usamos esses dados</h2>
        <p>
          Usamos essas informações exclusivamente para analisar a solicitação, responder ao contato e conduzir
          uma possível conversa comercial relacionada ao projeto descrito.
        </p>

        <h2>Medição de visitas</h2>
        <p>
          Usamos o StayView, da StayCloud, para entender como o site é usado. A ferramenta mede as páginas
          visitadas, a origem dos acessos e informações técnicas, como idioma e tamanho da tela. Quando
          gravações e mapas de calor estão ativos, a ferramenta também registra a navegação, os cliques e a
          rolagem na página. O StayView mascara os valores digitados nos campos de formulário.
        </p>
        <p><a href="/privacidade?sv_optout=true">Desativar a medição neste navegador</a></p>

        <h2>Armazenamento e acesso</h2>
        <p>
          Quando a integração estiver ativa, os dados serão armazenados em infraestrutura Supabase com acesso
          restrito à equipe autorizada da {siteConfig.name}. Os registros não ficam disponíveis publicamente pelo site.
        </p>

        <h2>Compartilhamento e retenção</h2>
        <p>
          Não vendemos os dados enviados. Informações podem ser processadas por fornecedores técnicos
          necessários à operação do site. O prazo de retenção e o canal formal para solicitações serão revisados
          antes da publicação oficial.
        </p>

        <h2>Seus direitos</h2>
        <p>
          Você poderá solicitar acesso, correção ou exclusão dos dados pelo e-mail{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </article>
    </main>
  );
}
