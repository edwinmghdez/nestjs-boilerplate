import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDto } from '../users/dto/user.dto';
import * as dotenv from "dotenv";
import { FullUserDto } from '../users/dto/full-user.dto';
import { createHmac } from 'crypto';
import { I18nService } from 'nestjs-i18n';

dotenv.config();

@Injectable()
export class MailService
{
  constructor(
    private mailerService: MailerService,
    private i18n: I18nService
  ) {}

  async sendUserConfirmation(user: UserDto)
  {
    const hash = createHmac('sha1', user.email).digest('hex');
    const url = process.env.APP_BASE_URL+`api/v1/auth/verify/${user.id}/${hash}`;

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: user.email,
      subject: this.i18n.t('common.email_confirmation.SUBJECT'),
      template: 'email-confirmation.template.hbs',
      context: {
        url: url,
        app_name: process.env.APP_NAME,
        hello: this.i18n.t('common.email_common.HELLO', { args: { name: user.name } }),
        intro: this.i18n.t('common.email_confirmation.INTRO'),
        button: this.i18n.t('common.email_confirmation.BUTTON'),
        ignore: this.i18n.t('common.email_confirmation.IGNORE'),
        sign_off: this.i18n.t('common.email_common.SIGN_OFF', { args: { app_name: process.env.APP_NAME } })
      },
    }

    await this.mailerService.sendMail(mailOptions);
  }

  async sendPasswordRequestChange(user: FullUserDto, token: string)
  {
    const url = process.env.APP_BASE_URL+`api/v1/auth/password-reset/recovery/${token}?email=${user.email}`;

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: user.email,
      subject: this.i18n.t('common.email_password_request.SUBJECT'),
      template: 'password-request-change.template.hbs',
      context: {
        url: url,
        app_name: process.env.APP_NAME,
        hello: this.i18n.t('common.email_common.HELLO', { args: { name: user.name } }),
        intro: this.i18n.t('common.email_password_request.INTRO'),
        button: this.i18n.t('common.email_password_request.BUTTON'),
        ignore: this.i18n.t('common.email_password_request.IGNORE'),
        sign_off: this.i18n.t('common.email_common.SIGN_OFF')
      },
    }

    await this.mailerService.sendMail(mailOptions);
  }

  async sendPasswordRestoredSuccessfully(user: FullUserDto)
  {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: user.email,
      subject: this.i18n.t('common.email_password_restored.SUBJECT'),
      template: 'password-restored-successfully.template.hbs',
      context: {
        app_name: process.env.APP_NAME,
        hello: this.i18n.t('common.email_common.HELLO', { args: { name: user.name } }),
        intro: this.i18n.t('common.email_password_restored.INTRO'),
        warning: this.i18n.t('common.email_password_restored.WARNING'),
        sign_off: this.i18n.t('common.email_common.SIGN_OFF')
      },
    }

    await this.mailerService.sendMail(mailOptions);
  }
}
