import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { SiteRouteTheme } from "./site-route-theme";
import styles from "./legal-site-shell.module.css";

import "./legal-site-theme.css";

export type LegalSiteConfig = {
  id: string;
  basePath: `/${string}`;
  name: string;
  logoSrc: string;
  scopeClassName: string;
  routeProgressColor: string;
  copyrightName: string;
};

const navigation = [
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

function route(config: LegalSiteConfig, href: string) {
  return `${config.basePath}${href}`;
}

export function getLegalSiteIcons(config: LegalSiteConfig) {
  const favicon = `${config.basePath}/favicon.png`;
  return {
    icon: [{ url: favicon, type: "image/png" }],
    shortcut: favicon,
    apple: [{ url: favicon, type: "image/png" }],
  };
}

function Brand({
  config,
  footer = false,
}: {
  config: LegalSiteConfig;
  footer?: boolean;
}) {
  const size = footer ? 38 : 44;
  return (
    <Link
      className={footer ? styles.footerBrand : styles.brand}
      href={route(config, "/support")}
      aria-label={`${config.name} support`}
    >
      <span className={styles.brandMark}>
        <Image
          src={config.logoSrc}
          alt=""
          width={size}
          height={size}
          priority={!footer}
        />
      </span>
      <span>{config.name}</span>
    </Link>
  );
}

export function LegalSiteShell({
  config,
  children,
}: {
  config: LegalSiteConfig;
  children: ReactNode;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`${styles.page} legal-site ${config.scopeClassName}`}>
      <SiteRouteTheme progressColor={config.routeProgressColor} />
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Brand config={config} />
          <nav
            className={styles.navigation}
            aria-label="Legal and support navigation"
          >
            {navigation.map((item) => (
              <Link href={route(config, item.href)} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Brand config={config} footer />
          <nav
            className={styles.footerNavigation}
            aria-label="Legal and support"
          >
            {navigation.map((item) => (
              <Link href={route(config, item.href)} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <small>
            © {currentYear} {config.copyrightName} — All rights reserved
          </small>
        </div>
      </footer>
    </div>
  );
}
