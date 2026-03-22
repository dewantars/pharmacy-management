import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  // UseGuards,
} from '@nestjs/common';
import { ActivityLogService } from './activity-log.service.js';
// import { AuthGuard } from '@nestjs/passport';
// import { Roles } from '../../common/security/guards/roles.decorator.js';

@Controller()
// @UseGuards(AuthGuard('jwt'))
// @Roles('ADMIN', 'OWNER')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.activityLogService.findAll(page!, perPage!);
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
