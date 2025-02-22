import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersService } from '../users/users.service';
import { TelegramService } from '@/_services/telegram/telegram.service';

@Module({
  imports: [PrismaModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, UsersService, TelegramService],
})
export class SubscriptionsModule {}
