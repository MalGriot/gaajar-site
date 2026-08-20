"use client";

import { useEffect } from "react";
import styles from "./page.module.css";
import MagnetBananas from "@/components/MagnetBananas";
import SmashButton from "@/components/SmashButton";

export default function Home() {
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <main className={styles.hero}>
      <MagnetBananas />
      <div className={styles.copy}>
        <SmashButton href="/zines" />
      </div>
    </main>
  );
}
