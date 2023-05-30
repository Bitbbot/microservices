import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Event } from './events/entities/events/event.entity';
import { SuppliersModule } from './suppliers/suppliers.module';
import { Supplier } from './suppliers/entities/queries/supplier.entity';
import { Sector } from './suppliers/entities/queries/sector.entity';
import { Role } from './suppliers/entities/queries/role.entity';
import { EventsModule } from './events/events.module';

const defaultOptions = (configService: ConfigService) => {
  return {
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    synchronize: true,
    host: configService.get<string>('POSTGRES_HOST'),
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          ...defaultOptions(configService),
          port: configService.get<number>('POSTGRES_EVENTS_PORT'),
          type: 'postgres',
          entities: [Event],
        };
      },
      name: 'events',
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...defaultOptions(configService),
        port: Number(configService.get<number>('POSTGRES_QUERIES_PORT')),
        type: 'postgres',
        entities: [Supplier, Sector, Role],
      }),
      name: 'queries',
      inject: [ConfigService],
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
