import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  public email?: string;

  @IsString()
  @IsOptional()
  public role?: string;

  @IsBoolean()
  @IsOptional()
  public isActive?: boolean;

  @IsNumber()
  @IsNotEmpty()
  public organizationId: number;
}
