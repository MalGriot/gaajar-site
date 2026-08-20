import localFont from "next/font/local";

export const display = localFont({
  src: "../fonts/BigShoulders.ttf",
  variable: "--font-display",
  weight: "100 900",
  display: "swap",
});

export const body = localFont({
  src: "../fonts/Archivo.ttf",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});

export const marginalia = localFont({
  src: "../fonts/Caveat.ttf",
  variable: "--font-marginalia",
  weight: "400 700",
  display: "swap",
});

export const mono = localFont({
  src: "../fonts/PlexMono.ttf",
  variable: "--font-mono",
  weight: "500",
  display: "swap",
});
