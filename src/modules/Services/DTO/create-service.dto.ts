import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsNumber()
  @Min(0)
  public durationMinutes: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  public pausePeriodMinutes?: number;

  @IsBoolean()
  @IsOptional()
  public isActive?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  public cost?: number;

  @IsNumber()
  @IsNotEmpty()
  public organizationId: number;
}
