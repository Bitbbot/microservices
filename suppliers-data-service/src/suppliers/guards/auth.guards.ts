import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuards implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return (
      request.headers.login === process.env.SUPPLIERS_DATA_SERVICE_LOGIN &&
      request.headers.password === process.env.SUPPLIERS_DATA_SERVICE_PASSWORD
    );
  }
}
