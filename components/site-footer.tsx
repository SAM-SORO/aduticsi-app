import Link from "next/link";
import Image from "next/image";
import { MaterialIcon } from "@/components/icons/material-icon";

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="layout-container max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col items-center text-center space-y-4 mx-auto">
            <Link href="/" className="flex items-center select-none justify-center">
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
            <div className="flex items-center justify-center gap-6 pt-2 w-full">
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
            <h4 className="font-bold text-slate-800 mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:w-8 after:h-1 after:bg-(--aduti-primary)/30 after:rounded-full">
              Liens Rapides
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="/about"
                  className="hover:text-aduti-primary transition-all hover:translate-x-1 inline-block"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/members"
                  className="hover:text-aduti-primary transition-all hover:translate-x-1 inline-block"
                >
                  Membres
                </Link>
              </li>
              <li>
                <Link
                  href="/activities"
                  className="hover:text-aduti-primary transition-all hover:translate-x-1 inline-block"
                >
                  Événements
                </Link>
              </li>
              <li>
                <Link
                  href="/activities"
                  className="hover:text-aduti-primary transition-all hover:translate-x-1 inline-block"
                >
                  Actualités
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h4 className="font-bold text-slate-800 mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:w-8 after:h-1 after:bg-(--aduti-primary)/30 after:rounded-full">
              Ressources
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="/members"
                  className="hover:text-aduti-primary transition-all hover:translate-x-1 inline-block"
                >
                  Annuaire
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-aduti-primary transition-all hover:translate-x-1 inline-block"
                >
                  Offres d&apos;emploi
                </Link>
              </li>
              <li>
                <Link
                  href="/activities"
                  className="hover:text-aduti-primary transition-all hover:translate-x-1 inline-block"
                >
                  Galerie Photo
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-aduti-primary transition-all hover:translate-x-1 inline-block"
                >
                  Documents
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h4 className="font-bold text-slate-800 mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:w-8 after:h-1 after:bg-(--aduti-primary)/30 after:rounded-full">
              Contact & Réseaux
            </h4>
            <ul className="space-y-4 text-sm text-slate-500 flex flex-col items-center md:items-start">
              <li className="flex items-start gap-2">
                <MaterialIcon name="location_on" className="w-[18px] h-[18px] mt-0.5 text-aduti-primary" />
                <span>
                  INP-HB Centre, Yamoussoukro,
                  <br />
                  Côte d&apos;Ivoire
                </span>
              </li>
              <li className="flex items-center gap-2 group">
                <MaterialIcon name="mail" className="w-[18px] h-[18px] group-hover:scale-110 transition-transform text-aduti-primary" />
                <Link
                  href="mailto:contact@aduticsi.com"
                  className="hover:text-aduti-primary transition-colors inline-block"
                >
                  contact@aduticsi.com
                </Link>
              </li>
              <li className="flex items-center gap-2 group pt-2 border-t border-slate-50 w-full justify-center md:justify-start">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                <Link
                  href="https://www.linkedin.com/company/association-des-dut-et-dts-en-informatique-de-l-inp-hb-aduti/"
                  target="_blank" rel="noopener noreferrer"
                  className="hover:text-[#0077b5] transition-colors inline-block font-medium"
                >
                  ADUTI INP-HB
                </Link>
              </li>
              <li className="flex items-center gap-2 group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform text-[#E1306C]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <Link
                  href="https://www.instagram.com/aduticsi?igsh=enF6ejl5bzY3bm1n"
                  target="_blank" rel="noopener noreferrer"
                  className="hover:text-[#E1306C] transition-colors inline-block font-medium"
                >
                  @aduticsi
                </Link>
              </li>
              <li className="flex items-center gap-2 group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                <Link
                  href="https://www.facebook.com/share/1ERtvdnwfR/"
                  target="_blank" rel="noopener noreferrer"
                  className="hover:text-[#1877F2] transition-colors inline-block font-medium"
                >
                  Notre Page
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} ADUTI Yamoussoukro. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://www.facebook.com/share/1ERtvdnwfR/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-white hover:bg-[#1877F2] transition-all duration-300 hover:-translate-y-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
            </Link>
            <Link
              href="https://www.instagram.com/aduticsi?igsh=enF6ejl5bzY3bm1n"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-white hover:bg-[#E1306C] transition-all duration-300 hover:-translate-y-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </Link>
            <Link
              href="https://www.linkedin.com/company/association-des-dut-et-dts-en-informatique-de-l-inp-hb-aduti/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-white hover:bg-[#0077b5] transition-all duration-300 hover:-translate-y-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
