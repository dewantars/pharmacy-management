/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response as ExpressResponse } from 'express';

export interface Response<T> {
  message: string;
  data: T;
  meta: any;
}

@Injectable()
export class ResponseInterceptors<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<ExpressResponse>();

    const statusCode = response.statusCode;
    let defaultMessage: string;

    switch (request.method) {
      case 'POST':
        defaultMessage = 'Post Operation successfully.';
        break;
      case 'GET':
        defaultMessage = 'Data retrieved successfully.';
        break;
      case 'PUT':
      case 'PATCH':
        defaultMessage = 'Data updated successfully.';
        break;
      case 'DELETE':
        defaultMessage = 'Data was successfully deleted.';
        break;
      default:
        defaultMessage = 'The operation was successful.';
    }

    return next.handle().pipe(
      map((data) => {
        const message = data?.message || null;
        const meta = data?.meta || null;
        const finalData = data?.data || data;

        return {
          status: statusCode,
          message: message ?? defaultMessage,
          data: finalData,
          meta: meta,
        };
      }),
    );
  }
}
