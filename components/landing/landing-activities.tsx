import Image from "next/image";
import Link from "next/link";

const featuredActivities = [
  {
    title: "Voir le Hackathon",
    image: "/images/landing/activities/hackathon.webp",
    imageAlt: "Affiche Hackathon ADUTI",
    categorySlug: "hackathon",
  },
  {
    title: "Découvrir le site",
    image: "/images/landing/activities/site-web-officiel.webp",
    imageAlt: "Affiche du site web officiel ADUTI",
    categorySlug: "site-web-officiel",
  },
  {
    title: "Voir l’Info’s Day",
    image: "/images/landing/activities/infos-day-2026.webp",
    imageAlt: "Affiche Info’s Day 2026",
    categorySlug: "infos-day",
  },
] as const;

interface LandingActivitiesProps {
  categoryIdsBySlug: Record<string, string>;
}

export function LandingActivities({ categoryIdsBySlug }: LandingActivitiesProps) {
  return (
    <section className="landing-v14-section landing-v14-activities" id="activites">
      <div className="landing-v14-container">
        <header className="landing-v14-activity-head">
          <div>
            <span className="landing-v14-eyebrow">Vie associative</span>
            <h2>Nos Activités Phares</h2>
            <span className="landing-v14-activity-rule" aria-hidden="true" />
          </div>
          <Link className="landing-v14-activity-all" href="/activities">
            <span>Voir nos activités</span>
            <span className="landing-v14-round-arrow landing-v14-round-arrow-red" aria-hidden="true">
              →
            </span>
          </Link>
        </header>

        <div className="landing-v14-activity-grid">
          {featuredActivities.map((activity) => {
            const categoryId = categoryIdsBySlug[activity.categorySlug];
            const href = categoryId ? `/activities?category=${categoryId}` : "/activities";

            return (
              <article className="landing-v14-activity-card" key={activity.title}>
                <div className="landing-v14-activity-image">
                  <Image
                    src={activity.image}
                    alt={activity.imageAlt}
                    fill
                    sizes="(max-width: 680px) 100vw, (max-width: 940px) 50vw, 33vw"
                  />
                </div>
                <Link className="landing-v14-activity-footer" href={href}>
                  <strong>{activity.title}</strong>
                  <span className="landing-v14-round-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
