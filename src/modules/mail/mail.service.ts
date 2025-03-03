import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDto } from '../users/dto/user.dto';
import * as dotenv from "dotenv";
import { FullUserDto } from '../users/dto/full-user.dto';
import { createHmac } from 'crypto';

dotenv.config();

@Injectable()
export class MailService
{
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDto)
  {
    const hash = createHmac('sha1', user.email).digest('hex');
    const url = process.env.APP_BASE_URL+`api/v1/auth/verify/${user.id}/${hash}`;

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: user.email,
      subject: 'Confirm your email',
      template: 'email-confirmation.template.hbs',
      context: {
        url: url,
        name: user.name,
        appName: process.env.APP_NAME
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
      subject: 'Password request change',
      template: 'password-request-change.template.hbs',
      context: {
        url: url,
        name: user.name,
        appName: process.env.APP_NAME
      },
    }

    await this.mailerService.sendMail(mailOptions);
  }

  async sendPasswordRestoredSuccessfully(user: FullUserDto)
  {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: user.email,
      subject: 'Password restored successfully',
      template: 'password-restored-successfully.template.hbs',
      context: {
        name: user.name,
        appName: process.env.APP_NAME
      },
    }

    await this.mailerService.sendMail(mailOptions);
  }
}
