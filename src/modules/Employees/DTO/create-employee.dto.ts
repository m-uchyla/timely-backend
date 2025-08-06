import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The first name of the employee',
    example: 'Jane',
  })
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The last name of the employee',
    example: 'Doe',
  })
  public lastName: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the employee is active. Optional',
    example: true,
  })
  public isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The ID of the organization the employee belongs to',
    example: 1,
  })
  public organizationId?: number;
}
