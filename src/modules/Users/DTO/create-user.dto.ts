import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  public lastName: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of the user',
    example: 'securepassword123',
  })
  public password: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the user is active. Optional',
    example: true,
  })
  public isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The organization of the user',
    example: 1,
  })
  public organizationId?: number;
}
