"use client";

import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 300);
      const hideTimer = setTimeout(() => setHidden(true), 800);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [progress]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Logo */}
      <div className="mb-8 animate-fade-in">
        <div className="relative">
          <img
            src="/school-logo.png"
            alt="Saint Mary School Logo"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
          />
          {/* Pulsing ring around logo */}
          <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-gold/30 animate-ping" />
        </div>
      </div>

      {/* School name */}
      <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-1 animate-fade-in-up">
        Saint Mary School
      </h2>
      <p className="text-sm text-gold font-medium mb-8 animate-fade-in-up stagger-1">
        Rajula, Gujarat
      </p>

      {/* Loading bar */}
      <div className="w-48 sm:w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden animate-fade-in-up stagger-2">
        <div
          className="h-full bg-gradient-to-r from-navy via-gold to-green-accent rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading text */}
      <p className="text-xs text-muted-foreground mt-4 animate-fade-in-up stagger-3">
        {progress < 100 ? "Loading..." : "Welcome!"}
      </p>
    </div>
  );
}
