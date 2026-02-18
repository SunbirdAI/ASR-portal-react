import React, { useEffect, useState } from "react";
import { SunMoon } from "lucide-react";
import {
  Button,
  RelativeDiv,
  OuterRing,
  DropDownList,
  ThemeOption,
  ThemeOptions,
  SectionLabel,
} from "./DropDown.styles";
import {
  THEME_MODES,
  applyThemeMode,
  getStoredThemeMode,
  setStoredThemeMode,
} from "../../lib/theme";

const themeChoices = [
  { id: THEME_MODES.LIGHT, label: "Light" },
  { id: THEME_MODES.DARK, label: "Dark" },
  { id: THEME_MODES.SYSTEM, label: "System" },
];

export const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState(THEME_MODES.SYSTEM);

  useEffect(() => {
    const storedMode = getStoredThemeMode();
    setThemeMode(storedMode);
    applyThemeMode(storedMode);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = () => {
      if (themeMode === THEME_MODES.SYSTEM) {
        applyThemeMode(THEME_MODES.SYSTEM);
      }
    };

    mediaQuery.addEventListener("change", onSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", onSystemThemeChange);
  }, [themeMode]);

  const setMode = (mode) => {
    setThemeMode(mode);
    setStoredThemeMode(mode);
    applyThemeMode(mode);
  };

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <RelativeDiv>
      <Button onClick={toggleDropdown} aria-label="Change color mode">
        <OuterRing>
          <SunMoon size={18} strokeWidth={2} />
        </OuterRing>
      </Button>

      {isOpen && (
        <DropDownList onMouseLeave={() => setIsOpen(false)}>
          <SectionLabel>Appearance</SectionLabel>
          <ThemeOptions>
            {themeChoices.map((choice) => (
              <ThemeOption
                key={choice.id}
                type="button"
                active={themeMode === choice.id}
                onClick={() => setMode(choice.id)}
              >
                {choice.label}
              </ThemeOption>
            ))}
          </ThemeOptions>
        </DropDownList>
      )}
    </RelativeDiv>
  );
};
