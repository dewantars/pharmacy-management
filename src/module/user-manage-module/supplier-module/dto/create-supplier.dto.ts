import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';
import { ActiveStatus } from '../../../common/database/generated/prisma/enums.js';

export class CreateSupplierDto {
  @IsNotEmpty({
    message: 'Supplier Name is required',
  })
  readonly supplierName: string;

  @IsNotEmpty({
    message: 'Phone Number is required',
  })
  @IsPhoneNumber('ID', {
    message: 'Phone Number must be an valid indonesia phone number',
  })
  readonly phoneNumber: string;

  @IsOptional()
  readonly contactPerson: string;

  @IsOptional()
  readonly contactPersonNumber: string;

  @IsNotEmpty({
    message: 'Active Status is Required',
  })
  @IsEnum(ActiveStatus, {
    message: 'Active Status is not valid choose between ACTIVE and INACTIVE',
  })
  readonly status: ActiveStatus;
  @IsNotEmpty({
    message: 'Address is Required',
  })
  @MinLength(7, {
    message: 'Address is must greater than 7 Character',
  })
  readonly address: string;
}
