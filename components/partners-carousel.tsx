import Image from "next/image";
import type { CSSProperties } from "react";

import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";
import type { Partner } from "@/types";

type PartnerEditorialMetadata = {
  description: string;
  badge: string;
  accent: string;
};

type PartnerCardStyle = CSSProperties & {
  "--landing-v14-partner-accent"?: string;
};

const partnerEditorialMetadata: Record<string, PartnerEditorialMetadata> = {
  PARACLET: {
    description:
      "Agence ivoirienne de transformation digitale, active dans le conseil, l’audit, la formation et l’ingénierie des systèmes d’information.",
    badge: "TRANSFORMATION DIGITALE",
    accent: "#cf1747",
  },
  QALILAB: {
    description:
      "Acteur spécialisé en qualité logicielle, tests, automatisation et intelligence artificielle, avec un volet de formation aux métiers du numérique.",
    badge: "QUALITÉ & IA",
    accent: "#1267f5",
  },
  CSI: {
    description:
      "Communauté issue de l’ancienne appellation de la filière STIC : un soutien historique et un relais naturel pour les initiatives de l’ADUTI.",
    badge: "SOUTIEN HISTORIQUE",
    accent: "#10264A",
  },
};

function normalizePartnerName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();
}

export async function PartnersCarousel() {
  if (!prisma.partner) {
    logger.warn("Prisma: 'partner' model not yet available in client.");
    return null;
  }
  
  let activePartners: Partner[] = [];
  
  try {
    activePartners = await prisma.partner.findMany({
      where: { is_active: true },
      orderBy: { created_at: "asc" },
    });
  } catch (error) {
    logger.error({ error }, "Prisma error in PartnersCarousel");
    return null;
  }

  if (activePartners.length === 0) return null;

  return (
    <div className="landing-v14-partner-grid">
      {activePartners.map((partner) => {
        const editorial = partnerEditorialMetadata[normalizePartnerName(partner.name)];
        const style: PartnerCardStyle | undefined = editorial
          ? { "--landing-v14-partner-accent": editorial.accent }
          : undefined;

        return (
          <article
            key={partner.id}
            title={partner.name}
            className={`landing-v14-partner-card${editorial ? " has-editorial" : ""}`}
            style={style}
          >
            <div className="landing-v14-partner-logo">
              <Image
                src={partner.logo_url}
                alt={partner.name}
                fill
                sizes="(max-width: 680px) 132px, 150px"
              />
            </div>
            <span className="landing-v14-partner-line" aria-hidden="true" />
            <h3>{partner.name}</h3>
            {editorial && (
              <>
                <p className="landing-v14-partner-description">{editorial.description}</p>
                <span className="landing-v14-partner-badge">{editorial.badge}</span>
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}
