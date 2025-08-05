import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, Role, Roles } from '../Auth/Roles';
import { CreateUserDto } from './DTO/create-user.dto';
import { UpdateUserDto } from './DTO/update-user.dto';
import { User as UserEntity } from './User.entity';
import { UsersService } from './Users.service';

@ApiTags('Users')
@Controller('users')
@Roles(Role.ADMIN)
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserEntity],
  })
  public findAll(): Promise<UserEntity[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The user with the specified ID',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.svc.findOne(id);
  }

  @Post()
  @Public() //TO BE REMOVED IN PRODUCTION
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created',
    type: UserEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  public create(@Body() createDto: CreateUserDto): Promise<Omit<UserEntity, 'password'>> {
    return this.svc.create(createDto);
  }

  @Put(':id')
  @Public() //TO BE REMOVED IN PRODUCTION
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to update',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    return this.svc.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to delete',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
