import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/security/guards/roles.decorator';

@Controller()
@UseGuards(AuthGuard('jwt'))
@Roles('ADMIN', 'OWNER')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  findAll(
    @Query('page') page?: 1,
    @Query('perPage') perPage?: 10,
    @Query('action') action?: string,
    @Query('employeeId') employeeId?: string,
    @Query('sort') sort: 'asc' | 'desc' = 'desc',
  ) {
    return this.activityLogService.findAll(
      Number(page),
      Number(perPage),
      action,
      employeeId,
      sort,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityLogService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityLogService.remove(id);
  }
}
