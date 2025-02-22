import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsDto } from '@/_dtos';
import { PrismaService } from 'prisma/prisma.service';
import { SubscriptionsType } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateSubscriptionsDto) {
    return this.prisma.subscriptions.create({
      data: createDto,
    });
  }

  findAll() {
    return this.prisma.subscriptions.findMany();
  }

  findAllById(id: string) {
    return this.prisma.subscriptions.findMany({
      where: { id },
      select: {
        id: true,
        type: true,
        updated_at: true,
        created_at: true,
        is_active: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.subscriptions.findUnique({ where: { id } });
  }

  findOneByTypeAndByUserId(where: {
    type: SubscriptionsType;
    user_id: string;
    is_active?: boolean;
  }) {
    return this.prisma.subscriptions.findFirst({
      where,
      select: {
        id: true,
        type: true,
        updated_at: true,
        created_at: true,
        is_active: true,
      },
    });
  }

  toggleIsActive(id: string, is_active: boolean) {
    return this.prisma.subscriptions.update({
      where: { id },
      data: { is_active },
      select: {
        id: true,
        type: true,
        updated_at: true,
        created_at: true,
        is_active: true,
      },
    });
  }
}
