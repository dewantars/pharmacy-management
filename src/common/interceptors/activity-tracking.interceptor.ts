/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { ActivityLogService } from '../../module/logs-module/activity-log.service.js';
import { CreateActivityLogDto } from '../../module/logs-module/dto/create-activity-log.dto.js';

@Injectable()
export class ActivityTrackingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ActivityTrackingInterceptor.name);

  constructor(private logService: ActivityLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, user, body, params, url } = request;

    const isMutating = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(
      <string>method,
    );

    return next.handle().pipe(
      tap(() => {
        if (isMutating && user) {
          const resourceId = params?.id ? String(params.id) : 'unknown';
          const resourceType = url.split('/') || 'unknown';

          const createPayload: CreateActivityLogDto = {
            action: method,
            employeeId: user.id,
            resourceType: resourceType[3] ?? resourceType[2],
            resourceId: resourceId,
            payloadData: body as Record<string, any>,
          };

          this.logger.debug(createPayload);

          this.logService.create(createPayload).catch((err) => {
            this.logger.error('Failed to write activity log', err);
          });
        }
      }),
    );
  }
}
