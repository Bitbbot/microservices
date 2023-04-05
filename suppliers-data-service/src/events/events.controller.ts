import { Controller, Get } from '@nestjs/common';
import { EventRepository } from './repositories/events.repository';

@Controller('events')
export class EventsController {
  constructor(private readonly repository: EventRepository) {}

  @Get()
  async findEvents() {
    return this.repository.getEvents();
  }
}
