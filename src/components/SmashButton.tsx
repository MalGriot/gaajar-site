"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./SmashButton.module.css";

const LABELS = ["Press me!", "Press me harder!", "Oh yeah baby!"];
const SHIVER_CLASS = ["", styles.shiver1, styles.shiver2];

export default function SmashButton({ href }: { href: string }) {
  const router = useRouter();
  const [count, setCount] = useState(0);

  function handlePress() {
    if (count >= 2) {
      router.push(href);
      return;
    }
    setCount((c) => c + 1);
  }

  return (
    <button
      key={count}
      type="button"
      onClick={handlePress}
      className={`${styles.cta} ${SHIVER_CLASS[count]}`}
    >
      {LABELS[count]}
    </button>
  );
}
