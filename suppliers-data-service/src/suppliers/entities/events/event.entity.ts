import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event: string;

  @Column()
  supplierId: string;

  @Column()
  traceId: string;

  @Column({ type: 'json' })
  data: {
    vatNumber?: number;
    name: string;
    country: string;
    roles?: Array<string>;
    sectors?: Array<string>;
  };
}
