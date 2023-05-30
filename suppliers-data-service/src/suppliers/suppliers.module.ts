import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersController } from './suppliers.controller';
import { Role } from './entities/queries/role.entity';
import { Sector } from './entities/queries/sector.entity';
import { Supplier } from './entities/queries/supplier.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { SupplierRepository } from './repositories/supplier.repository';
import { EventsModule } from '../events/events.module';
import { EventHandlers } from './events/handlers';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    CqrsModule,
    TypeOrmModule.forFeature([Role, Sector, Supplier], 'queries'),
    forwardRef(() => EventsModule),
  ],
  controllers: [SuppliersController],
  providers: [
    SupplierRepository,
    ...EventHandlers,
    {
      provide: 'CERT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const kafkaOptions: KafkaOptions = {
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get('KAFKA_CLIENT_ID'),
              brokers: [String(configService.get('BROKER_URL'))],
            },
            consumer: {
              groupId: String(configService.get('KAFKA_CONSUMER_GROUP_ID')),
            },
          },
        };
        return ClientProxyFactory.create(kafkaOptions);
      },
      inject: [ConfigService],
    },
  ],
  exports: [SupplierRepository],
})
export class SuppliersModule {}
