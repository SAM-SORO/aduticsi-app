/**
 * Duree de validite des liens envoyes par email.
 *
 * GoTrue n'expose qu'un seul reglage, GOTRUE_MAILER_OTP_EXP, commun a tous ses
 * emails. Cette constante doit donc rester alignee sur sa valeur, exprimee en
 * secondes cote serveur : 48 h correspond a 172800.
 */
export const MAIL_LINK_VALIDITY_HOURS = 48;

export const MAIL_LINK_VALIDITY_LABEL = "48 heures";
