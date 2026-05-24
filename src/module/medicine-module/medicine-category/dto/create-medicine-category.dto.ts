import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMedicineCategoryDto {
  @IsNotEmpty({
    message: 'medicine category name is required',
  })
  readonly categoryName!: string;

  @IsOptional()
  @MinLength(7, {
    message: 'medicine category description must be greater than 7 character',
  })
  readonly description!: string;
}
