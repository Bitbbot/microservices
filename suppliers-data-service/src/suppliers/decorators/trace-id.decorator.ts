import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isUUID } from 'class-validator';

export const TraceId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (isUUID(request.headers.traceid)) return request.headers.traceid;
    throw new HttpException("traceId isn't provided", HttpStatus.BAD_REQUEST);
  },
);
