import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { FeedbackRequestsService } from './feedback_requests.service';
import { CreateFeedbackRequestsDto } from '_dtos/feedbackRequests/dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'auth/roles/roles.guard';
import { Roles } from 'auth/roles/roles.decorator';
import { Role } from 'auth/roles/roles.enum';
import { FeedbackRequestsEntity } from '_dtos/feedbackRequests/entities';
import { EmailsService } from '@/_services/emails/emails.service';
import { TelegramService } from '@/_services/telegram/telegram.service';

@ApiTags('Feedback Requests')
@Controller('feedback-requests')
export class FeedbackRequestsController {
  constructor(
    private readonly feedbackRequestsService: FeedbackRequestsService,
    private readonly emailsService: EmailsService,
    private readonly telegramService: TelegramService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: FeedbackRequestsEntity })
  async create(@Body() createFeedbackRequestDto: CreateFeedbackRequestsDto) {
    await fetch('https://api.telegram.org')
      .then((res) => console.log('Success', res.status))
      .catch((err) => console.error('Fetch error:', err));

    const result = await this.feedbackRequestsService.create(
      createFeedbackRequestDto,
    );

    if (result) {
      try {
        await this.emailsService.sendFeedbackRequestEmail({
          to: result.user_email,
          customerName: result.user_full_name,
        });
      } catch (error) {
        console.error('Error while sending email', error);
      }

      try {
        await this.telegramService.sendMessage(
          `You got a new feedback request, from ${result.user_full_name} (${result.user_email}), ${result.user_address}`,
        );
      } catch (error) {
        console.error('Error while sending telegram message', error);
      }
    }

    return result;
  }

  @Get()
  @ApiBearerAuth()
  @Roles(Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({ type: FeedbackRequestsEntity, isArray: true })
  findAll() {
    return this.feedbackRequestsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({ type: FeedbackRequestsEntity })
  findOne(@Param('id') id: string) {
    return this.feedbackRequestsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({ type: FeedbackRequestsEntity })
  update(
    @Param('id') id: string,
    @Body() updateFeedbackRequests: FeedbackRequestsEntity,
  ) {
    return this.feedbackRequestsService.update(id, updateFeedbackRequests);
  }
}
