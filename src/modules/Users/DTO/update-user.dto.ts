import { IsEnum, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../Auth/Roles';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEnum(Role)
  @IsOptional()
  @ApiProperty({
    description: 'The role of the user. Optional',
    example: Role.USER,
  })
  public role?: Role;
}
