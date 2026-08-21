import { MaterialIcon } from "@/components/icons/material-icon";

const actions = [
  { label: "Promouvoir l’informatique et les NTIC", icon: "computer" },
  { label: "Encourager les amateurs et passionnés", icon: "groups" },
  { label: "Faciliter l’insertion professionnelle des diplômés", icon: "business_center" },
  { label: "Faire rayonner le savoir-faire ivoirien mondialement", icon: "language" },
];

const pillars = [
  {
    index: "01",
    title: "Formation STIC",
    description: "La filière STIC forme les techniciens supérieurs (DUT/DTS) d’élite à l’INP-HB.",
    icon: "school",
    tone: "navy",
  },
  {
    index: "02",
    title: "Le Réseau",
    description: "Une communauté unie de plus de 20 promotions de talents du numérique.",
    icon: "diversity_3",
    tone: "red",
  },
];

export function LandingPillars() {
  return (
    <section className="landing-v14-section landing-v14-pillars" id="piliers">
      <div className="landing-v14-container landing-v14-pillar-layout">
        <div className="landing-v14-pillar-copy">
          <span className="landing-v14-eyebrow">Nos piliers d’action</span>
          <h2>
            Agir aujourd’hui,
            <br />
            bâtir <span>demain.</span>
          </h2>
          <p>
            L’ADUTI a pour mission de promouvoir l’informatique au sein de l’INP-HB et au-delà,
            de soutenir l’insertion professionnelle des jeunes diplômés grâce à son réseau
            d’alumni, de valoriser les compétences numériques et de développer un esprit de
            solidarité entre les générations.
          </p>

          <div className="landing-v14-action-list">
            {actions.map((action, index) => (
              <div className="landing-v14-action-row" data-tone={index % 2 ? "red" : "navy"} key={action.label}>
                <span className="landing-v14-action-icon" aria-hidden="true">
                  <MaterialIcon name={action.icon} />
                </span>
                <strong>{action.label}</strong>
                <span className="landing-v14-action-arrow" aria-hidden="true">
                  ›
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="landing-v14-pillar-cards">
          {pillars.map((pillar) => (
            <article className="landing-v14-pillar-card" key={pillar.index}>
              <div className="landing-v14-pillar-visual">
                <div className="landing-v14-pillar-block" data-tone={pillar.tone} aria-hidden="true">
                  <MaterialIcon name={pillar.icon} />
                </div>
              </div>
              <div className="landing-v14-pillar-content">
                <span className="landing-v14-pillar-index" aria-hidden="true">
                  {pillar.index}
                </span>
                <h3>{pillar.title}</h3>
                <span className="landing-v14-pillar-line" aria-hidden="true" />
                <p>{pillar.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
