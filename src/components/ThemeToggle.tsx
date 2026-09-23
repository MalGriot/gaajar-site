"use client";

import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export default function ThemeToggle({ isDark, onToggle, className }: ThemeToggleProps) {
  return (
    <label
      className={className ? `${styles.wrap} ${className}` : styles.wrap}
      aria-label="Toggle dark mode"
    >
      <div className={styles.outer}>
        <div className={styles.inner}>
          <div className={styles.dot} />
          <div className={styles.track}>
            <input
              type="checkbox"
              className={styles.hidden}
              checked={isDark}
              onChange={onToggle}
            />
            <div className={styles.face}>
              <div className={styles.nose}>
                <div className={styles.noseTip} />
              </div>
              <div className={styles.panelLeft} />
              <div className={styles.panelRight} />
            </div>
          </div>
          <div className={styles.bar} />
        </div>
      </div>
    </label>
  );
}
