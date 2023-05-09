import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClientKafka } from '@nestjs/microservices';
import { Request } from 'express';

@Injectable()
export class DeleteSupplierInterceptor implements NestInterceptor {
  constructor(@Inject('CERT_SERVICE') private client: ClientKafka) {}

  handleSuccess(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest();
    const id = request.params.id;
    this.client.emit<number>('delete_certificate', {
      supplierId: id,
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((response) => {
        response
          .then(() => {
            this.handleSuccess(context);
          })
          .catch((error: any) => {});
      }),
      catchError((err) => {
        throw err;
      }),
    );
  }
}
