import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  // UseGuards,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from 'auth/roles/roles.guard';
// import { Roles } from 'auth/roles/roles.decorator';
// import { Role } from 'auth/roles/roles.enum';
import {
  ApiBody,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  // ApiBearerAuth,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionCreateByTypeDto, SubscriptionsByIdDto } from './dtos';
import { SubscriptionsDto } from '@/_dtos';
import { UsersService } from '../users/users.service';
import { TelegramService } from '@/_services/telegram/telegram.service';

@Controller('subscriptions')
@ApiTags('Subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly usersService: UsersService,
    private readonly telegramService: TelegramService,
  ) {}

  @Post('/create-by-type')
  @ApiBody({ type: SubscriptionCreateByTypeDto })
  @ApiOkResponse({
    type: SubscriptionsDto,
  })
  async createSubscriptionByType(
    @Body() createSubscriptionDto: SubscriptionCreateByTypeDto,
  ) {
    let user = await this.usersService.findUnique({
      where: { email: createSubscriptionDto.email },
    });
    if (!user) {
      user = await this.usersService.createUser({
        email: createSubscriptionDto.email,
        first_name: createSubscriptionDto.first_name,
        ...(createSubscriptionDto.instagram
          ? { instagram: createSubscriptionDto.instagram }
          : {}),
      });
    }

    const subscriptionExists =
      await this.subscriptionsService.findOneByTypeAndByUserId({
        user_id: user.id,
        type: createSubscriptionDto.type,
      });

    if (subscriptionExists) {
      const updatedSubscription =
        await this.subscriptionsService.toggleIsActive(
          subscriptionExists.id,
          true,
        );

      return updatedSubscription;
    }

    // Telegram message
    try {
      await this.telegramService.sendMessage(
        `New subscription request:\nEmail: ${createSubscriptionDto.email}\nFirst name: ${createSubscriptionDto.first_name}\nType: ${createSubscriptionDto.type}`,
      );
    } catch (error) {
      console.error('Error while sending telegram message', error);
    }

    return this.subscriptionsService.create({
      user_id: user.id,
      type: createSubscriptionDto.type,
      is_active: true,
    });
  }

  // @Get()
  // @ApiBearerAuth()
  // @Roles(Role.ADMIN)
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @ApiCreatedResponse({ type: SubscriptionsDto, isArray: true })
  // findAll() {
  //   return this.subscriptionsService.findAll();
  // }

  @Get(':id')
  @ApiCreatedResponse({
    type: SubscriptionsByIdDto,
    isArray: true,
  })
  allSubscriptionById(@Param('id') id: string) {
    return this.subscriptionsService.findAllById(id);
  }

  @Delete(':id')
  @ApiOkResponse({ type: SubscriptionsByIdDto })
  update(@Param('id') id: string) {
    return this.subscriptionsService.toggleIsActive(id, false);
  }
}
