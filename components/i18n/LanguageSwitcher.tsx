"use client";

import { useTransition } from "react";
import { Languages } from "lucide-react";

import { useTranslations } from "./LanguageProvider";
import { LOCALES, type Locale } from "@/lib/i18n";
import { setLocale } from "@/lib/i18n/actions";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, t } = useTranslations();
  const [isPending, startTransition] = useTransition();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Languages aria-hidden className="size-4 shrink-0 text-slate-400" />
      <span className="sr-only">{t.language.label}</span>
      {LOCALES.map((code: Locale) => (
        <button
          key={code}
          type="button"
          lang={code}
          disabled={isPending || code === locale}
          aria-current={code === locale ? "true" : undefined}
          onClick={() => startTransition(() => void setLocale(code))}
          className={cn(
            "rounded-md px-2 py-1 text-xs font-medium uppercase transition-colors",
            code === locale
              ? "bg-slate-100 text-slate-900"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
