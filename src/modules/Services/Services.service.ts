import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Service } from "./Service.entity";
import { CreateServiceDto } from "./DTO/create-service.dto";
import { UpdateServiceDto } from "./DTO/update-service.dto";

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>
  ) {}

  async findAll(): Promise<Service[]> {
    return this.serviceRepo.find();
  }

  async findOne(id: number): Promise<Service> {
    const entity = await this.serviceRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return entity;
  }

  async create(createDto: CreateServiceDto): Promise<Service> {
    const entity = this.serviceRepo.create(createDto);
    return this.serviceRepo.save(entity);
  }

  async update(id: number, updateDto: UpdateServiceDto): Promise<Service> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return this.serviceRepo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.serviceRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }
}
