"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const missionCards = [
  {
    title: "Notre Mission",
    description:
      "Promouvoir la filière Informatique de la STIC et favoriser l’intégration socio-professionnelle des étudiants.",
    icon: "/images/landing/mission/icon-mission.svg",
  },
  {
    title: "Notre Vision",
    description:
      "Faire de la communauté des informaticiens de la STIC un réseau professionnel solide et reconnu.",
    icon: "/images/landing/mission/icon-vision.svg",
  },
  {
    title: "Nos Valeurs",
    description:
      "Solidarité entre promotions, excellence technique et entraide intergénérationnelle.",
    icon: "/images/landing/mission/icon-values.svg",
  },
];

export function LandingMission() {
  const [litCards, setLitCards] = useState([false, false, false]);
  const [passingCard, setPassingCard] = useState<number | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionQuery.matches) {
      const frame = window.requestAnimationFrame(() => setLitCards([true, true, true]));
      return () => window.cancelAnimationFrame(frame);
    }

    const timers: number[] = [];

    const schedule = (callback: () => void, delay: number) => {
      timers.push(window.setTimeout(callback, delay));
    };

    const receive = (index: number) => {
      setLitCards((current) => current.map((isLit, cardIndex) => isLit || cardIndex === index));
      setPassingCard(index);
      schedule(() => {
        setPassingCard((current) => (current === index ? null : current));
      }, 1000);
    };

    const runSequence = () => {
      setLitCards([false, false, false]);
      setPassingCard(null);

      schedule(() => receive(0), 550);
      schedule(() => receive(1), 1650);
      schedule(() => receive(2), 2750);
      schedule(() => {
        setLitCards((current) => current.map((value, index) => (index === 0 ? false : value)));
      }, 5000);
      schedule(() => {
        setLitCards((current) => current.map((value, index) => (index === 1 ? false : value)));
      }, 5090);
      schedule(() => {
        setLitCards((current) => current.map((value, index) => (index === 2 ? false : value)));
      }, 5180);
      schedule(runSequence, 6250);
    };

    runSequence();

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <section className="landing-v14-section landing-v14-mission" id="mission">
      <div className="landing-v14-container">
        <header className="landing-v14-section-head">
          <span className="landing-v14-eyebrow">Ambitions</span>
          <h2>Notre Mission &amp; Vision</h2>
          <span className="landing-v14-brand-rule" aria-hidden="true" />
        </header>

        <div className="landing-v14-mission-grid">
          {missionCards.map((card, index) => (
            <article
              className={`landing-v14-mission-card${litCards[index] ? " is-lit" : ""}${
                passingCard === index ? " is-passing is-receiving" : ""
              }`}
              key={card.title}
            >
              <div className="landing-v14-mission-copy">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
              <div className="landing-v14-mission-icon" aria-hidden="true">
                <Image src={card.icon} alt="" width={29} height={29} />
              </div>
              <span className="landing-v14-mission-front" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
