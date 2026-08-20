"use client";

import { usePathname } from "next/navigation";
import Topography from "./Topography";
import styles from "./SiteBackground.module.css";

export default function SiteBackground() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <div className={styles.backdrop}>
      <Topography
        colorPalette={["#5b6e4f", "#c74e28", "#2c4c8c", "#e8b23a"]}
        colorCycleSpeed={0.025}
        speed={0.12}
        morphAmount={2.0}
        morphSpeed={0.03}
        bands={3.5}
        thickness={0.02}
        scale={1.3}
        glow={0.15}
        colorMode="elevation"
        contrast={2.5}
        brightness={0.9}
        opacity={0.28}
        grain={false}
        mouseInteraction={false}
      />
    </div>
  );
}
