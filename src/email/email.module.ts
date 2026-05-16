import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          secure: true,
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"SmartSpend" <${config.get<string>('MAIL_FROM', 'noreply@smartspend.in')}>`,
        },
        template: {
          // process.cwd() = project root — works in both dev (src/) and prod (dist/)
          dir: join(process.cwd(), 'src', 'templates'),
          adapter: new HandlebarsAdapter(undefined, {
            inlineCssEnabled: true,
          }),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: join(process.cwd(), 'src', 'templates', 'partials'),
            options: {
              strict: true,
            },
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
