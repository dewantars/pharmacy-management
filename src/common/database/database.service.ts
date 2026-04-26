import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    const adapter = new PrismaPg({
      database: configService.get<string>('POSTGRE_DB'),
      host: configService.get<string>('POSTGRE_HOST'),
      port: Number(configService.get<number>('POSTGRE_PORT')),
      user: configService.get<string>('POSTGRE_USER'),
      password: configService.get<string>('POSTGRE_PASSWORD'),
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}