import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the organization',
    example: 'Tech Corp',
  })
  public name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the user who owns the organization',
    example: 1,
  })
  public ownerId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'A brief description of the organization. Optional',
    example: 'A leading technology company',
  })
  public description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the organization is active. Optional',
    example: true,
  })
  public isActive?: boolean;
}
