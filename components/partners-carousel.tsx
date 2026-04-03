import Image from "next/image";

import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

export async function PartnersCarousel() {
  if (!prisma.partner) {
    logger.warn("Prisma: 'partner' model not yet available in client.");
    return null;
  }
  
  let activePartners = [];
  
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

  const doubled = [...activePartners, ...activePartners];

  return (
    <div className="relative overflow-hidden py-8">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="flex animate-scroll gap-16 w-max">
        {doubled.map((partner, i) => (
          <div
            key={`${partner.id}-${i}`}
            className="flex-shrink-0 flex items-center justify-center h-20 w-40 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
          >
            <div className="relative w-full h-full">
              <Image
                src={partner.logo_url}
                alt={partner.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100px, 160px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
