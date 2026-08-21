import Image from "next/image";

import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";
import type { Partner } from "@/types";

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
      {activePartners.map((partner) => (
        <article
          key={partner.id}
          title={partner.name}
          className="landing-v14-partner-card"
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
        </article>
      ))}
    </div>
  );
}
