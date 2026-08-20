import type { Metadata } from "next";
import { display, body, marginalia, mono } from "./fonts";
import Nav from "@/components/Nav";
import SiteBackground from "@/components/SiteBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "gaajar — Nikhil Poddar",
  description: "Zines and chapbooks by Nikhil Poddar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${marginalia.variable} ${mono.variable}`}
    >
      <body>
        <SiteBackground />
        <Nav />
        {children}
      </body>
    </html>
  );
}
