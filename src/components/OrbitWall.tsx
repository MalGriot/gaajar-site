"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Book } from "@/data/books";
import styles from "./OrbitWall.module.css";

const RADIUS_X = 560;
const RADIUS_Z = 380;

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

export default function OrbitWall({
  books,
  onSelect,
}: {
  books: Book[];
  onSelect: (book: Book) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const angleOffset = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let dragging = false;
    let stageHovering = false;
    let itemHovering = false;
    let dragStartX = 0;
    let dragStartAngle = 0;
    let dragDelta = 0;
    let autoRotate: ReturnType<typeof setInterval> | undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function layout() {
      const n = books.length;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const angle = (i / n) * Math.PI * 2 + angleOffset.current;
        const x = Math.sin(angle) * RADIUS_X;
        const z = Math.cos(angle) * RADIUS_Z;
        const scale = 0.62 + 0.42 * ((z + RADIUS_Z) / (2 * RADIUS_Z));
        el.style.transform = `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        el.style.zIndex = String(Math.round(z + RADIUS_Z));
      });
    }
    layout();

    function startAuto() {
      if (reduceMotion) return;
      stopAuto();
      autoRotate = setInterval(() => {
        if (!dragging && !itemHovering) {
          angleOffset.current += 0.0016;
          layout();
        }
      }, 16);
    }
    function stopAuto() {
      if (autoRotate) clearInterval(autoRotate);
    }

    function onPointerDown(e: PointerEvent) {
      dragging = true;
      dragDelta = 0;
      dragStartX = e.clientX;
      dragStartAngle = angleOffset.current;
      stage?.classList.add(styles.dragging!);
    }
    function onPointerMove(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      dragDelta = dx;
      angleOffset.current = dragStartAngle + dx * 0.006;
      layout();
    }
    function endDrag() {
      dragging = false;
      stage?.classList.remove(styles.dragging!);
    }
    function onPointerEnter() {
      stageHovering = true;
    }
    function onPointerLeaveStage() {
      stageHovering = false;
      endDrag();
    }
    function onWheel(e: WheelEvent) {
      if (!stageHovering || itemHovering) return;
      e.preventDefault();
      angleOffset.current += (e.deltaY + e.deltaX) * 0.0016;
      layout();
    }

    const items = itemRefs.current.filter((el): el is HTMLButtonElement => el !== null);
    function onItemEnter() {
      itemHovering = true;
    }
    function onItemLeave() {
      itemHovering = false;
    }

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointerenter", onPointerEnter);
    stage.addEventListener("pointerleave", onPointerLeaveStage);
    stage.addEventListener("wheel", onWheel, { passive: false });
    items.forEach((el) => {
      el.addEventListener("pointerenter", onItemEnter);
      el.addEventListener("pointerleave", onItemLeave);
    });
    startAuto();

    // expose drag distance to click handlers via closure on the stage element
    (stage as HTMLDivElement & { __dragDelta?: () => number }).__dragDelta = () => dragDelta;

    return () => {
      stopAuto();
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", endDrag);
      stage.removeEventListener("pointerenter", onPointerEnter);
      stage.removeEventListener("pointerleave", onPointerLeaveStage);
      stage.removeEventListener("wheel", onWheel);
      items.forEach((el) => {
        el.removeEventListener("pointerenter", onItemEnter);
        el.removeEventListener("pointerleave", onItemLeave);
      });
    };
  }, [books.length]);

  return (
    <div className={styles.stage} ref={stageRef}>
      <div className={styles.track}>
        {books.map((book, i) => (
          <button
            key={book.slug}
            type="button"
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={styles.item}
            onClick={() => {
              const stage = stageRef.current as (HTMLDivElement & { __dragDelta?: () => number }) | null;
              const delta = stage?.__dragDelta?.() ?? 0;
              if (Math.abs(delta) > 6) return;
              onSelect(book);
            }}
          >
            <Image
              src={book.cover}
              alt={`${book.title} cover`}
              width={book.coverW}
              height={book.coverH}
              className={styles.img}
              sizes="260px"
            />
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
        ))}
      </div>
    </div>
  );
}
