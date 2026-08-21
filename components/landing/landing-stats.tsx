import { MaterialIcon } from "@/components/icons/material-icon";
import { Counter } from "@/components/ui/counter";

type LandingStatsProps = {
  promotionCount: number;
};

export function LandingStats({ promotionCount }: LandingStatsProps) {
  const stats = [
    {
      label: "D’HISTOIRE",
      value: 31,
      suffix: "ans",
      icon: "calendar_month",
    },
    {
      label: "PROFILS",
      value: 3,
      note: "2A-TS · 3A-TS · ALUMNIS",
      icon: "groups",
    },
    {
      label: "PROMOTIONS",
      value: promotionCount,
      icon: "emoji_events",
    },
    {
      label: "INSERTION PRO",
      value: 100,
      suffix: "%",
      icon: "rocket_launch",
    },
  ];

  return (
    <section className="landing-v14-stats" aria-label="Statistiques clés de l’ADUTI">
      <div className="landing-v14-container">
        <div className="landing-v14-stats-shell">
          {stats.map((stat) => (
            <article className="landing-v14-stat" key={stat.label}>
              <div className="landing-v14-stat-icon" aria-hidden="true">
                <MaterialIcon name={stat.icon} />
              </div>
              <div className="landing-v14-stat-copy">
                <div className="landing-v14-stat-number">
                  <Counter end={stat.value} />
                  {stat.suffix ? <span>{stat.suffix}</span> : null}
                </div>
                <p className="landing-v14-stat-label">{stat.label}</p>
                {stat.note ? <p className="landing-v14-stat-note">{stat.note}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
