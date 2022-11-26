import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { SendDto } from './dto/send.dto';

@Injectable()
export class AppService {
  constructor(
    private mailerService: MailerService,
    private configSerice: ConfigService,
  ) {}

  async send(data: SendDto): Promise<any> {
    return await this.mailerService
      .sendMail({
        to: data.email,
        from: `"ali gamal" <${this.configSerice.get<string>('MAIL_USER')}>`,
        subject: 'Welcome',
        template: join(__dirname, 'templates', 'user-activation.hbs'),
        context: {
          url: 'cf1a3f828287',
          name: data.name,
        },
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log('error=', error);
        throw new BadRequestException('failed to send email, ', error.message);
      });
  }
}