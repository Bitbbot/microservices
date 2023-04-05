import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SupplierDto } from './dtos/supplier.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddSupplierCommand } from './commands/impl/add-supplier.command';
import { GetSupplierQuery } from './queries/impl/get-supplier.query';
import { GetSuppliersQuery } from './queries/impl/get-suppliers.query';
import { DeleteSupplierCommand } from './commands/impl/delete-supplier.command';
import { UpdateSupplierCommand } from './commands/impl/update-supplier.command';
import { TraceId } from './decorators/trace-id.decorator';

@Controller('suppliers')
export class SuppliersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  findAll(): Promise<SupplierInterface[]> {
    return this.queryBus.execute(new GetSuppliersQuery());
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SupplierInterface> {
    return this.queryBus.execute(new GetSupplierQuery(id));
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() supplierDto: SupplierDto, @TraceId() traceId: string) {
    return this.commandBus.execute(
      new AddSupplierCommand(
        supplierDto.id,
        supplierDto.name,
        supplierDto.country,
        supplierDto.vatNumber,
        supplierDto.roles,
        supplierDto.sectors,
        traceId,
      ),
    );
  }

  @Patch()
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Body() supplierDto: SupplierDto, @TraceId() traceId: string) {
    return this.commandBus.execute(
      new UpdateSupplierCommand(
        supplierDto.id,
        supplierDto.name,
        supplierDto.country,
        supplierDto.vatNumber,
        supplierDto.roles,
        supplierDto.sectors,
        traceId,
      ),
    );
  }

  @Delete(':id')
  async deleteOne(
    @Param('id', ParseUUIDPipe) id: string,
    @TraceId() traceId: string,
  ) {
    return this.commandBus.execute(new DeleteSupplierCommand(id, traceId));
  }
}
