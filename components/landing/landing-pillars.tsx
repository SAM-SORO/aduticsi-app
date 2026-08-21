import {
  BriefcaseBusiness,
  GraduationCap,
  Globe2,
  Monitor,
  Network,
  UsersRound,
} from "lucide-react";

const actions = [
  { label: "Promouvoir l’informatique et les NTIC", icon: Monitor, tone: "navy" },
  { label: "Encourager les amateurs et passionnés", icon: UsersRound, tone: "red" },
  {
    label: "Faciliter l’insertion professionnelle des diplômés",
    icon: BriefcaseBusiness,
    tone: "navy",
  },
  { label: "Faire rayonner le savoir-faire ivoirien mondialement", icon: Globe2, tone: "red" },
];

const pillars = [
  {
    title: "Formation STIC",
    description: "La filière STIC forme les techniciens supérieurs (DUT/DTS) d’élite à l’INP-HB.",
    icon: GraduationCap,
    tone: "red",
  },
  {
    title: "Le Réseau",
    description: "Une communauté unie de plus de 20 promotions de talents du numérique.",
    icon: Network,
    tone: "navy",
  },
];

export function LandingPillars() {
  return (
    <section className="landing-v14-section landing-v14-pillars" id="piliers">
      <span className="landing-v14-pillar-diagonal" aria-hidden="true" />
      <span className="landing-v14-pillar-tech-lines" aria-hidden="true" />
      <span className="landing-v14-pillar-microdots" aria-hidden="true" />

      <div className="landing-v14-container landing-v14-pillar-layout">
        <div className="landing-v14-pillar-copy">
          <div className="landing-v14-pillar-eyebrow-row">
            <span className="landing-v14-pillar-eyebrow-mark" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="landing-v14-eyebrow">Nos piliers d’action</span>
          </div>
          <h2>
            <span>Agir aujourd’hui,</span>
            <span>
              bâtir <em>demain.</em>
            </span>
          </h2>
          <span className="landing-v14-pillar-accent" aria-hidden="true">
            <i className="is-navy" />
            <i className="is-red" />
            <i className="is-dot" />
          </span>
          <p>
            L’ADUTI a pour mission de promouvoir l’informatique au sein de l’INP-HB et au-delà,
            de soutenir l’insertion professionnelle des jeunes diplômés grâce à son réseau
            d’alumni, de valoriser les compétences numériques et de développer un esprit de
            solidarité entre les générations.
          </p>

          <div className="landing-v14-pillar-action-grid">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <article className="landing-v14-pillar-action" key={action.label}>
                  <span
                    className="landing-v14-pillar-action-icon"
                    data-tone={action.tone}
                    aria-hidden="true"
                  >
                    <Icon />
                  </span>
                  <strong>{action.label}</strong>
                </article>
              );
            })}
          </div>
        </div>

        <div className="landing-v14-pillar-composition">
          <div className="landing-v14-pillar-panel" aria-hidden="true">
            <svg viewBox="0 0 360 270" role="presentation">
              <path d="M245 18 303 52v68l-58 34-58-34V52Z" />
              <path d="m302 119 45 27v53l-45 27-45-27v-53Z" />
              <path d="M187 118 232 145v53l-45 27-45-27v-53Z" />
              <path d="m245 154 57-35M232 145l25-14M187 118l58 36" />
              <circle cx="245" cy="154" r="4" />
              <circle cx="302" cy="119" r="4" />
              <circle cx="232" cy="145" r="3" />
            </svg>
          </div>

          <div className="landing-v14-pillar-feature-list">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <article
                  className="landing-v14-pillar-feature"
                  data-tone={pillar.tone}
                  key={pillar.title}
                >
                  <div className="landing-v14-pillar-hex-wrap" aria-hidden="true">
                    <span className="landing-v14-pillar-hex-outline" />
                    <span className="landing-v14-pillar-hex">
                      <Icon />
                    </span>
                  </div>
                  <span className="landing-v14-pillar-feature-divider" aria-hidden="true" />
                  <div className="landing-v14-pillar-feature-copy">
                    <h3>{pillar.title}</h3>
                    <p>{pillar.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
