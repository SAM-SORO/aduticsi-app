import nodemailer from 'nodemailer';
import logger from './logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, replyTo }: EmailPayload) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'ADUTI Support'}" <${process.env.SMTP_FROM}>`,
      to,
      replyTo,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error({ error, to, subject }, 'Error sending email');
    return { success: false, error };
  }
}
