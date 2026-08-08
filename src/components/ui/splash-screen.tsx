"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out after 6s, fully gone at 7s
    const fadeTimer = setTimeout(() => setFadeOut(true), 4000);
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="splash-screen"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2A2B2D 0%, #1B3F6F 100%)",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 1s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      {/* Ambient glow orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(27, 63, 111, 0.35)",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(61, 114, 175, 0.2)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div
        style={{
          animation: "splashFadeUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          opacity: 0,
        }}
      >
        <Image
          src="/logo.png"
          alt="Al-Arz Investments"
          width={220}
          height={88}
          quality={100}
          priority
          style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 24,
          animation: "splashFadeUp 0.7s 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          opacity: 0,
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            textAlign: "center",
            fontFamily: "inherit",
          }}
        >
          Premium Real Estate
        </p>
      </div>

      {/* Loading bar */}
      <div
        style={{
          marginTop: 48,
          width: 180,
          height: 2,
          borderRadius: 999,
          background: "rgba(255,255,255,0.1)",
          overflow: "hidden",
          animation: "splashFadeUp 0.7s 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          opacity: 0,
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 999,
            background: "linear-gradient(90deg, #3D72AF, #6B96C4)",
            animation: "splashBar 1.8s 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            width: "0%",
          }}
        />
      </div>

      <style>{`
        @keyframes splashFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
