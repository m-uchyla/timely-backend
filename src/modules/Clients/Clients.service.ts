import { In, Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './Client.entity';
import { CreateClientDto } from './DTO/create-client.dto';
import { UpdateClientDto } from './DTO/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
  ) {}

  public async findAll(): Promise<Client[]> {
    return this.clientRepo.find();
  }

  public async findOne(id: number): Promise<Client> {
    const entity = await this.clientRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return entity;
  }

  public async findByEmail(email: string): Promise<Client | null> {
    const client = await this.clientRepo.findOne({
      where: { email },
    });
    if (!client) {
      return null;
    }
    return client;
  }

  public async findClientsByIds(clientsIds: number[]): Promise<Client[]> {
    return this.clientRepo.findBy({ id: In(clientsIds) });
  }

  public async create(createDto: CreateClientDto): Promise<Client> {
    if (await this.isEmailTaken(createDto.email)) {
      throw new BadRequestException(`Email ${createDto.email} is already taken`);
    }

    const entity = this.clientRepo.create(createDto);
    return this.clientRepo.save(entity);
  }

  public async update(id: number, updateDto: UpdateClientDto): Promise<Client> {
    if (updateDto.email && (await this.isEmailTaken(updateDto.email))) {
      throw new BadRequestException(`Email ${updateDto.email} is already taken`);
    }
    const entity = await this.findOne(id);
    const updatedEntity = this.clientRepo.merge(entity, updateDto);
    const result = await this.clientRepo.save(updatedEntity);
    if (!result) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return result;
  }

  public async remove(id: number): Promise<void> {
    const result = await this.clientRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  }

  private async isEmailTaken(email: string): Promise<boolean> {
    const client = await this.clientRepo.findOne({ where: { email } });
    return Boolean(client); // Returns true if a client with the email exists, otherwise false
  }
}
