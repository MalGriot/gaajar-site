"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./useTheme";
import styles from "./Nav.module.css";

const ICONS: Record<string, React.ReactNode> = {
  about: (
    <svg width="24" height="24" viewBox="0 0 26 26" fill="none" strokeWidth="1.6">
      <path d="M2 13c4-6 18-6 22 0-4 6-18 6-22 0Z" />
      <circle cx="13" cy="13" r="3" />
    </svg>
  ),
  zines: (
    <svg width="24" height="24" viewBox="0 0 26 26" fill="none" strokeWidth="1.6">
      <path d="M5 4h9v18H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M14 4h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
    </svg>
  ),
  contact: (
    <svg width="24" height="24" viewBox="0 0 26 26" fill="none" strokeWidth="1.6">
      <rect x="3" y="6" width="20" height="14" rx="1.5" />
      <path d="M3 7l10 8 10-8" />
    </svg>
  ),
};

const LINKS = [
  { href: "/zines", label: "Zines", key: "zines" },
  { href: "/about", label: "About", key: "about" },
  { href: "/contact", label: "Contact", key: "contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const { isDark, toggle } = useTheme();
  if (pathname === "/") return null;

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link href="/" className={styles.wordmark}>
          gaajar
        </Link>
        <span className={styles.mobileToggleWrap}>
          <ThemeToggle isDark={isDark} onToggle={toggle} />
        </span>
      </div>
      <nav className={styles.nav} aria-label="Primary">
        <ThemeToggle isDark={isDark} onToggle={toggle} className={styles.desktopToggle} />
        {LINKS.map((l) => (
          <Link key={l.key} href={l.href} className={styles.navItem}>
            <span className={styles.txt}>{l.label}</span>
            <span className={styles.icon} aria-hidden="true">
              {ICONS[l.key]}
            </span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
