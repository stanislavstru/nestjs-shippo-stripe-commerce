import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';

interface Response<T> {
  response: T;
  error: any;
  statusCode: number;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        response: data?.response || data,
        error: null,
        statusCode: context.switchToHttp().getResponse().statusCode,
      })),
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          // Возвращаем кастомный ответ
          return throwError(
            () =>
              new HttpException(
                {
                  statusCode: HttpStatus.REQUEST_TIMEOUT,
                  message: 'Request has timed out. Please try again later.',
                  error: 'TimeoutError',
                },
                HttpStatus.REQUEST_TIMEOUT,
              ),
          );
        }

        return throwError(
          () =>
            new HttpException(
              {
                response: null,
                error:
                  err?.response?.message ||
                  err?.message ||
                  'Internal server error',
                statusCode: err?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
              },
              err?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
