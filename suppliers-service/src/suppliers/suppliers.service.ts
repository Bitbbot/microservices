import { Injectable } from '@nestjs/common';

@Injectable()
export class SuppliersService {
  public accumulate(data: number[]): number {
    console.log('here');
    return (data || []).reduce((a, b) => Number(a) + Number(b));
  }
}
