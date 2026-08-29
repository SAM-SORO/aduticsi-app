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
    <div 
      className="relative overflow-hidden py-8"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
      }}
    >
      <div className="flex animate-scroll gap-16 md:gap-24 w-max items-center">
        {doubled.map((partner, i) => (
          <div
            key={`${partner.id}-${i}`}
            title={partner.name}
            className="shrink-0 flex items-center justify-center h-20 w-40 opacity-40 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100 hover:scale-105 cursor-default"
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
