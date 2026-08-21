import { PartnersCarousel } from "@/components/partners-carousel";

export function LandingPartners() {
  return (
    <section className="landing-v14-section landing-v14-partners" id="partenaires">
      <div className="landing-v14-container">
        <header className="landing-v14-section-head">
          <span className="landing-v14-eyebrow">Écosystème</span>
          <h2>
            Nos <span>Partenaires &amp; Soutiens</span>
          </h2>
          <p className="landing-v14-section-subtitle">
            Des acteurs qui accompagnent l’ADUTI dans la formation, la transformation numérique,
            la qualité logicielle et le développement de sa communauté.
          </p>
        </header>

        <PartnersCarousel />
      </div>
    </section>
  );
}
