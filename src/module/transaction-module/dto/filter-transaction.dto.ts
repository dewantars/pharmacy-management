import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export enum TransactionStatusFilter {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

export class FilterTransactionDto {
  @IsOptional()
  @IsEnum(TransactionStatusFilter, {
    message: 'status harus berupa PAID atau UNPAID',
  })
  status?: TransactionStatusFilter;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'month harus berupa angka bulat' })
  @Min(1, { message: 'month minimal 1 (Januari)' })
  @Max(12, { message: 'month maksimal 12 (Desember)' })
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'year harus berupa angka bulat' })
  @Min(2000, { message: 'year minimal 2000' })
  year?: number;
}