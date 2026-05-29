import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiEnvelope<T> {
  statusCode: number;
  message: string;
  body: T | null;
}

// Wraps GET responses in a uniform { statusCode, message, body } envelope.
// Other verbs (POST/PATCH/PUT/DELETE) are passed through untouched so that
// auth responses keep returning tokens at the top level.
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, T | ApiEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | ApiEnvelope<T>> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();

    if (request.method !== 'GET') {
      return next.handle();
    }

    const response = http.getResponse<Response>();
    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        message: 'Success',
        body: data ?? null,
      })),
    );
  }
}
