import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '../Organizations/Organization.entity';
import { CreateServiceDto } from './DTO/create-service.dto';
import { UpdateServiceDto } from './DTO/update-service.dto';
import { Service } from './Service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
  ) {}

  public async findAll(): Promise<Service[]> {
    return this.serviceRepo.find();
  }

  public async findOne(id: number): Promise<Service> {
    const entity = await this.serviceRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return entity;
  }

  public async create(createDto: CreateServiceDto): Promise<Service> {
    const organization = await this.organizationRepo.findOne({
      where: { id: createDto.organizationId },
    });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${createDto.organizationId} not found`);
    }

    const entity = this.serviceRepo.create(createDto);
    return this.serviceRepo.save(entity);
  }

  public async update(id: number, updateDto: UpdateServiceDto): Promise<Service> {
    const entity = await this.findOne(id);

    if (updateDto.organizationId !== undefined) {
      const organization = await this.organizationRepo.findOne({
        where: { id: updateDto.organizationId },
      });
      if (!organization) {
        throw new NotFoundException(`Organization with ID ${updateDto.organizationId} not found`);
      }
    }

    Object.assign(entity, updateDto);
    return this.serviceRepo.save(entity);
  }

  public async updateForOrganization(
    id: number,
    updateDto: UpdateServiceDto,
    organizationId: number,
  ): Promise<Service> {
    const entity = await this.findOne(id);

    if (entity.organizationId !== organizationId) {
      throw new NotFoundException(
        `Service with ID ${id} not found in organization ${organizationId}`,
      );
    }

    return this.update(id, updateDto);
  }

  public async remove(id: number): Promise<void> {
    const result = await this.serviceRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }

  public async removeOrganizationService(id: number, organizationId: number): Promise<void> {
    const entity = await this.findOne(id);
    if (entity.organizationId !== organizationId) {
      throw new NotFoundException(
        `Service with ID ${id} not found in organization ${organizationId}`,
      );
    }

    await this.remove(id);
  }

  public async findByOrganization(id: number): Promise<Service[]> {
    return await this.serviceRepo.find({ where: { organizationId: id } });
  }
}
