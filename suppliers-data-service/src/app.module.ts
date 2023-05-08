import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Event } from './events/entities/events/event.entity';
import { SuppliersModule } from './suppliers/suppliers.module';
import { Supplier } from './suppliers/entities/queries/supplier.entity';
import { Sector } from './suppliers/entities/queries/sector.entity';
import { Role } from './suppliers/entities/queries/role.entity';
import { EventsModule } from './events/events.module';

const defaultOptions = () => {
  return {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    synchronize: true,
    host: process.env.POSTGRES_HOST,
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions(),
      port: Number(process.env.POSTGRES_EVENTS_PORT),
      type: 'postgres',
      name: 'events',
      entities: [Event],
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions(),
      port: Number(process.env.POSTGRES_QUERIES_PORT),
      type: 'postgres',
      name: 'queries',
      entities: [Supplier, Sector, Role],
    }),
    WinstonModule.forRoot({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    }),
    SuppliersModule,
    EventsModule,
  ],
})
export class AppModule {}
