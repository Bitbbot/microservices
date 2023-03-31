import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { AggregateRoot } from '@nestjs/cqrs';

@Entity()
export class Sector extends AggregateRoot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sector: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.sectors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  supplier: Supplier;
}
