import { ContactForm } from './contact-form';
import { MaterialIcon } from "@/components/icons/material-icon";

export default function ContactPage() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-[var(--aduti-primary)] uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Contactez-nous
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight text-balance">
              Une préoccupation ?
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              L&apos;équipe de l&apos;ADUTI est à votre écoute pour toute demande
              d&apos;information, partenariat ou suggestion. Remplissez le
              formulaire ci-dessous.
            </p>
          </div>
          <ContactForm />
        </div>

        <div className="lg:w-1/3 lg:max-w-md space-y-8">
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <h3 className="font-[family-name:var(--font-display)] font-bold text-xl text-slate-900 mb-6">
              Informations directes
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[var(--aduti-primary)] shadow-sm">
                  <MaterialIcon name="location_on" className="w-[20px] h-[20px]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Adresse</h4>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Institut National Polytechnique Félix Houphouët-Boigny
                    (INP-HB)
                    <br />
                    Yamoussoukro, Côte d&apos;Ivoire
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[var(--aduti-primary)] shadow-sm">
                  <MaterialIcon name="mail" className="w-[20px] h-[20px]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Email</h4>
                  <a
                    className="text-sm text-slate-600 mt-1 block hover:text-[var(--aduti-primary)] transition-colors"
                    href="mailto:csiaduti@gmail.com"
                  >
                    csiaduti@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[var(--aduti-primary)] shadow-sm">
                  <MaterialIcon name="call" className="w-[20px] h-[20px]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Téléphone</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    +225 07 06 54 89 94
                    <br />
                    +225 07 88 10 33 88
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-4">
                Suivez-nous
              </h4>
              <div className="flex gap-3">
                <a
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all shadow-sm"
                  href="https://www.linkedin.com/company/association-des-dut-et-dts-en-informatique-de-l-inp-hb-aduti/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-all shadow-sm"
                  href="https://www.facebook.com/share/1ERtvdnwfR/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-white hover:bg-[#E1306C] hover:border-[#E1306C] transition-all shadow-sm"
                  href="https://www.instagram.com/aduticsi?igsh=enF6ejl5bzY3bm1n"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <MaterialIcon name="photo_camera" className="w-[20px] h-[20px]" />
                </a>
              </div>
            </div>
          </div>

          <div className="h-56 sm:h-64 md:h-80 bg-slate-200 rounded-2xl overflow-hidden relative shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-200 group">
            <iframe
              title="Localisation INP-HB"
              loading="lazy"
              className="grayscale group-hover:grayscale-0 transition-all duration-500"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15844.862885011209!2d-5.257645012841812!3d6.864732400000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfb8906e6d0e8baf%3A0xcbf94d3613894af7!2sInstitut%20National%20Polytechnique%20F%C3%A9lix%20Houphou%C3%ABt-Boigny%20(INPHB)!5e0!3m2!1sfr!2sci!4v1772221621000!5m2!1sfr!2sci"
            />
            <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <a
                href="https://maps.google.com/?q=INPHB+Yamoussoukro+Centre"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-100 text-xs font-bold text-slate-800 hover:text-[var(--aduti-primary)] transition-all active:scale-95"
              >
                <MaterialIcon name="open_in_new" className="w-[18px] h-[18px]" />
                Ouvrir dans Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

