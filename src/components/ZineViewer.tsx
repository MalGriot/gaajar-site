"use client";

import { useEffect, useRef, useState } from "react";
import type { Book } from "@/data/books";
import ZineInfoPanel from "./ZineInfoPanel";
import infoStyles from "./ZineInfoPanel.module.css";
import styles from "./ZineViewer.module.css";

type Page = { src: string } | { placeholder: true };

const MIN_PLACEHOLDER_PAGES = 4;
const MAX_PLACEHOLDER_PAGES = 8;

function buildPages(book: Book): Page[] {
  if (book.previewImages.length > 0) {
    return book.previewImages.map((src) => ({ src }));
  }
  const count = Math.max(
    MIN_PLACEHOLDER_PAGES,
    Math.min(book.pages ?? MIN_PLACEHOLDER_PAGES + 2, MAX_PLACEHOLDER_PAGES)
  );
  return Array.from({ length: count }, () => ({ placeholder: true }));
}

type DragState = { index: number; mode: "next" | "prev"; startX: number; progress: number } | null;

export default function ZineViewer({ book, onBack }: { book: Book; onBack: () => void }) {
  const [pages] = useState(() => buildPages(book));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [entered, setEntered] = useState(false);
  const [drag, setDrag] = useState<DragState>(null);
  const dragRef = useRef<DragState>(null);
  const bookAreaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    backBtnRef.current?.focus();
  }, []);

  const atStart = currentIndex === 0;
  const atEnd = currentIndex === pages.length - 1;

  function next() {
    setCurrentIndex((i) => Math.min(i + 1, pages.length - 1));
  }
  function prev() {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Tab") {
        const nodes = frameRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (!nodes || nodes.length === 0) return;
        const list = Array.from(nodes);
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages.length]);

  function startDrag(index: number, mode: "next" | "prev", clientX: number, pointerId: number, target: Element) {
    const state: DragState = { index, mode, startX: clientX, progress: 0 };
    dragRef.current = state;
    setDrag(state);
    (target as HTMLElement).setPointerCapture(pointerId);
  }

  function moveDrag(clientX: number) {
    const state = dragRef.current;
    if (!state) return;
    const width = bookAreaRef.current?.getBoundingClientRect().width ?? 1;
    const deltaX = clientX - state.startX;
    const raw = state.mode === "next" ? -deltaX : deltaX;
    const progress = Math.max(0, Math.min(1, raw / (width * 0.6)));
    const updated: DragState = { ...state, progress };
    dragRef.current = updated;
    setDrag(updated);
  }

  function endDrag() {
    const state = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!state) return;
    if (state.progress > 0.35) {
      if (state.mode === "next") next();
      else prev();
    }
  }

  function rotationFor(i: number) {
    if (drag && drag.index === i) {
      return drag.mode === "next" ? -180 * drag.progress : -180 + 180 * drag.progress;
    }
    return i < currentIndex ? -180 : 0;
  }

  const hasRealPages = book.previewImages.length > 0;

  return (
    <div className={`${styles.viewerWrap} ${entered ? styles.entered : ""}`}>
      <div className={styles.frame} ref={frameRef}>
        <button
          ref={backBtnRef}
          className={`${infoStyles.btn} ${infoStyles.ghost} ${styles.backBtn}`}
          onClick={onBack}
          aria-label="Back to book details"
        >
          &larr; Back
        </button>

        <div className={styles.content}>
          <div className={styles.bookColumn}>
            <div className={styles.bookArea} ref={bookAreaRef}>
              {!atStart && (
                <div
                  className={styles.edgeZonePrev}
                  onPointerDown={(e) =>
                    startDrag(currentIndex - 1, "prev", e.clientX, e.pointerId, e.currentTarget)
                  }
                  onPointerMove={(e) =>
                    dragRef.current?.mode === "prev" && moveDrag(e.clientX)
                  }
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  aria-hidden="true"
                />
              )}

              <div className={styles.book}>
                {pages.map((page, i) => {
                  const isDraggingThis = drag?.index === i;
                  return (
                    <div
                      key={i}
                      className={styles.page}
                      style={{
                        zIndex: i < currentIndex ? i : pages.length - i,
                        transform: `rotateY(${rotationFor(i)}deg)`,
                        transition: isDraggingThis ? "none" : undefined,
                        pointerEvents: i === currentIndex ? "auto" : "none",
                      }}
                      onPointerDown={(e) =>
                        i === currentIndex &&
                        !atEnd &&
                        startDrag(i, "next", e.clientX, e.pointerId, e.currentTarget)
                      }
                      onPointerMove={(e) =>
                        dragRef.current?.mode === "next" &&
                        dragRef.current.index === i &&
                        moveDrag(e.clientX)
                      }
                      onPointerUp={endDrag}
                      onPointerCancel={endDrag}
                    >
                      <div className={styles.pageFace}>
                        {"src" in page ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={page.src} alt={`${book.title} — page ${i + 1}`} className={styles.pageImg} />
                        ) : (
                          <div className={styles.placeholder}>
                            <span className={styles.placeholderStamp + " mono"}>scan pending</span>
                            <span className={styles.placeholderText + " mono"}>pages coming soon</span>
                          </div>
                        )}
                        <span className={styles.pageNum + " mono"}>{i + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className={`${styles.navBtn} ${styles.navPrev}`}
                onClick={prev}
                disabled={atStart}
                aria-label="Previous page"
              >
                &#8249;
              </button>
              <button
                className={`${styles.navBtn} ${styles.navNext}`}
                onClick={next}
                disabled={atEnd}
                aria-label="Next page"
              >
                &#8250;
              </button>
            </div>

            <div className={styles.pageIndicator + " mono"}>
              {currentIndex + 1} / {pages.length}
            </div>
          </div>

          <ZineInfoPanel
            book={book}
            actions={
              <a className={infoStyles.btn} href={book.purchaseUrl} target="_blank" rel="noopener noreferrer">
                Buy this zine &#8599;
              </a>
            }
            note={
              !hasRealPages
                ? "Interior scans aren’t in yet — this preview shows the mechanism, not the real pages."
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
