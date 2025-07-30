import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './DTO/create-user.dto';
import { UpdateUserDto } from './DTO/update-user.dto';
import { User } from './User.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  public async findOne(id: number): Promise<User> {
    const entity = await this.userRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return entity;
  }

  public async create(createDto: CreateUserDto): Promise<User> {
    const entity = this.userRepo.create(createDto);
    return this.userRepo.save(entity);
  }

  public async update(id: number, updateDto: UpdateUserDto): Promise<User> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return this.userRepo.save(entity);
  }

  public async remove(id: number): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
