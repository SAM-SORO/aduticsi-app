"use client";

import { createContext, useContext } from "react";

import type { Dictionary, Locale } from "@/lib/i18n";

interface I18nValue {
  locale: Locale;
  t: Dictionary;
}

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, t: dictionary }}>{children}</I18nContext.Provider>
  );
}

/** Traductions cote client. Le dictionnaire vient du layout serveur. */
export function useTranslations(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useTranslations doit être utilisé dans un LanguageProvider.");
  }
  return value;
}
