import {
  IsString,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from "class-validator";

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsOptional()
  role?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
