"use client";

import type { ReactNode } from "react";
import type { Book } from "@/data/books";
import styles from "./ZineInfoPanel.module.css";

export default function ZineInfoPanel({
  book,
  actions,
  showDescription = true,
}: {
  book: Book;
  actions: ReactNode;
  showDescription?: boolean;
}) {
  return (
    <div className={styles.info}>
      <span className={styles.kicker + " mono"}>
        gaajar &middot; {book.format ?? "zine"}
        {book.award ? ` · ${book.award}` : ""}
      </span>
      <h2>{book.title}</h2>
      {showDescription && <p className={styles.desc}>{book.description}</p>}
      <dl className={styles.specs}>
        {book.pages && (
          <div>
            <dt>Pages</dt>
            <dd>{book.pages}</dd>
          </div>
        )}
        <div>
          <dt>Price</dt>
          <dd>&#8377;{book.price}</dd>
        </div>
      </dl>
      <div className={styles.ctaRow}>{actions}</div>
    </div>
  );
}
