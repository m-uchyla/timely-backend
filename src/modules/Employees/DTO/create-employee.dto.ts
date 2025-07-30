import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

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
