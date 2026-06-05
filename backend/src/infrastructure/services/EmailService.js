import nodemailer from 'nodemailer';
import { logger } from '../../shared/utils/logger.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async send({ to, subject, html }) {
    try {
      await this.transporter.sendMail({
        from: `"Consorcio SaaS" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      logger.info(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      logger.error(`Failed to send email to ${to}: ${error.message}`);
      // No lanzamos el error para que no corte el flujo principal
    }
  }
}

export const emailService = new EmailService();