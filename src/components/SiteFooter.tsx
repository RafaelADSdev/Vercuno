import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";
import { MotionToggle } from "./MotionToggle";
import { ScrollLink } from "./ScrollLink";

export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link className="brand footer-brand" href={home ? "#top" : "/"} prefetch={false} aria-label={`${siteConfig.name}, início`}>
          <img {...siteConfig.logo} alt="" loading="lazy" />
        </Link>
        <p>Design e desenvolvimento de sites e sistemas web.</p>
        <ScrollLink className="arrow-link" href={home ? "#top" : "#conteudo"} focusId="conteudo">
          Voltar ao topo <ArrowUpRight size={15} aria-hidden="true" />
        </ScrollLink>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.name} · Brasil</span>
        <nav className="footer-links" aria-label="Navegação do rodapé">
          <MotionToggle />
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <Link href="/portfolio" prefetch={false}>Portfólio</Link>
          <Link href="/privacidade" prefetch={false}>Política de Privacidade</Link>
        </nav>
      </div>
    </footer>
  );
}
