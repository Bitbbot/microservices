import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Supplier } from './supplier.entity';
import { JoinColumn } from 'typeorm';
import { AggregateRoot } from '@nestjs/cqrs';

@Entity()
export class Role extends AggregateRoot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.roles, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  supplier: Supplier;
}
