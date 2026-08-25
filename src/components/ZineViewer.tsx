"use client";

import { useEffect, useRef, useState } from "react";
import type { PageFlip } from "page-flip";
import type { Book } from "@/data/books";
import ZineInfoPanel from "./ZineInfoPanel";
import { PushButton } from "./PushButton";
import infoStyles from "./ZineInfoPanel.module.css";
import styles from "./ZineViewer.module.css";

const MIN_PLACEHOLDER_PAGES = 4;
const MAX_PLACEHOLDER_PAGES = 8;

// The flip's page size is scaled off each book's cover pixel dimensions,
// which are themselves proportional to the zine's real print trim size
// (every cover was extracted at one uniform DPI from the source PDFs, then
// rotated/cropped by the same rule) — so a "chiclet size" zine like This
// Should've Been a Tweet visibly opens smaller than "novel size" Lonely
// Blue Dot, rather than every book filling the same fixed frame.
const MAX_PAGE_H = 560;
const MIN_PAGE_H = 260;
const TALLEST_COVER_H = 1400; // lonely-blue-dot's coverH — the largest physical trim among the zines

function pageDims(book: Book) {
  const scale = MAX_PAGE_H / TALLEST_COVER_H;
  const rawH = book.coverH * scale;
  const h = Math.max(MIN_PAGE_H, Math.min(MAX_PAGE_H, rawH));
  const w = h * (book.coverW / book.coverH);
  return { w: Math.round(w), h: Math.round(h) };
}

function placeholderPage(index: number, w: number, h: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="${w}" height="${h}" fill="#e8e0ce" />
    <defs>
      <pattern id="hatch" width="14" height="14" patternTransform="rotate(135)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="14" stroke="rgba(28,26,21,0.18)" stroke-width="1" />
      </pattern>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#hatch)" />
    <g transform="translate(${w / 2}, ${h / 2 - 16}) rotate(-6)">
      <rect x="-56" y="-14" width="112" height="27" fill="none" stroke="#c74e28" stroke-width="1.6" stroke-dasharray="4 3" />
      <text x="0" y="5" text-anchor="middle" font-family="monospace" font-size="10.5" letter-spacing="1.5" fill="#c74e28">SCAN PENDING</text>
    </g>
    <text x="${w / 2}" y="${h / 2 + 24}" text-anchor="middle" font-family="monospace" font-size="11" fill="#4a463c">page ${index + 1} coming soon</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function buildPages(book: Book, w: number, h: number): string[] {
  if (book.previewImages.length > 0) return book.previewImages;
  const count = Math.max(
    MIN_PLACEHOLDER_PAGES,
    Math.min(book.pages ?? MIN_PLACEHOLDER_PAGES + 2, MAX_PLACEHOLDER_PAGES)
  );
  return Array.from({ length: count }, (_, i) => placeholderPage(i, w, h));
}

export default function ZineViewer({ book, onBack }: { book: Book; onBack: () => void }) {
  const [entered, setEntered] = useState(false);
  const [pageInfo, setPageInfo] = useState({ current: 0, count: 0 });
  const flipMountRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const isSample = book.previewImages.length > 0;
  const { w, h } = pageDims(book);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    backBtnRef.current?.focus();
  }, []);

  // Real physical page-turn (StPageFlip / page-flip.js) — same engine and
  // config shape as the flipbook on the Mal Griot poetry page. Pages that
  // have been turned stack correctly behind the spine instead of sliding
  // across, and the whole thing stays draggable/responsive for free.
  useEffect(() => {
    const el = flipMountRef.current;
    if (!el) return;
    let disposed = false;

    (async () => {
      const { PageFlip } = await import("page-flip");
      if (disposed || !el) return;

      const pageFlip = new PageFlip(el, {
        width: w,
        height: h,
        size: "stretch",
        minWidth: Math.round(w * 0.5),
        maxWidth: w,
        minHeight: Math.round(h * 0.5),
        maxHeight: h,
        maxShadowOpacity: 0.4,
        showCover: false,
        usePortrait: true,
        mobileScrollSupport: false,
        drawShadow: true,
      });

      pageFlip.loadFromImages(buildPages(book, w, h));
      flipRef.current = pageFlip;

      function sync() {
        setPageInfo({ current: pageFlip.getCurrentPageIndex(), count: pageFlip.getPageCount() });
      }
      pageFlip.on("flip", sync);
      pageFlip.on("init", sync);
    })();

    return () => {
      disposed = true;
      flipRef.current?.destroy();
      flipRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.slug]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") flipRef.current?.turnToNextPage();
      else if (e.key === "ArrowLeft") flipRef.current?.turnToPrevPage();
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
  }, []);

  const atStart = pageInfo.current <= 0;
  const atEnd = pageInfo.count > 0 && pageInfo.current >= pageInfo.count - 1;

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

        <div className={styles.bookArea}>
          <button
            className={`${styles.navBtn} ${styles.navPrev}`}
            onClick={() => flipRef.current?.turnToPrevPage()}
            disabled={atStart}
            aria-label="Previous page"
          >
            &#8249;
          </button>

          <div className={styles.flipMount} ref={flipMountRef} style={{ maxWidth: w * 2 }} />

          <button
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={() => flipRef.current?.turnToNextPage()}
            disabled={atEnd}
            aria-label="Next page"
          >
            &#8250;
          </button>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.pageIndicator + " mono"}>
            {pageInfo.count > 0 ? `${pageInfo.current + 1} / ${pageInfo.count}` : ""}
          </span>
          {isSample && (
            <span className={styles.sampleNote}>
              random sample pages &mdash; not shown in reading order
            </span>
          )}
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
