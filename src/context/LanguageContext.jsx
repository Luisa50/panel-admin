import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { messages } from "../locales/messages";

export const UI_LANG_STORAGE_KEY = "healthy-mind-ui-lang";

/** Texto exacto de las opciones del selector de idioma en Configuración. */
export const UI_LABEL_ESPAÑOL = "Español";
export const UI_LABEL_INGLES = "Inglés";

export function getStoredLocale() {
  try {
    return localStorage.getItem(UI_LANG_STORAGE_KEY) === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

export function uiLabelToLocale(label) {
  if (label === UI_LABEL_INGLES) return "en";
  return "es";
}

export function localeToUiLabel(locale) {
  return locale === "en" ? UI_LABEL_INGLES : UI_LABEL_ESPAÑOL;
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(getStoredLocale);

  const setLocale = useCallback((next) => {
    const value = next === "en" ? "en" : "es";
    setLocaleState(value);
    try {
      localStorage.setItem(UI_LANG_STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  }, []);

  /** Desde el texto del option "Español" | "Inglés". */
  const setLocaleFromUiLabel = useCallback(
    (label) => {
      setLocale(uiLabelToLocale(label));
    },
    [setLocale]
  );

  const t = useCallback(
    (key) => {
      const table = messages[locale] || messages.es;
      return table[key] ?? messages.es[key] ?? key;
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      setLocaleFromUiLabel,
      t,
      uiLabelEs: UI_LABEL_ESPAÑOL,
      uiLabelEn: UI_LABEL_INGLES,
    }),
    [locale, setLocale, setLocaleFromUiLabel, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
