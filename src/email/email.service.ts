import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly appUrl: string;

  constructor(
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    this.appUrl = this.config.get<string>(
      'APP_URL',
      'https://support.oracle.com',
    );
  }

  private async send(
    to: string,
    template: string,
    subject: string,
    context: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.mailer.sendMail({
        to,
        subject,
        template,
        context: {
          ...context,
          subject,
          appUrl: this.appUrl,
          unsubscribeUrl: `${this.appUrl}/unsubscribe`,
          currentYear: new Date().getFullYear(),
        },
      });
      this.logger.log(`Email [${template}] sent to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send [${template}] to ${to}`, err);
      throw err;
    }
  }

  // ─── Public methods (one per template) ──────────────────────────────────────

  /** OTP / magic-code login */
  async sendOtp(to: string, otp: string, userName: string): Promise<void> {
    await this.send(to, 'otp-login', 'Your SmartSpend Login Code', {
      userName,
      otp,
      expiresInMinutes: 10,
    });
  }

  /** Forgot-password reset link */
  async sendForgotPassword(
    to: string,
    userName: string,
    resetUrl: string,
  ): Promise<void> {
    await this.send(to, 'forgot-password', 'Reset Your SmartSpend Password', {
      userName,
      resetUrl,
      expiresInHours: 1,
    });
  }

  /** Post-registration welcome */
  async sendWelcome(to: string, userName: string): Promise<void> {
    await this.send(to, 'welcome', 'Welcome to SmartSpend! ', {
      userName,
      dashboardUrl: `${this.appUrl}/dashboard`,
    });
  }

  /** Confirmation after a successful password change */
  async sendPasswordChanged(to: string, userName: string): Promise<void> {
    await this.send(
      to,
      'password-changed',
      'Your SmartSpend Password Was Changed',
      {
        userName,
        supportUrl: `${this.appUrl}/help`,
        changedAt: new Date().toUTCString(),
      },
    );
  }

  /** Account locked after too many failed attempts */
  async sendAccountLocked(
    to: string,
    userName: string,
    unlockUrl: string,
  ): Promise<void> {
    await this.send(
      to,
      'account-locked',
      'Your SmartSpend Account Has Been Locked',
      {
        userName,
        unlockUrl,
        supportUrl: `${this.appUrl}/help`,
      },
    );
  }
}
