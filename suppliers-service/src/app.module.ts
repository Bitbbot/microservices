import { Module } from '@nestjs/common';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SuppliersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
