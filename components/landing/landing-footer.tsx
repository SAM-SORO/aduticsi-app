import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin } from "lucide-react";

const socialLinks = [
  {
    href: "https://www.facebook.com/share/1ERtvdnwfR/",
    label: "Facebook",
    detail: "Notre Page",
    icon: Facebook,
  },
  {
    href: "https://www.instagram.com/aduticsi?igsh=enF6ejl5bzY3bm1n",
    label: "Instagram",
    detail: "@aduticsi",
    icon: Instagram,
  },
  {
    href: "https://www.linkedin.com/company/association-des-dut-et-dts-en-informatique-de-l-inp-hb-aduti/",
    label: "LinkedIn",
    detail: "ADUTI INP-HB",
    icon: Linkedin,
  },
] as const;

const usefulLinks = [
  { href: "/about", label: "À propos" },
  { href: "/members", label: "Membres" },
  { href: "/activities", label: "Activités & actualités" },
  { href: "/contact", label: "Contact" },
] as const;

export function LandingFooter() {
  return (
    <footer className="landing-v14 landing-v14-footer" id="contact">
      <svg
        className="landing-v14-footer-network"
        viewBox="0 0 1600 760"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1.1">
          <path d="M0 110 105 30 255 96 430 22 625 92 810 34 980 130 1190 42 1390 108 1600 24" />
          <path d="M0 250 150 180 340 255 545 170 720 268 920 185 1125 305 1310 215 1600 290" />
          <path d="M0 445 200 365 390 458 590 375 790 505 990 405 1210 530 1450 410 1600 470" />
          <path d="M0 620 210 540 420 640 640 565 870 682 1100 570 1330 650 1600 575" />
          <path d="M130 0 220 140 90 250 240 400 100 560" />
          <path d="M520 0 610 150 500 300 650 430 540 650" />
          <path d="M1010 0 1115 170 1030 330 1180 470 1090 690" />
          <path d="M1440 0 1510 170 1380 315 1530 500 1450 760" />
        </g>
        <g className="landing-v14-footer-network-accent" fill="none" strokeWidth="1.3">
          <path d="M0 42 82 82 148 26 245 62" />
          <path d="M420 0 500 62 552 20 640 74" />
          <path d="M1235 0 1290 98 1390 52 1498 120" />
          <path d="M0 500 70 548 168 510 242 585" />
          <path d="M1250 490 1345 548 1455 520 1600 612" />
        </g>
        <g className="landing-v14-footer-network-nodes">
          <circle cx="82" cy="82" r="4" />
          <circle cx="500" cy="62" r="4" />
          <circle cx="1290" cy="98" r="4" />
          <circle cx="70" cy="548" r="4" />
          <circle cx="1345" cy="548" r="4" />
        </g>
      </svg>

      <div className="landing-v14-container landing-v14-footer-inner">
        <div className="landing-v14-footer-top">
          <section className="landing-v14-footer-column landing-v14-footer-news">
            <h2>Restez informé&nbsp;!</h2>
            <span className="landing-v14-footer-redline" aria-hidden="true" />
            <p>
              Retrouvez les activités, événements et actualités qui font vivre la communauté ADUTI.
            </p>
            <Link className="landing-v14-footer-news-link" href="/activities">
              Consulter les actualités <span aria-hidden="true">→</span>
            </Link>
          </section>

          <section className="landing-v14-footer-column">
            <h2>Contact</h2>
            <span className="landing-v14-footer-redline" aria-hidden="true" />
            <div className="landing-v14-footer-contact-list">
              <a href="mailto:contact@aduticsi.com">
                <Mail aria-hidden="true" />
                <span>contact@aduticsi.com</span>
              </a>
              <a
                href="https://maps.google.com/?q=INPHB+Yamoussoukro+Centre"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin aria-hidden="true" />
                <span>
                  INP-HB Centre, Yamoussoukro,
                  <br />
                  Côte d’Ivoire
                </span>
              </a>
              <p>Association des DUT/DTS en Informatique de l’INP-HB</p>
            </div>
          </section>

          <section className="landing-v14-footer-column">
            <h2>Suivez-nous</h2>
            <span className="landing-v14-footer-redline" aria-hidden="true" />
            <div className="landing-v14-footer-social-list">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                    <span className="landing-v14-footer-social-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span>{social.detail}</span>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="landing-v14-footer-column">
            <h2>Liens utiles</h2>
            <span className="landing-v14-footer-redline" aria-hidden="true" />
            <nav className="landing-v14-footer-link-list" aria-label="Liens utiles">
              {usefulLinks.map((link) => (
                <Link href={link.href} key={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link className="landing-v14-footer-member-link" href="/auth/login">
              Espace membre <span aria-hidden="true">→</span>
            </Link>
          </section>
        </div>

        <div className="landing-v14-footer-brandzone">
          <div className="landing-v14-footer-watermark" aria-hidden="true">
            ADUTI
          </div>
          <div className="landing-v14-footer-brandcore">
            <p className="landing-v14-footer-slogan">
              Promouvoir l’informatique, valoriser les talents et construire ensemble l’excellence.
            </p>
            <div className="landing-v14-footer-brandrow">
              <div className="landing-v14-footer-school">
                <span className="landing-v14-footer-school-logo">
                  <Image src="/image_logo_esi.png" alt="Logo ESI" fill sizes="48px" />
                </span>
                <span>École Supérieure d’Industrie</span>
              </div>

              <Link className="landing-v14-footer-logo" href="/" aria-label="Accueil ADUTI">
                <Image src="/logo_association.jpeg" alt="Logo ADUTI" fill sizes="190px" />
              </Link>

              <div className="landing-v14-footer-school is-right">
                <span className="landing-v14-footer-school-logo">
                  <Image src="/image_logo_inphb.png" alt="Logo INP-HB" fill sizes="48px" />
                </span>
                <span>INP-HB</span>
              </div>
            </div>
            <p className="landing-v14-footer-fulltitle">
              Association des DUT/DTS en Informatique de l’INP-HB
            </p>
          </div>
        </div>

        <div className="landing-v14-footer-bottomline" aria-hidden="true">
          <span className="is-white" />
          <span className="is-red" />
          <span className="is-white" />
          <span className="is-blue" />
        </div>
        <p className="landing-v14-footer-copy">
          © {new Date().getFullYear()} ADUTI Yamoussoukro. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
