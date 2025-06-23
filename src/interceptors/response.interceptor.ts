import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
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
        const res = context.switchToHttp().getResponse();

        if (err instanceof TimeoutError) {
          res
            .status(HttpStatus.REQUEST_TIMEOUT)
            .send('Request has timed out. Please try again later.');
          return throwError(() => err); // завершает Observable
        }

        const statusCode = err?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message =
          err?.response?.message || err?.message || 'Internal server error';

        res.status(statusCode).send(message);
        return throwError(() => err);
      }),
    );
  }
}
