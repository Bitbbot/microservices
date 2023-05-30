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
export class UpdateSupplierInterceptor implements NestInterceptor {
  constructor(@Inject('CERT_SERVICE') private client: ClientKafka) {}

  handleError(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const body = request.body;
    if (body.fileIds && body.fileIds.length > 0)
      this.client.emit<number>('delete_certificate', {
        supplierId: body.id,
        fileIds: body.fileIds,
      });
  }

  handleSuccess(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const body = request.body;
    if (body.deleteFiles && body.deleteFiles.length > 0) {
      this.client.emit<number>('delete_certificate', {
        supplierId: body.id,
        fileIds: body.deleteFiles,
      });
    }
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
        this.handleError(context);
        throw err;
      }),
    );
  }
}
