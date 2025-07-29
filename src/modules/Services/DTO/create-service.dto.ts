import {
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  IsNotEmpty,
  IsOptional,
} from "class-validator";

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  durationMinutes: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  pausePeriodMinutes?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  cost?: number;
}
