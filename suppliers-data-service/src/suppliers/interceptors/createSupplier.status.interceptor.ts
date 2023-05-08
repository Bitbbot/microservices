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
export class ResponseStatusInterceptor implements NestInterceptor {
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
    console.log('Request body:', body);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('here');

    return next.handle().pipe(
      tap((response) => {
        response
          .then(() => {
            console.log('Response Status OK');
          })
          .catch(() => {
            this.handleError(context);
            console.log('error');
          });
      }),
      catchError((err) => {
        this.handleError(context);
        throw err;
      }),
    );
  }
}
