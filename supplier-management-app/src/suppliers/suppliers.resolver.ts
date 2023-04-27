import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { UpdateSupplierInput } from './dto/update-supplier.input';
import { IResponse } from './entities/response';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Resolver(() => Supplier)
export class SuppliersResolver {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Mutation(() => IResponse)
  @UsePipes(new ValidationPipe())
  createSupplier(
    @Args('createSupplierInput') createSupplierInput: CreateSupplierInput,
  ) {
    return this.suppliersService.create(createSupplierInput);
  }

  @Query(() => [Supplier], { name: 'suppliers' })
  findAll() {
    return this.suppliersService.findAll();
  }

  @Query(() => Supplier, { name: 'supplier' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.suppliersService.findOne(id);
  }

  @Mutation(() => Supplier)
  updateSupplier(
    @Args('updateSupplierInput') updateSupplierInput: UpdateSupplierInput,
  ) {
    return this.suppliersService.update(
      updateSupplierInput.id,
      updateSupplierInput,
    );
  }

  @Mutation(() => Supplier)
  removeSupplier(@Args('id', { type: () => Int }) id: number) {
    return this.suppliersService.remove(id);
  }
}
