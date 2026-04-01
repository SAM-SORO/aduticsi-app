import Link from "next/link";
import Image from "next/image";
import { MaterialIcon } from "@/components/icons/material-icon";

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="layout-container max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <Link href="/" className="flex items-center select-none">
              <div className="relative h-16 w-48 sm:h-20 sm:w-64">
                <Image
                  src="/logo_association.jpeg"
                  alt="Logo ADUTI"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">
              L&apos;association des DUT et DTS en Informatique de l&apos;INP-HB
            </p>
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="relative h-10 w-10 transition-all grayscale opacity-60 hover:grayscale-0 hover:opacity-100">
                <Image
                  src="/image_logo_esi.png"
                  alt="Logo ESI"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative h-10 w-10 transition-all grayscale opacity-60 hover:grayscale-0 hover:opacity-100">
                <Image
                  src="/image_logo_inphb.png"
                  alt="Logo INP-HB"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h4 className="font-bold text-slate-800 mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:w-8 after:h-1 after:bg-[var(--aduti-primary)]/30 after:rounded-full">
              Liens Rapides
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[var(--aduti-primary)] transition-all hover:translate-x-1 inline-block"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/members"
                  className="hover:text-[var(--aduti-primary)] transition-all hover:translate-x-1 inline-block"
                >
                  Membres
                </Link>
              </li>
              <li>
                <Link
                  href="/activities"
                  className="hover:text-[var(--aduti-primary)] transition-all hover:translate-x-1 inline-block"
                >
                  Événements
                </Link>
              </li>
              <li>
                <Link
                  href="/activities"
                  className="hover:text-[var(--aduti-primary)] transition-all hover:translate-x-1 inline-block"
                >
                  Actualités
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h4 className="font-bold text-slate-800 mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:w-8 after:h-1 after:bg-[var(--aduti-primary)]/30 after:rounded-full">
              Ressources
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="/members"
                  className="hover:text-[var(--aduti-primary)] transition-all hover:translate-x-1 inline-block"
                >
                  Annuaire
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[var(--aduti-primary)] transition-all hover:translate-x-1 inline-block"
                >
                  Offres d&apos;emploi
                </Link>
              </li>
              <li>
                <Link
                  href="/activities"
                  className="hover:text-[var(--aduti-primary)] transition-all hover:translate-x-1 inline-block"
                >
                  Galerie Photo
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[var(--aduti-primary)] transition-all hover:translate-x-1 inline-block"
                >
                  Documents
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h4 className="font-bold text-slate-800 mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:w-8 after:h-1 after:bg-[var(--aduti-primary)]/30 after:rounded-full">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-slate-500 flex flex-col items-center md:items-start">
              <li className="flex items-start gap-2">
                <MaterialIcon name="location_on" className="w-[18px] h-[18px] mt-0.5 text-[var(--aduti-primary)]" />
                <span>
                  INP-HB Centre, Yamoussoukro,
                  <br />
                  Côte d&apos;Ivoire
                </span>
              </li>
              <li className="flex items-center gap-2 group">
                <MaterialIcon name="mail" className="w-[18px] h-[18px] group-hover:scale-110 transition-transform text-[var(--aduti-primary)]" />
                <Link
                  href="mailto:contact@aduti.ci"
                  className="hover:text-[var(--aduti-primary)] transition-colors"
                >
                  contact@aduti.ci
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm">
            © 2024 ADUTI Yamoussoukro. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="https://www.facebook.com/share/1ERtvdnwfR/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-slate-400 hover:text-[#1877F2] hover:scale-110 transition-all duration-300"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  clipRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  fillRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/company/association-des-dut-et-dts-en-informatique-de-l-inp-hb-aduti/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 hover:text-[#0077b5] hover:scale-110 transition-all duration-300"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
