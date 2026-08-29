import { cn } from "@/lib/utils";

type Variant = "grid" | "dots";

/**
 * Fond de section géométrique, aligné au pixel : une trame technique lisible
 * plutôt que des halos flous. Purement décoratif, retiré des lecteurs d'écran.
 * Le masque radial l'estompe sur les bords pour éviter l'effet papier millimétré.
 */
export function TechBackdrop({
  variant = "grid",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const line = "color-mix(in oklab, var(--aduti-primary) 12%, transparent)";

  const layers =
    variant === "grid"
      ? {
          backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }
      : {
          backgroundImage: `radial-gradient(${line} 1.5px, transparent 1.5px)`,
          backgroundSize: "28px 28px",
        };

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        ...layers,
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 40%, #000 35%, transparent 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 40%, #000 35%, transparent 78%)",
      }}
    />
  );
}
