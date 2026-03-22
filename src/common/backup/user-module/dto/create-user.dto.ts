import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import {
  ActiveStatus,
  Role,
  Shift,
} from '../../../common/database/generated/prisma/enums.js';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'User Name is required',
  })
  readonly name!: string;

  @IsNotEmpty({
    message: 'employee id is required',
  })
  readonly empId!: string;

  @IsNotEmpty({
    message: 'email is required',
  })
  @IsEmail(
    {
      allow_utf8_local_part: true,
      allow_display_name: true,
      allow_underscores: true,
      domain_specific_validation: true,
    },
    {
      message: 'Email must be an valid email',
    },
  )
  readonly email!: string;

  @IsNotEmpty({
    message: 'password is required',
  })
  @IsStrongPassword(
    {
      minLength: 4,
      minUppercase: 2,
      minNumbers: 3,
    },
    {
      message:
        'password must contain at least greater than 4 characters, 2 uppercase, and 3 numbers, ex: JhonDoe-123',
    },
  )
  password!: string;

  @IsOptional()
  @IsPhoneNumber('ID', {
    message: 'phone number an valid indonesia phone number',
  })
  readonly phoneNumber!: string;

  @IsNotEmpty({
    message: 'User Role is required',
  })
  @IsEnum(Role, {
    message:
      'USer Role is not valid choose between ADMIN, OWNER, PHARMACIST, and CASHIER',
  })
  readonly role!: Role;

  @IsNotEmpty({
    message: '',
  })
  @IsEnum(Shift)
  readonly shift!: Shift;

  @IsNotEmpty({
    message: '',
  })
  @IsEnum(ActiveStatus, {
    message: 'Active Status is not valid choose between ACTIVE and INACTIVE',
  })
  readonly status!: ActiveStatus;

  @IsOptional()
  @IsDate()
  readonly dateOfBirth!: Date;

  @IsOptional()
  @MinLength(7, {
    message: 'Address is must greater than 7 Character',
  })
  readonly address!: string;

  @IsOptional()
  profileAvatar!: string;

  @IsNotEmpty({
    message: 'employee salary is required',
  })
  @Type(() => Number)
  readonly salary!: number;

  @IsDate()
  @IsNotEmpty({
    message: 'employee start work is required',
  })
  @Type(() => Date)
  readonly startDate!: Date;
}
