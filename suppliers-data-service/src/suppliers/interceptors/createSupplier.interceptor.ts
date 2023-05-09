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

  //send a message to kafka to delete saved certificates
  handleError(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const body = request.body;
    if (body.fileIds.length > 0)
      this.client.emit<number>('delete_certificate', {
        supplierId: body.id,
        fileIds: body.fileIds,
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
