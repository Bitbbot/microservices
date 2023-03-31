import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';
import { Sector } from './sector.entity';
import { AggregateRoot } from '@nestjs/cqrs';

@Entity()
export class Supplier extends AggregateRoot {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  vatNumber: number;

  @Column()
  name: string;

  @Column()
  country: string;

  @OneToMany(() => Role, (role) => role.supplier, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  roles: Role[];

  @OneToMany(() => Sector, (sector) => sector.supplier, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  sectors: Sector[];
}
