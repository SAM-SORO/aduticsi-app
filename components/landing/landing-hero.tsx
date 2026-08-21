import Link from "next/link";

import { LandingMediaSlot } from "@/components/landing/landing-media-slot";
import { LandingQuoteCarousel } from "@/components/landing/landing-quote-carousel";
import { LandingScrollTicker } from "@/components/landing/landing-scroll-ticker";

export function LandingHero() {
  return (
    <section className="landing-v14">
      <div className="landing-v14-hero" id="accueil">
        <div className="landing-v14-container">
          <div className="landing-v14-hero-grid">
            <div className="landing-v14-hero-copy">
              <span className="landing-v14-official-badge">PORTAIL OFFICIEL</span>
              <h1>
                <span className="landing-v14-title-line">Construire.</span>
                <span className="landing-v14-title-line">Partager.</span>
                <span className="landing-v14-title-line landing-v14-title-line-final">
                  Exceller. <span className="landing-v14-title-accent">Innover.</span>
                </span>
              </h1>
              <div className="landing-v14-hero-line" />
              <p>
                L’ADUTI rassemble les étudiants et diplômés des DUT et DTS en Informatique de
                l’INP-HB. Rejoignez une communauté passionnée, engagée et tournée vers
                l’excellence.
              </p>
              <div className="landing-v14-hero-actions">
                <Link className="landing-v14-button landing-v14-button-primary" href="/about">
                  Découvrir l’ADUTI <span aria-hidden="true">→</span>
                </Link>
                <Link
                  className="landing-v14-button landing-v14-button-outline"
                  href="/activities"
                >
                  Explorer nos activités
                </Link>
              </div>
            </div>

            <LandingMediaSlot videoSrc="/videos/landing/hero-aduti.mp4" />
            <LandingQuoteCarousel />
          </div>
          <LandingScrollTicker />
        </div>
      </div>
    </section>
  );
}
