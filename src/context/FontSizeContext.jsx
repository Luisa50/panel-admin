import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const FONT_SIZE_STORAGE_KEY = "healthy-mind-font-size";
const FONT_SIZE_CLASSES = ["font-size-small", "font-size-normal", "font-size-large"];

const FontSizeContext = createContext(null);

function normalizeLabel(value) {
  if (value === "Pequeña" || value === "Grande") return value;
  return "Normal";
}

function labelToClass(label) {
  if (label === "Pequeña") return "font-size-small";
  if (label === "Grande") return "font-size-large";
  return "font-size-normal";
}

function getStoredFontSizeLabel() {
  try {
    const stored = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    return normalizeLabel(stored);
  } catch {
    return "Normal";
  }
}

export function FontSizeProvider({ children }) {
  const [fontSizeLabel, setFontSizeLabelState] = useState(getStoredFontSizeLabel);

  useEffect(() => {
    const normalized = normalizeLabel(fontSizeLabel);
    const root = document.documentElement;
    root.classList.remove(...FONT_SIZE_CLASSES);
    root.classList.add(labelToClass(normalized));
    try {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, normalized);
    } catch {
      /* ignore */
    }
  }, [fontSizeLabel]);

  const setFontSizeLabel = (next) => {
    setFontSizeLabelState(normalizeLabel(next));
  };

  const value = useMemo(
    () => ({ fontSizeLabel, setFontSizeLabel }),
    [fontSizeLabel]
  );

  return (
    <FontSizeContext.Provider value={value}>{children}</FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) {
    throw new Error("useFontSize must be used within FontSizeProvider");
  }
  return ctx;
}

