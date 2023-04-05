import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/events/event.entity';
import { BaseSupplier } from '../../shared/interfaces/base-supplier';

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(Event, 'events')
    private readonly eventRepo: Repository<Event>,
  ) {}

  async getEvents() {
    return this.eventRepo.find();
  }

  async createEvent(event: BaseSupplier, name: string) {
    const newEvent = this.eventRepo.create({
      supplierId: event.id,
      event: name,
      traceId: event.traceId,
      data: {
        vatNumber: event.vatNumber,
        name: event.name,
        country: event.country,
        roles: event.roles,
        sectors: event.sectors,
      },
    });
    return this.eventRepo.save(newEvent);
  }
}
