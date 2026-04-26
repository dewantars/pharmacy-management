import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Medicines } from '../../medicine-module/medicine-order/interfaces/medicines.interface.js';

export class CreateTransactionDto {
  @IsNotEmpty({
    message: 'transaction date is required',
  })
  @Type(() => Date)
  @IsDate()
  readonly transactionDate!: Date;

  @IsNotEmpty({
    message: 'cash transaction is required',
  })
  @Type(() => Number)
  @IsNumber()
  cashReceived!: number;

  @IsOptional({
    message: 'discount is optional',
  })
  @Type(() => Number)
  @IsNumber()
  discount?: number;

  @IsOptional({
    message: 'cashier is optional',
  })
  @IsUUID('all')
  employeeId!: string;

  @IsNotEmpty({
    message: 'medicines to sale is required',
  })
  medicines!: Array<Medicines>;
}
