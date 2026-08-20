"use client";

import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export default function ThemeToggle({ isDark, onToggle, className }: ThemeToggleProps) {
  return (
    <div className={className ? `${styles.wrap} ${className}` : styles.wrap}>
      <div className={styles.outer}>
        <div className={styles.inner}>
          <div className={styles.dot} />
          <label className={styles.track} aria-label="Toggle dark mode">
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
          </label>
          <div className={styles.bar} />
        </div>
      </div>
    </div>
  );
}
