import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The first name of the client',
    example: 'John',
  })
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The last name of the client',
    example: 'Doe',
  })
  public lastName: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'The email of the client',
    example: 'john.doe@example.com',
  })
  public email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The phone number of the client',
    example: '123-456-7890',
  })
  public phone: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The ID of the organization the client belongs to',
    example: 1,
  })
  public organizationId?: number;
}
