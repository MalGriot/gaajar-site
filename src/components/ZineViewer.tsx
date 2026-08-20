"use client";

import { useEffect, useRef, useState } from "react";
import type { Book } from "@/data/books";
import ZineInfoPanel from "./ZineInfoPanel";
import { PushButton } from "./PushButton";
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

function PageContent({ book, page, index }: { book: Book; page: Page; index: number }) {
  return (
    <>
      {"src" in page ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={page.src} alt={`${book.title} — page ${index + 1}`} className={styles.pageImg} />
      ) : (
        <div className={styles.placeholder}>
          <span className={styles.placeholderStamp + " mono"}>scan pending</span>
          <span className={styles.placeholderText + " mono"}>pages coming soon</span>
        </div>
      )}
      <span className={styles.pageNum + " mono"}>{index + 1}</span>
    </>
  );
}

// Live finger-drag progress (0→1), rendered via inline transform each pointermove.
type DragState = { index: number; mode: "next" | "prev"; startX: number; progress: number } | null;
// A button/key-triggered turn, played by a CSS @keyframes animation rather than
// JS — requestAnimationFrame silently stalls on a backgrounded tab and can wedge
// navigation, but a CSS animation keeps its own timeline and still resolves
// (instantly, via the site's reduced-motion rule) once the tab is foregrounded.
type TurningState = { index: number; mode: "next" | "prev" } | null;

export default function ZineViewer({ book, onBack }: { book: Book; onBack: () => void }) {
  const [pages] = useState(() => buildPages(book));
  const [rightIndex, setRightIndex] = useState(() => Math.min(1, pages.length - 1));
  const [entered, setEntered] = useState(false);
  const [drag, setDrag] = useState<DragState>(null);
  const [turning, setTurning] = useState<TurningState>(null);
  const dragRef = useRef<DragState>(null);
  const turningRef = useRef<TurningState>(null);
  const bookAreaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);

  const leftIndex = rightIndex - 1;
  const minRight = Math.min(1, pages.length - 1);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    backBtnRef.current?.focus();
  }, []);

  const atStart = rightIndex <= minRight;
  const atEnd = rightIndex >= pages.length - 1;

  function next() {
    if (dragRef.current || turningRef.current || atEnd) return;
    const state: TurningState = { index: rightIndex, mode: "next" };
    turningRef.current = state;
    setTurning(state);
  }
  function prev() {
    if (dragRef.current || turningRef.current || atStart) return;
    const state: TurningState = { index: leftIndex, mode: "prev" };
    turningRef.current = state;
    setTurning(state);
  }

  function handleTurnAnimEnd(i: number) {
    if (!turningRef.current || turningRef.current.index !== i) return;
    const mode = turningRef.current.mode;
    turningRef.current = null;
    setTurning(null);
    setRightIndex((r) => (mode === "next" ? Math.min(r + 1, pages.length - 1) : Math.max(r - 1, minRight)));
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
  }, [pages.length, rightIndex]);

  function startDrag(index: number, mode: "next" | "prev", clientX: number, pointerId: number, target: Element) {
    if (turningRef.current) return;
    const state: DragState = { index, mode, startX: clientX, progress: 0 };
    dragRef.current = state;
    setDrag(state);
    (target as HTMLElement).setPointerCapture(pointerId);
  }

  function moveDrag(clientX: number) {
    const state = dragRef.current;
    if (!state) return;
    const halfWidth = (bookAreaRef.current?.getBoundingClientRect().width ?? 2) / 2;
    const deltaX = clientX - state.startX;
    const raw = state.mode === "next" ? -deltaX : deltaX;
    const progress = Math.max(0, Math.min(1, raw / (halfWidth * 0.7)));
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

        <div className={styles.bookArea} ref={bookAreaRef}>
          <div className={styles.book}>
            {pages.map((page, i) => {
              const isDraggingThis = drag?.index === i;
              const isTurningThis = turning?.index === i;
              const isInteractive = (i === rightIndex && !atEnd) || (i === leftIndex && !atStart);

              let transform: string;
              let foldOpacity: number | undefined;
              if (isDraggingThis && drag) {
                const rotation = drag.mode === "next" ? -180 * drag.progress : -180 + 180 * drag.progress;
                const fold = Math.sin(drag.progress * Math.PI);
                transform = `rotateY(${rotation}deg) scaleX(${1 - 0.06 * fold})`;
                foldOpacity = fold * 0.6;
              } else {
                transform = `rotateY(${i < rightIndex ? -180 : 0}deg) scaleX(1)`;
              }

              const turnClass = isTurningThis
                ? turning?.mode === "next"
                  ? styles.turningNext
                  : styles.turningPrev
                : "";

              return (
                <div
                  key={i}
                  className={`${styles.page} ${turnClass}`}
                  style={{
                    zIndex: i < rightIndex ? i : pages.length - i,
                    transform: isTurningThis ? undefined : transform,
                    transition: isDraggingThis ? "none" : undefined,
                    pointerEvents: isInteractive ? "auto" : "none",
                  }}
                  onPointerDown={(e) => {
                    if (i === rightIndex) startDrag(i, "next", e.clientX, e.pointerId, e.currentTarget);
                    else if (i === leftIndex) startDrag(i, "prev", e.clientX, e.pointerId, e.currentTarget);
                  }}
                  onPointerMove={(e) => {
                    if (dragRef.current?.index === i) moveDrag(e.clientX);
                  }}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onAnimationEnd={() => handleTurnAnimEnd(i)}
                >
                  <div className={styles.pageFace}>
                    <PageContent book={book} page={page} index={i} />
                  </div>
                  <div className={styles.pageFaceBack}>
                    <PageContent book={book} page={page} index={i} />
                  </div>
                  <div className={styles.pageFold} style={foldOpacity !== undefined ? { opacity: foldOpacity } : undefined} />
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
          {leftIndex >= 0 ? `${leftIndex + 1}–${rightIndex + 1}` : `${rightIndex + 1}`} / {pages.length}
        </div>

        <ZineInfoPanel
          book={book}
          showDescription={false}
          actions={
            <PushButton as="a" href={book.purchaseUrl} target="_blank" rel="noopener noreferrer">
              Buy this zine &#8599;
            </PushButton>
          }
        />
      </div>
    </div>
  );
}
