"use client";

import { usePathname } from "next/navigation";

type Lang = "fr" | "en";

export default function Footer() {
  const pathname = usePathname();
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;

  return (
    <footer style={{ background: "#ffffff", borderTop: "1px solid #ebebeb" }}>
      <div style={{
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <p style={{ fontSize: "10px", color: "#c0c0c0", letterSpacing: "0.04em", margin: 0 }}>
          © {new Date().getFullYear()} Sandrine Ceuppens · Bruxelles
        </p>
        <a href="mailto:hello@thegirlwithacamera.com" style={{
          fontSize: "12px",
          color: "#0a0a0a",
          textDecoration: "none",
          borderBottom: "1px solid #0a0a0a",
          paddingBottom: "2px",
        }}>
          hello@thegirlwithacamera.com
        </a>
      </div>
    </footer>
  );
}
