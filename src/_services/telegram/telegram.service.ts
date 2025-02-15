import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TelegramService {
  private chatId: string;
  private telegramHost = 'https://api.telegram.org/bot';
  private mainHandler: string;

  constructor() {
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      throw new BadRequestException(
        'TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be defined',
      );
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    this.mainHandler = this.telegramHost + token;
  }

  async sendMessage(message: string): Promise<void> {
    try {
      const body = {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML',
      };

      await fetch(this.mainHandler + '/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('Telegram message was sent');
    } catch (error) {
      console.error('Error while sending message to Telegram', error);
    }
  }
}
