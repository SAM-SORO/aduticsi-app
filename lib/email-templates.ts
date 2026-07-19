

export function approvalEmailTemplate( loginUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1392ec;">Bienvenue à l'ADUTI</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Demande approuvée.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${loginUrl}" style="background-color: #1392ec; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">
          Se connecter
        </a>
      </div>
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