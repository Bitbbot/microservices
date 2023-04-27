import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersResolver } from './suppliers.resolver';

@Module({
  providers: [SuppliersResolver, SuppliersService]
})
export class SuppliersModule {}
