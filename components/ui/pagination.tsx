import Link from "next/link";
import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/utils";

/**
 * Fenetre glissante autour de la page courante, avec toujours la premiere et
 * la derniere page. Au-dela d'une dizaine de pages, une liste complete devient
 * illisible.
 */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current]);
  for (const offset of [-1, 1]) {
    const p = current + offset;
    if (p > 1 && p < total) pages.add(p);
  }
  // Garde une largeur stable quand on est pres d'un bord.
  if (current <= 3) [2, 3, 4].forEach((p) => p < total && pages.add(p));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => p > 1 && pages.add(p));

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
  className,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const items = pageWindow(currentPage, totalPages);
  const arrow =
    "flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900";

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      {currentPage > 1 ? (
        <Link href={buildHref(currentPage - 1)} aria-label="Page précédente" className={arrow}>
          <MaterialIcon name="chevron_left" className="size-5" />
        </Link>
      ) : (
        <span aria-hidden className={cn(arrow, "cursor-default opacity-40")}>
          <MaterialIcon name="chevron_left" className="size-5" />
        </span>
      )}

      {items.map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-slate-400" aria-hidden>
            …
          </span>
        ) : (
          <Link
            key={item}
            href={buildHref(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={cn(
              "flex size-10 items-center justify-center rounded-xl text-sm font-medium transition-colors",
              item === currentPage
                ? "bg-aduti-primary text-white"
                : "border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
            )}
          >
            {item}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={buildHref(currentPage + 1)} aria-label="Page suivante" className={arrow}>
          <MaterialIcon name="chevron_right" className="size-5" />
        </Link>
      ) : (
        <span aria-hidden className={cn(arrow, "cursor-default opacity-40")}>
          <MaterialIcon name="chevron_right" className="size-5" />
        </span>
      )}
    </nav>
  );
}
