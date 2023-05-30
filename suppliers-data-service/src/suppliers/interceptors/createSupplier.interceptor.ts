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

@Injectable()
export class CreateSupplierInterceptor implements NestInterceptor {
  constructor(@Inject('CERT_SERVICE') private client: ClientKafka) {}

  handleError(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const body = request.body;
    this.client.emit<number>('delete_certificate', {
      supplierId: body.id,
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((response) => {
        response.catch((err: any) => {
          this.handleError(context);
        });
      }),
      catchError((err) => {
        this.handleError(context);
        throw err;
      }),
    );
  }
}
