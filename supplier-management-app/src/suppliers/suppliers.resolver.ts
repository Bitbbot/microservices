import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { UpdateSupplierInput } from './dto/update-supplier.input';
import { IResponse } from './entities/response';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { map } from 'rxjs';

@Resolver(() => Supplier)
export class SuppliersResolver {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Mutation(() => IResponse)
  @UsePipes(new ValidationPipe())
  async createSupplier(
    @Args('createSupplierInput') createSupplierInput: CreateSupplierInput,
  ) {
    try {
      return (await this.suppliersService.create(createSupplierInput)).pipe(
        map((data) => data),
      );
    } catch (error) {
      return { status: 500, message: error };
    }
  }

  @Query(() => [Supplier], { name: 'suppliers', nullable: true })
  async findAll() {
    try {
      return (await this.suppliersService.findAll()).pipe(map((data) => data));
    } catch (error) {
      return { status: 500, message: error };
    }
  }

  @Query(() => Supplier, { name: 'supplier', nullable: true })
  async findOne(@Args('id', { type: () => String }) id: string) {
    try {
      return (await this.suppliersService.findOne(id)).pipe(
        map((data) => data),
      );
    } catch (error) {
      return { status: 500, message: error };
    }
  }

  @Mutation(() => IResponse)
  async updateSupplier(
    @Args('updateSupplierInput') updateSupplierInput: UpdateSupplierInput,
  ) {
    try {
      return (await this.suppliersService.update(updateSupplierInput)).pipe(
        map((data) => data),
      );
    } catch (error) {
      return { status: 500, message: error };
    }
  }

  @Mutation(() => IResponse)
  async removeSupplier(@Args('id', { type: () => String }) id: string) {
    try {
      return (await this.suppliersService.remove(id)).pipe(map((data) => data));
    } catch (error) {
      return { status: 500, message: error };
    }
  }
}
