"use client";

import Image from "next/image";
import type { Book } from "@/data/books";
import styles from "./DriftWall.module.css";

// Each sparkle starts at a point on the book's edge (px/py, as a %
// of the cover) and flies outward along (x, y), away from that edge.
const SPARKLES = [
  { px: "50%", py: "0%", x: 0, y: -38, delay: "0s" },
  { px: "92%", py: "8%", x: 34, y: -26, delay: "0.08s" },
  { px: "100%", py: "42%", x: 42, y: 4, delay: "0.16s" },
  { px: "88%", py: "96%", x: 30, y: 34, delay: "0.24s" },
  { px: "42%", py: "100%", x: -8, y: 40, delay: "0.05s" },
  { px: "6%", py: "88%", x: -34, y: 28, delay: "0.2s" },
  { px: "0%", py: "50%", x: -42, y: 2, delay: "0.12s" },
  { px: "10%", py: "4%", x: -26, y: -30, delay: "0.28s" },
];

export default function DriftWall({
  books,
  onSelect,
}: {
  books: Book[];
  onSelect: (book: Book) => void;
}) {
  return (
    <div className={styles.grid}>
      {books.map((book, i) => {
        const rot = (i % 2 === 0 ? -1 : 1) * (3 + (i % 3) * 2);
        const float = (i % 2 === 0 ? -1 : 1) * (5 + (i % 4) * 2);
        return (
          <button
            key={book.slug}
            type="button"
            className={styles.cover}
            style={
              {
                "--rot": `${rot}deg`,
                "--float": `${float}px`,
                "--dly": `${i * 0.45}s`,
              } as React.CSSProperties
            }
            onClick={() => onSelect(book)}
          >
            <Image
              src={book.cover}
              alt={`${book.title} cover`}
              width={book.coverW}
              height={book.coverH}
              className={styles.img}
              sizes="(max-width: 640px) 45vw, 220px"
            />
            {book.bestseller && <span className={styles.badge}>bestseller</span>}
            <span className={styles.ttl}>{book.title}</span>
            <span className={styles.sparkles} aria-hidden="true">
              {SPARKLES.map((s, si) => (
                <span
                  key={si}
                  className={styles.sparkle}
                  style={
                    {
                      "--px": s.px,
                      "--py": s.py,
                      "--sx": `${s.x}px`,
                      "--sy": `${s.y}px`,
                      "--sdelay": s.delay,
                    } as React.CSSProperties
                  }
                />
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}
