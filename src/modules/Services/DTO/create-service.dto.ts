import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the service',
    example: 'Premium Cleaning',
  })
  public name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'A brief description of the service',
    example: 'A premium cleaning service for offices and homes',
  })
  public description?: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'The duration of the service in minutes',
    example: 120,
  })
  public durationMinutes: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({
    description: 'The pause period in minutes between services. Optional',
    example: 15,
  })
  public pausePeriodMinutes?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the service is active. Optional',
    example: true,
  })
  public isActive?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({
    description: 'The cost of the service. Optional',
    example: 99.99,
  })
  public cost?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The ID of the organization offering the service',
    example: 1,
  })
  public organizationId?: number;
}
