import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
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
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthGuards } from './guards/auth.guards';
import { ResponseStatusInterceptor } from './interceptors/createSupplier.status.interceptor';
import { Observable, of } from 'rxjs';

@Controller('suppliers')
@UseGuards(AuthGuards)
export class SuppliersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get()
  findAll(): Promise<SupplierInterface[]> {
    this.logger.log('getAllSuppliers', SuppliersController.name);
    return this.queryBus.execute(new GetSuppliersQuery());
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SupplierInterface> {
    console.log('get');
    this.logger.log(`getOneSupplier {id:${id}}`, SuppliersController.name);
    return this.queryBus.execute(new GetSupplierQuery(id));
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ResponseStatusInterceptor)
  create(
    @Body() supplierDto: SupplierDto,
    @TraceId() traceId: string,
  ): Observable<any> {
    this.logger.log(
      `getOneSupplier {supplier:${JSON.stringify(supplierDto)}}`,
      SuppliersController.name,
    );
    return of(
      this.commandBus.execute(
        new AddSupplierCommand(
          supplierDto.id,
          supplierDto.name,
          supplierDto.country,
          supplierDto.vatNumber,
          supplierDto.roles,
          supplierDto.sectors,
          traceId,
        ),
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
