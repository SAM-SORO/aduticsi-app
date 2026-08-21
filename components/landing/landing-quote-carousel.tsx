"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const citations = [
  {
    image: "/images/landing/citations/mary-jackson.webp",
    quote: "Je vais essayer ça, et si ça ne marche pas, j’essaierai autre chose.",
    name: "MARY JACKSON",
    role: "Première ingénieure afro-américaine de la NASA",
  },
  {
    image: "/images/landing/citations/larry-page.webp",
    quote:
      "Si vous avez de grandes idées, beaucoup de gens vous diront que c’est impossible. Il faut avoir confiance et continuer malgré ça.",
    name: "LARRY PAGE",
    role: "Co-fondateur de Google",
  },
  {
    image: "/images/landing/citations/jeff-bezos.webp",
    quote: "If you never want to be criticized, for goodness’ sake don’t do anything new.",
    name: "JEFF BEZOS",
    role: "Fondateur d’Amazon",
  },
] as const;

export function LandingQuoteCarousel() {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const reduceMotion = useReducedMotion();
  const citation = citations[index];

  const selectCitation = (nextIndex: number) => {
    setIndex((nextIndex + citations.length) % citations.length);
  };

  return (
    <>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.article
            className="landing-v14-quote-card"
            aria-label="Citation mise en avant"
            initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
          >
            <button
              className="landing-v14-quote-close"
              type="button"
              aria-label="Masquer les citations"
              onClick={() => setIsOpen(false)}
            >
              <span aria-hidden="true">×</span>
            </button>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={citation.name}
                className="landing-v14-quote-content"
                initial={reduceMotion ? false : { opacity: 0.18 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0.18 }}
                transition={{ duration: reduceMotion ? 0 : 0.18 }}
              >
                <div className="landing-v14-quote-image">
                  <Image
                    src={citation.image}
                    alt="Portrait associé à la citation"
                    fill
                    sizes="(max-width: 680px) 72px, 84px"
                    className="object-cover object-top"
                  />
                </div>

                <div className="landing-v14-quote-copy">
                  <div className="landing-v14-quote-mark">“</div>
                  <p>{citation.quote}</p>
                  <strong>{citation.name}</strong>
                  <small>{citation.role}</small>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="landing-v14-quote-controls" aria-label="Navigation des citations">
              <button
                type="button"
                aria-label="Citation précédente"
                onClick={() => selectCitation(index - 1)}
              >
                <span aria-hidden="true">‹</span>
              </button>
              <div className="landing-v14-quote-dots">
                {citations.map((item, itemIndex) => (
                  <button
                    key={item.name}
                    type="button"
                    className={itemIndex === index ? "is-active" : undefined}
                    aria-label={`Citation ${itemIndex + 1}`}
                    aria-current={itemIndex === index ? "true" : undefined}
                    onClick={() => selectCitation(itemIndex)}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Citation suivante"
                onClick={() => selectCitation(index + 1)}
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>
          </motion.article>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          type="button"
          className="landing-v14-quote-reopen"
          aria-label="Réafficher les citations"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsOpen(true)}
        >
          ❝ &nbsp; Citations
        </motion.button>
      )}
    </>
  );
}
