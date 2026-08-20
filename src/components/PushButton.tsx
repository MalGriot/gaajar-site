"use client";

import { forwardRef, useRef } from "react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./PushButton.module.css";

const BRAND_COLORS = ["var(--rust)", "var(--moss)", "var(--cobalt)", "var(--yolk)"];
const CYCLE_STEP_MS = 600;

type ButtonVariant = {
  as?: "button";
} & ButtonHTMLAttributes<HTMLButtonElement>;

type AnchorVariant = {
  as: "a";
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type PushButtonProps = { children: ReactNode; className?: string } & (
  | ButtonVariant
  | AnchorVariant
);

export const PushButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, PushButtonProps>(
  function PushButton({ as = "button", children, className = "", ...rest }, ref) {
    const intervalRef = useRef<number | null>(null);

    function startCycle(el: HTMLElement) {
      if (intervalRef.current !== null) return;
      let i = 0;
      el.style.setProperty("--brand-color", BRAND_COLORS[i]);
      intervalRef.current = window.setInterval(() => {
        i = (i + 1) % BRAND_COLORS.length;
        el.style.setProperty("--brand-color", BRAND_COLORS[i]);
      }, CYCLE_STEP_MS);
    }

    function stopCycle(el: HTMLElement) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      el.style.removeProperty("--brand-color");
    }

    const front = (
      <>
        <span className={styles.shadow} />
        <span className={styles.edge} />
        <span className={styles.front}>{children}</span>
      </>
    );

    const hoverHandlers = {
      onMouseEnter: (e: React.MouseEvent<HTMLElement>) => startCycle(e.currentTarget),
      onMouseLeave: (e: React.MouseEvent<HTMLElement>) => stopCycle(e.currentTarget),
    };

    if (as === "a") {
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          className={`${styles.btn} ${className}`}
          {...hoverHandlers}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {front}
        </a>
      );
    }

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        className={`${styles.btn} ${className}`}
        {...hoverHandlers}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {front}
      </button>
    );
  }
);
