/**
 * Phrase decrivant la validite des liens envoyes par email.
 *
 * Aucune duree chiffree n'est annoncee : elle depend de GOTRUE_MAILER_OTP_EXP,
 * reglage cote Supabase commun a tous les emails de GoTrue et hors de portee
 * de l'application. Annoncer un nombre ici reviendrait a promettre un delai
 * que le code ne controle pas.
 *
 * Pour afficher une duree precise, aligner cette constante sur la valeur reelle
 * de GOTRUE_MAILER_OTP_EXP, par exemple "48 heures" pour 172800.
 */
export const MAIL_LINK_VALIDITY_SENTENCE =
  "Ce lien est à usage unique et sa durée de validité est limitée.";
