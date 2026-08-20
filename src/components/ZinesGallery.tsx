"use client";

import { useState } from "react";
import type { Book } from "@/data/books";
import DriftWall from "./DriftWall";
import OrbitWall from "./OrbitWall";
import ZineSelection from "./ZineSelection";
import styles from "./ZinesGallery.module.css";

export default function ZinesGallery({ books }: { books: Book[] }) {
  const [selected, setSelected] = useState<Book | null>(null);

  return (
    <>
      <div className={styles.desktopOnly}>
        <OrbitWall books={books} onSelect={setSelected} />
      </div>
      <div className={styles.mobileOnly}>
        <DriftWall books={books} onSelect={setSelected} />
      </div>
      <ZineSelection book={selected} onClose={() => setSelected(null)} />
    </>
  );
}
