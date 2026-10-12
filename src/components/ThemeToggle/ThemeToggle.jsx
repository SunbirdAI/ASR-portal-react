import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  THEME_MODES,
  applyThemeMode,
  getStoredThemeMode,
  setStoredThemeMode,
} from "../../lib/theme";

/**
 * Modern icon-based theme segmented switcher (Light, Dark, System)
 * Replaces text-only menus with clean, immediate, accessible icon buttons.
 */
export const ThemeToggle = () => {
  const [themeMode, setThemeMode] = useState(THEME_MODES.SYSTEM);

  useEffect(() => {
    const stored = getStoredThemeMode();
    setThemeMode(stored);
    applyThemeMode(stored);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (themeMode === THEME_MODES.SYSTEM) {
        applyThemeMode(THEME_MODES.SYSTEM);
      }
    };
    mediaQuery.addEventListener("change", onSystemChange);
    return () => mediaQuery.removeEventListener("change", onSystemChange);
  }, [themeMode]);

  const selectMode = (mode) => {
    setThemeMode(mode);
    setStoredThemeMode(mode);
    applyThemeMode(mode);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Theme mode"
      className="flex items-center p-0.5 rounded-xl border transition-all"
      style={{
        background: "var(--color-pill)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Light Button */}
      <button
        type="button"
        role="radio"
        aria-checked={themeMode === THEME_MODES.LIGHT}
        onClick={() => selectMode(THEME_MODES.LIGHT)}
        className={`p-1.5 rounded-lg transition-all ${
          themeMode === THEME_MODES.LIGHT
            ? "shadow-sm scale-105"
            : "opacity-60 hover:opacity-100"
        }`}
        style={{
          background:
            themeMode === THEME_MODES.LIGHT ? "var(--color-surface)" : "transparent",
          color:
            themeMode === THEME_MODES.LIGHT
              ? "var(--color-accent)"
              : "var(--color-text)",
        }}
        title="Light theme"
        aria-label="Light theme"
      >
        <Sun size={15} />
      </button>

      {/* Dark Button */}
      <button
        type="button"
        role="radio"
        aria-checked={themeMode === THEME_MODES.DARK}
        onClick={() => selectMode(THEME_MODES.DARK)}
        className={`p-1.5 rounded-lg transition-all ${
          themeMode === THEME_MODES.DARK
            ? "shadow-sm scale-105"
            : "opacity-60 hover:opacity-100"
        }`}
        style={{
          background:
            themeMode === THEME_MODES.DARK ? "var(--color-surface)" : "transparent",
          color:
            themeMode === THEME_MODES.DARK
              ? "var(--color-accent)"
              : "var(--color-text)",
        }}
        title="Dark theme"
        aria-label="Dark theme"
      >
        <Moon size={15} />
      </button>

      {/* System Button */}
      <button
        type="button"
        role="radio"
        aria-checked={themeMode === THEME_MODES.SYSTEM}
        onClick={() => selectMode(THEME_MODES.SYSTEM)}
        className={`p-1.5 rounded-lg transition-all ${
          themeMode === THEME_MODES.SYSTEM
            ? "shadow-sm scale-105"
            : "opacity-60 hover:opacity-100"
        }`}
        style={{
          background:
            themeMode === THEME_MODES.SYSTEM ? "var(--color-surface)" : "transparent",
          color:
            themeMode === THEME_MODES.SYSTEM
              ? "var(--color-accent)"
              : "var(--color-text)",
        }}
        title="Follow system theme"
        aria-label="Follow system theme"
      >
        <Monitor size={15} />
      </button>
    </div>
  );
};

export default ThemeToggle;
