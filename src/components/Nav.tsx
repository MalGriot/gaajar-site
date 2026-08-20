"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  events: (
    <svg width="24" height="24" viewBox="0 0 26 26" fill="none" strokeWidth="1.6">
      <path d="M13 3 15.5 9.5 22 10l-5 4.6L18.5 21 13 17.5 7.5 21 9 14.6 4 10l6.5-.5Z" />
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
  { href: "/about", label: "About", key: "about" },
  { href: "/zines", label: "Zines", key: "zines" },
  { href: "/events", label: "Events", key: "events" },
  { href: "/contact", label: "Contact", key: "contact" },
];

export default function Nav() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.wordmark}>
        gaajar
      </Link>
      <nav className={styles.nav} aria-label="Primary">
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
