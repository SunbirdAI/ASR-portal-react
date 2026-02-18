export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

const THEME_MODE_STORAGE_KEY = "app-theme-mode";

const isBrowser = () => typeof window !== "undefined";

export const getSystemTheme = () => {
  if (!isBrowser() || !window.matchMedia) {
    return THEME_MODES.LIGHT;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEME_MODES.DARK
    : THEME_MODES.LIGHT;
};

export const resolveTheme = (mode) => {
  if (mode === THEME_MODES.DARK) return THEME_MODES.DARK;
  if (mode === THEME_MODES.LIGHT) return THEME_MODES.LIGHT;
  return getSystemTheme();
};

export const getStoredThemeMode = () => {
  if (!isBrowser()) return THEME_MODES.SYSTEM;

  const stored = localStorage.getItem(THEME_MODE_STORAGE_KEY);
  if (
    stored === THEME_MODES.LIGHT ||
    stored === THEME_MODES.DARK ||
    stored === THEME_MODES.SYSTEM
  ) {
    return stored;
  }

  return THEME_MODES.SYSTEM;
};

export const setStoredThemeMode = (mode) => {
  if (!isBrowser()) return;
  localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
};

export const applyThemeMode = (mode) => {
  if (!isBrowser()) return;

  const resolvedTheme = resolveTheme(mode);
  document.documentElement.setAttribute("data-theme", resolvedTheme);
  document.documentElement.setAttribute("data-theme-mode", mode);
};

export const initializeTheme = () => {
  const mode = getStoredThemeMode();
  applyThemeMode(mode);
  return mode;
};
