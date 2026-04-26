import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class AuthDto {
  @IsNotEmpty({
    message: 'email is required',
  })
  @IsEmail({}, {
    message: 'Email must be an valid email',
  })
  readonly email!: string;

  @IsNotEmpty({
    message: 'password is required',
  })
  @IsStrongPassword(
    {
      minLength: 4,
      minUppercase: 2,
      minNumbers: 3,
      minLowercase: 0,
      minSymbols: 0,
    },
    {
      message:
        'password must contain at least greater than 4 characters, 2 uppercase, and 3 numbers, ex: JhonDoe-123',
    },
  )
  readonly password!: string;
}