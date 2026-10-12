import React from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import img from "../../images/logo1.png";
import { ExternalLink, Sparkles, Terminal } from "lucide-react";

const Header = () => {
  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md border-b transition-colors"
      style={{
        background: "var(--color-surface-translucent, var(--color-surface))",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2.5 no-underline group">
            <img
              src={img}
              alt="Sunbird AI"
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span
                className="font-bold text-sm sm:text-base tracking-tight leading-none"
                style={{ color: "var(--color-text)" }}
              >
                Sunbird AI
              </span>
              <span
                className="text-[10px] font-medium tracking-wide uppercase"
                style={{ color: "var(--color-muted)" }}
              >
                Speech Studio
              </span>
            </div>
          </NavLink>

          {/* Navigation Links: Studio, Sunflower, API */}
          <nav className="hidden sm:flex items-center gap-1.5" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-semibold no-underline transition-colors ${
                  isActive
                    ? "text-[var(--color-accent)] bg-[var(--color-pill)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`
              }
            >
              Studio
            </NavLink>

            {/* Link to Sunflower (Translation Platform) */}
            <a
              href="https://sunflower.sunbird.ai"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold no-underline text-[var(--color-muted)] hover:text-[var(--color-text)] inline-flex items-center gap-1.5 transition-colors"
              title="Sunflower - African Language Translation"
            >
              <Sparkles size={13} style={{ color: "var(--color-accent)" }} />
              <span>Sunflower</span>
              <ExternalLink size={10} className="opacity-60" />
            </a>

            {/* Link to Sunbird API */}
            <a
              href="https://api.sunbird.ai"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold no-underline text-[var(--color-muted)] hover:text-[var(--color-text)] inline-flex items-center gap-1.5 transition-colors"
              title="Sunbird AI API"
            >
              <Terminal size={13} />
              <span>API</span>
              <ExternalLink size={10} className="opacity-60" />
            </a>

            {/* Link to Documentation */}
            <a
              href="https://docs.sunbird.ai"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold no-underline text-[var(--color-muted)] hover:text-[var(--color-text)] inline-flex items-center gap-1 transition-colors"
              title="Sunbird Developer Documentation"
            >
              <span>Docs</span>
              <ExternalLink size={10} className="opacity-60" />
            </a>
          </nav>
        </div>

        {/* Right Actions: Clean Icon Theme Switcher */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
