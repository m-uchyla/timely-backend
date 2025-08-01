import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  public async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'isActive'],
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  public async create(createDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    if (await this.isEmailTaken(createDto.email)) {
      throw new BadRequestException(`Email ${createDto.email} is already taken`);
    }

    const hashedPassword = await bcrypt.hash(createDto.password, 10);
    const entity = this.userRepo.create({});
    Object.assign(entity, createDto, { password: hashedPassword });
    const savedUser = await this.userRepo.save(entity);
    const { password: _password, ...result } = savedUser;
    return result;
  }

  public async update(id: number, updateDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    if (updateDto.email && (await this.isEmailTaken(updateDto.email))) {
      throw new BadRequestException(`Email ${updateDto.email} is already taken`);
    }
    const entity = await this.findOne(id);
    // eslint-disable-next-line @typescript-eslint/no-misused-spread
    const updatedFields = { ...updateDto };
    if (updateDto.password) {
      updatedFields.password = await bcrypt.hash(updateDto.password, 10);
    }
    Object.assign(entity, updatedFields);
    const savedUser = await this.userRepo.save(entity);
    const { password: _password, ...result } = savedUser;
    return result;
  }

  public async remove(id: number): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  private async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { email } });
    return Boolean(user); // Returns true if a user with the email exists, otherwise false
  }
}
