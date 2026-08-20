"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MagnetBananas.module.css";

const IMAGE_ASPECT = 386 / 768;
const GAP = 26;
// Only bananas within INFLUENCE px of the pointer fully track it; beyond
// INFLUENCE + FALLOFF they sit still at baseAngle. Without this radius,
// every banana on the page reacts to the pointer at all times, and since
// rotation is dominated by vertical offset, an entire far-away row shares
// nearly the same target angle and snaps together as one block whenever
// the pointer crosses rows.
const INFLUENCE = 160;
const FALLOFF = 140;

// Normalized to (-180, 180]: the short way from `from` to `to`.
function shortestAngleDelta(from: number, to: number) {
  return ((((to - from) % 360) + 540) % 360) - 180;
}

type MagnetBananasProps = {
  bananaWidth?: number;
  baseAngle?: number;
};

export default function MagnetBananas({ bananaWidth = 38, baseAngle = -10 }: MagnetBananasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bananaHeight = Math.round(bananaWidth * IMAGE_ASPECT);
  const [grid, setGrid] = useState({ columns: 0, rows: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const computeGrid = () => {
      const { width, height } = container.getBoundingClientRect();
      setGrid({
        columns: Math.ceil(width / (bananaWidth + GAP)) + 1,
        rows: Math.ceil(height / (bananaHeight + GAP)) + 1,
      });
    };
    computeGrid();

    const ro = new ResizeObserver(computeGrid);
    ro.observe(container);
    return () => ro.disconnect();
  }, [bananaWidth, bananaHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !grid.columns || !grid.rows) return;
    const items = Array.from(container.querySelectorAll<HTMLSpanElement>(`.${styles.banana}`));
    if (!items.length) return;

    let centers: { x: number; y: number }[] = [];
    const measure = () => {
      centers = items.map((item) => {
        const rect = item.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
    };
    measure();

    // Unwrapped running angle per item (can grow past +/-180) so the CSS
    // transition always steps the short way, never the long way around.
    const currentAngles = items.map(() => baseAngle);

    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      const pointer = pending;
      if (!pointer) return;
      items.forEach((item, i) => {
        const center = centers[i];
        const b = pointer.x - center.x;
        const a = pointer.y - center.y;
        const c = Math.sqrt(a * a + b * b) || 1;
        const targetAngle = ((Math.acos(b / c) * 180) / Math.PI) * (pointer.y > center.y ? 1 : -1);
        const t = c <= INFLUENCE ? 1 : c >= INFLUENCE + FALLOFF ? 0 : 1 - (c - INFLUENCE) / FALLOFF;
        const blended = baseAngle + shortestAngleDelta(baseAngle, targetAngle) * t;
        currentAngles[i] += shortestAngleDelta(currentAngles[i], blended);
        item.style.setProperty("--rotate", `${currentAngles[i]}deg`);
      });
    };

    const onPointerMove = (pointer: { x: number; y: number }) => {
      pending = pointer;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const handleMouseMove = (e: MouseEvent) => onPointerMove({ x: e.clientX, y: e.clientY });
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onPointerMove({ x: t.clientX, y: t.clientY });
    };
    const handleResize = () => measure();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("resize", handleResize);

    const middleCenter = centers[Math.floor(centers.length / 2)];
    onPointerMove(middleCenter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [grid, baseAngle]);

  const count = grid.columns * grid.rows;

  return (
    <div ref={containerRef} className={styles.grid} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={styles.banana}
          style={
            {
              width: bananaWidth,
              height: bananaHeight,
              "--rotate": `${baseAngle}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
