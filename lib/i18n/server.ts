import { cookies } from "next/headers";

import { DEFAULT_LOCALE, LOCALE_COOKIE, getDictionaryFor, isLocale, type Dictionary, type Locale } from "./index";

/** Locale choisie par le visiteur, lue depuis son cookie. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getDictionary(): Promise<Dictionary> {
  return getDictionaryFor(await getLocale());
}
