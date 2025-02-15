import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PreOrdersService } from './pre_orders.service';
import { CreatePreOrdersDto, ProductsEntity } from '@/_dtos';
import { UpdatePreOrdersDto } from '@/_dtos';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'auth/roles/roles.guard';
import { Roles } from 'auth/roles/roles.decorator';
import { Role } from 'auth/roles/roles.enum';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PreOrdersEntity } from '@/_dtos';
import { ResponseInterceptor } from 'interceptors/response.interceptor';
import { EmailsService } from '@/_services/emails/emails.service';
import { TelegramService } from '@/_services/telegram/telegram.service';

@Controller('pre-orders')
@ApiTags('Pre Orders')
export class PreOrdersController {
  constructor(
    private readonly preOrdersService: PreOrdersService,
    private readonly emailsService: EmailsService,
    private readonly telegramService: TelegramService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: PreOrdersEntity })
  async create(@Body() createPreOrdersDto: CreatePreOrdersDto) {
    await fetch('https://api.telegram.org')
      .then((res) => console.log('Success', res.status))
      .catch((err) => console.error('Fetch error:', err));

    const result = await this.preOrdersService.create(createPreOrdersDto);

    console.log('pre-order was put to DB');

    if (result) {
      try {
        console.log('sending email to', result.user_email);
        await this.emailsService.sendPreOrderCreatedEmail({
          to: result.user_email,
          customerName: result.user_full_name,
        });
      } catch (error) {
        console.error('Error while sending email', error);
      }

      const product = result.product as unknown as ProductsEntity;

      try {
        console.log('sending telegram message');
        await this.telegramService.sendMessage(
          `You got a new pre-order! From ${result.user_full_name} (${result.user_email}) about ${product.title} x ${result.product_quantity}`,
        );
      } catch (error) {
        console.error('Error while sending telegram message', error);
      }
    }

    return result;
  }

  @Get()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({ type: PreOrdersEntity, isArray: true })
  @UseInterceptors(ResponseInterceptor)
  findAll() {
    return this.preOrdersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({ type: PreOrdersEntity })
  findOne(@Param('id') id: string) {
    return this.preOrdersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({ type: PreOrdersEntity })
  update(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdatePreOrdersDto,
  ) {
    return this.preOrdersService.update(id, updateProductCategoryDto);
  }
}
