

export function approvalEmailTemplate(actionUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #13254b;">Bienvenue à l'ADUTI</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Votre demande d'adhésion a été approuvée. Il ne reste qu'une étape :
        définir votre mot de passe pour accéder à votre compte.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${actionUrl}" style="background-color: #13254b; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">
          Définir mon mot de passe
        </a>
      </div>
      <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
        Ce lien est valable un temps limité. Passé ce délai, utilisez
        « Mot de passe oublié » depuis la page de connexion.
      </p>
    </div>
  `;
}

export function rejectionEmailTemplate() {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #334155;">Information sur la demande</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Demande refusée.
      </p>
    </div>
  `;
}