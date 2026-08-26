"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/utils";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200/50 dark:border-surface-800/50 shadow-sm"
          : "bg-white dark:bg-surface-950"
      }`}
    >
      <nav className="container-ytvidsave flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label={SITE_CONFIG.name + " home"}
        >
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-400
                         hover:text-surface-900 dark:hover:text-white
                         rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800
                         transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <a href="#tool" className="btn-primary text-sm !py-2 !px-4">
            Get Started
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg
                       bg-surface-100 dark:bg-surface-800
                       hover:bg-surface-200 dark:hover:bg-surface-700
                       border border-surface-200 dark:border-surface-700
                       transition-colors duration-200"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <div className="w-4 h-4 flex flex-col justify-center gap-1">
              <span
                className={`block h-0.5 w-4 bg-surface-700 dark:bg-surface-300 rounded-full transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-[3px]" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-4 bg-surface-700 dark:bg-surface-300 rounded-full transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-4 bg-surface-700 dark:bg-surface-300 rounded-full transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 top-16 z-40 bg-white/95 dark:bg-surface-950/95 backdrop-blur-xl transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container-ytvidsave py-6 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-base font-medium text-surface-700 dark:text-surface-300
                         hover:text-surface-900 dark:hover:text-white
                         rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800
                         transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-800">
            <a
              href="#tool"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full text-center"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
