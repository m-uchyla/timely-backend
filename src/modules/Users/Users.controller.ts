import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './DTO/create-user.dto';
import { UpdateUserDto } from './DTO/update-user.dto';
import { User as UserEntity } from './User.entity';
import { UsersService } from './Users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get()
  public findAll(): Promise<UserEntity[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.svc.findOne(id);
  }

  @Post()
  public create(@Body() createDto: CreateUserDto): Promise<UserEntity> {
    return this.svc.create(createDto);
  }

  @Put(':id')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.svc.update(id, updateDto);
  }

  @Delete(':id')
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
