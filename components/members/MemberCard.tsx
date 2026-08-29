import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/material-icon";

type MemberCardData = {
  id: string;
  slug: string | null;
  first_name: string;
  last_name: string;
  email: string;
  photo_url: string | null;
  status: "STUDENT" | "ALUMNI";
  current_job_title: string | null;
  linkedin_url: string | null;
  promotion: { name: string };
  poste: { name: string } | null;
};

function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function MemberCard({ member }: { member: MemberCardData }) {
  const href = `/members/${member.slug ?? member.id}`;
  const fullName = `${member.last_name.toUpperCase()} ${member.first_name}`;
  const role = member.poste?.name ?? member.current_job_title;

  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-200 hover:border-[var(--aduti-primary)]/40 hover:bg-slate-50/60 focus-within:border-[var(--aduti-primary)]">
      <div className="flex items-start gap-5">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
          {member.photo_url ? (
            <Image
              src={member.photo_url}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-lg font-semibold text-slate-500">
              {initials(member.first_name, member.last_name)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <h3 className="truncate text-lg font-semibold text-slate-900" title={fullName}>
            {/* Lien étiré : toute la carte est cliquable sans imbriquer de liens. */}
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-[var(--aduti-primary)]"
            >
              {fullName}
            </Link>
          </h3>
          {role ? (
            <p
              className={`mt-1 line-clamp-2 text-sm ${member.poste ? "font-medium text-[var(--aduti-primary)]" : "text-slate-500"}`}
              title={role}
            >
              {role}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-400">Membre</p>
          )}

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span>Promo {member.promotion.name}</span>
            <span aria-hidden className="h-3 w-px bg-slate-200" />
            <span>{member.status === "ALUMNI" ? "Alumni" : "Étudiant"}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="relative z-10 flex items-center gap-1">
          <a
            href={`mailto:${member.email}`}
            aria-label={`Écrire à ${fullName}`}
            className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <MaterialIcon name="mail" className="size-4" />
          </a>
          {member.linkedin_url && (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Profil LinkedIn de ${fullName}`}
              className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <MaterialIcon name="link" className="size-4" />
            </a>
          )}
        </div>
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors group-hover:text-[var(--aduti-primary)]">
          Voir le profil
          <MaterialIcon
            name="arrow_forward"
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </article>
  );
}
