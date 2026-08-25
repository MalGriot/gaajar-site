"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Book } from "@/data/books";
import ZineInfoPanel from "./ZineInfoPanel";
import ZineViewer from "./ZineViewer";
import { PushButton } from "./PushButton";
import infoStyles from "./ZineInfoPanel.module.css";
import styles from "./ZineSelection.module.css";

export default function ZineSelection({
  book,
  onClose,
}: {
  book: Book | null;
  onClose: () => void;
}) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const closeXRef = useRef<HTMLButtonElement>(null);
  const closeBackRef = useRef<HTMLButtonElement>(null);

  // Reset to the card state whenever the selected book changes (including close) —
  // adjusted during render per React's guidance, rather than in an effect.
  const [prevBook, setPrevBook] = useState(book);
  if (book !== prevBook) {
    setPrevBook(book);
    setViewerOpen(false);
  }

  // Single path back to the card state, however it's triggered (Back button,
  // Escape, or clicking outside the open book) — all three need the same
  // focus restoration onto "Open Zine", not just the explicit Back button.
  function closeViewer() {
    setViewerOpen(false);
    openBtnRef.current?.focus();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (viewerOpen) closeViewer();
      else onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, viewerOpen]);

  // Only on a fresh selection — not on every viewerOpen toggle, which would
  // clobber onBack's explicit refocus onto the "Open Zine" button. Focus
  // whichever close control is actually visible for the current viewport —
  // the mobile "← Back" button and the desktop "×" swap via CSS, not React.
  useEffect(() => {
    if (!book) return;
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    (isMobile ? closeBackRef : closeXRef).current?.focus();
  }, [book]);

  const show = Boolean(book);
  // No real interior scans exist for this book (only the placeholder spread
  // ZineViewer falls back to) — offering a page-turn preview with nothing
  // real to show is worse than not offering one, so skip straight to Buy.
  const hasPreview = Boolean(book && book.previewImages.length > 0);

  return (
    <div
      className={`${styles.overlay} ${show ? styles.show : ""}`}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        if (viewerOpen) closeViewer();
        else onClose();
      }}
      aria-hidden={!show}
    >
      {book && (
        <div className={styles.stage}>
          <div className={`${styles.card} ${viewerOpen ? styles.cardHidden : ""}`}>
            <button ref={closeXRef} className={styles.closeX} onClick={onClose} aria-label="Close">
              &times;
            </button>
            <button
              ref={closeBackRef}
              className={`${infoStyles.btn} ${infoStyles.ghost} ${styles.backBtn}`}
              onClick={onClose}
              aria-label="Close"
            >
              &larr; Back
            </button>
            <Image
              src={book.cover}
              alt={`${book.title} cover`}
              width={book.coverW}
              height={book.coverH}
              className={styles.img}
            />
            <ZineInfoPanel
              book={book}
              actions={
                <>
                  {hasPreview && (
                    <PushButton ref={openBtnRef} onClick={() => setViewerOpen(true)}>
                      Open Zine &rarr;
                    </PushButton>
                  )}
                  <a
                    className={`${infoStyles.btn} ${infoStyles.ghost}`}
                    href={book.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy on shop &#8599;
                  </a>
                </>
              }
            />
          </div>

          {viewerOpen && <ZineViewer book={book} onBack={closeViewer} />}
        </div>
      )}
    </div>
  );
}
