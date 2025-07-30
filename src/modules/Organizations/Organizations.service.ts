import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrganizationDto } from './DTO/create-organization.dto';
import { UpdateOrganizationDto } from './DTO/update-organization.dto';
import { Organization } from './Organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
  ) {}

  public async findAll(): Promise<Organization[]> {
    return this.organizationRepo.find();
  }

  public async findOne(id: number): Promise<Organization> {
    const entity = await this.organizationRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return entity;
  }

  public async create(createDto: CreateOrganizationDto): Promise<Organization> {
    const entity = this.organizationRepo.create(createDto);
    return this.organizationRepo.save(entity);
  }

  public async update(id: number, updateDto: UpdateOrganizationDto): Promise<Organization> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return this.organizationRepo.save(entity);
  }

  public async remove(id: number): Promise<void> {
    const result = await this.organizationRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
  }
}
