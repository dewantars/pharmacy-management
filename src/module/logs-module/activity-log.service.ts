import { Injectable, Logger } from '@nestjs/common';
import { CreateActivityLogDto } from './dto/create-activity-log.dto.js';
import {
  PaginatedResult,
  paginator,
} from '../../common/helpers/pagination/pagination';
import {
  ActivityLog,
  Prisma,
} from '../../common/database/generated/prisma/client.js';
import { DatabaseService } from '../../common/database/database.service';

const paginate = paginator({ perPage: 10 });

type ActivityLogsWithRelation = Prisma.ActivityLogGetPayload<{
  include: { employee: true };
}>;

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);
  constructor(private prisma: DatabaseService) {}

  async create(dto: CreateActivityLogDto): Promise<ActivityLog> {
    return await this.prisma.activityLog.create({
      data: dto,
    });
  }

  async findAll(
    page: number,
    perPage: number,
    action?: string,
    employeeId?: string,
    sort: 'asc' | 'desc' = 'desc',
  ): Promise<PaginatedResult<ActivityLog>> {
    return await paginate(
      this.prisma.activityLog,
      {
        where: {
          ...(action && {action}),
          ...(employeeId && {employeeId}),
        },
        orderBy: {
          createdAt: sort,
        },
      },
      { page, perPage },
    );
  }

  async findOne(id: string): Promise<ActivityLogsWithRelation> {
    return await this.prisma.activityLog.findUniqueOrThrow({
      where: { id },
      include: {
        employee: true,
      },
    });
  }

  async remove(id: string): Promise<ActivityLog> {
    return await this.prisma.activityLog.delete({
      where: { id: id },
    });
  }
}
