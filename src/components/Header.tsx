"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { siteConfig, whatsappHref } from "@/data/site";

export function Header({ section = "home" }: { section?: "home" | "portfolio" }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (section !== "home") return;
    const sections = [...siteConfig.nav.map((item) => item.href), "#portfolio"]
      .filter((href) => href.startsWith("#"))
      .map((href) => document.getElementById(href.slice(1)))
      .filter((section): section is HTMLElement => section !== null);
    let frame = 0;
    const updateSection = () => {
      const readingLine = Math.max(100, window.innerHeight * 0.35);
      const current = sections.reduce<HTMLElement | null>((selected, candidate) => {
        const top = candidate.getBoundingClientRect().top;
        return top <= readingLine && (!selected || top > selected.getBoundingClientRect().top) ? candidate : selected;
      }, null);
      setActiveSection(current ? `#${current.id}` : "");
    };
    const scheduleSection = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateSection();
      });
    };
    updateSection();
    window.addEventListener("scroll", scheduleSection, { passive: true });
    window.addEventListener("resize", scheduleSection, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleSection);
      window.removeEventListener("resize", scheduleSection);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [section]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };
    const desktop = window.matchMedia("(min-width: 1101px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    const closeOutsideMenu = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!menuPanel.current?.contains(target) && !menuButton.current?.contains(target)) {
        setOpen(false);
      }
    };
    closeOnDesktop();
    document.addEventListener("pointerdown", closeOutsideMenu);
    document.addEventListener("focusin", closeOutsideMenu);
    window.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOutsideMenu);
      document.removeEventListener("focusin", closeOutsideMenu);
      window.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  const isHome = section === "home";
  const contactPath = isHome ? "#contato" : "/#contato";
  const navHref = (href: string) => !isHome && href.startsWith("#") ? `/${href}` : href;
  const navCurrent = (href: string) => {
    if (href === "/portfolio") {
      return section === "portfolio" ? "page" : activeSection === "#portfolio" ? "location" : undefined;
    }
    return isHome && activeSection === href ? "location" : undefined;
  };

  return (
    <header className="site-header">
      <Link className="brand" href={isHome ? "#top" : "/"} prefetch={false} aria-label={`${siteConfig.name}, início`}>
        <img {...siteConfig.logo} alt="" />
      </Link>

      <nav className="desktop-nav" aria-label="Navegação principal">
        {siteConfig.nav.map((item) => (
          <Link key={item.href} href={navHref(item.href)} prefetch={false} aria-current={navCurrent(item.href)}>
            {item.label}
          </Link>
        ))}
      </nav>

      <a className="header-cta" href={whatsappHref ?? contactPath} target={whatsappHref ? "_blank" : undefined}
        rel={whatsappHref ? "noreferrer" : undefined}>
        {whatsappHref ? "Falar no WhatsApp" : "Falar com a equipe"} <ArrowUpRight size={16} aria-hidden="true" />
      </a>

      <button
        ref={menuButton}
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <div
        ref={menuPanel}
        className={`mobile-menu ${open ? "is-open" : ""}`}
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Navegação móvel">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={navHref(item.href)}
              prefetch={false}
              aria-current={navCurrent(item.href)}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              {item.label}
            </Link>
          ))}
          <a className="mobile-contact" href={whatsappHref ?? contactPath} onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1} target={whatsappHref ? "_blank" : undefined} rel={whatsappHref ? "noreferrer" : undefined}>
            {whatsappHref ? "Falar no WhatsApp" : "Falar com a equipe"} <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
