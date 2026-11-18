import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";

export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link className="brand footer-brand" href={home ? "#top" : "/"} prefetch={false} aria-label={`${siteConfig.name}, início`}>
          <Image {...siteConfig.logo} alt="" />
        </Link>
        <p>Design e desenvolvimento de sites e sistemas web.</p>
        <a className="arrow-link" href={home ? "#top" : "#conteudo"}>Voltar ao topo <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.name} · Brasil</span>
        <nav className="footer-links" aria-label="Navegação do rodapé">
          <Link href="/portfolio" prefetch={false}>Portfólio</Link>
          <Link href="/privacidade" prefetch={false}>Política de Privacidade</Link>
        </nav>
      </div>
    </footer>
  );
}
