import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import styles from "./portfolio.module.css";

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header section="portfolio" />
      <div className={styles.shell}>{children}</div>
      <SiteFooter />
    </>
  );
}
