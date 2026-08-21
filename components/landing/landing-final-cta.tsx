import Link from "next/link";

export function LandingFinalCta() {
  return (
    <section className="landing-v14-section landing-v14-final-cta" id="apropos">
      <span className="landing-v14-cta-slash" aria-hidden="true" />
      <span className="landing-v14-cta-dots" aria-hidden="true" />

      <div className="landing-v14-container landing-v14-final-cta-grid">
        <div className="landing-v14-final-cta-copy">
          <span className="landing-v14-eyebrow">En savoir plus</span>
          <h2>
            <span>Vous voulez en</span>
            <span>savoir plus sur</span>
            <span>
              <strong>l’ADUTI</strong> et <em>son histoire&nbsp;?</em>
            </span>
          </h2>
          <span className="landing-v14-final-cta-rule" aria-hidden="true" />
          <p>
            Explorez notre parcours, nos réalisations et notre engagement envers la communauté.
          </p>
        </div>

        <span className="landing-v14-final-cta-divider" aria-hidden="true" />

        <div className="landing-v14-final-cta-actions">
          <Link className="landing-v14-final-cta-button is-primary" href="/about">
            <span>En savoir plus</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="landing-v14-final-cta-button is-outline" href="/contact">
            <span>Nous contacter</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
