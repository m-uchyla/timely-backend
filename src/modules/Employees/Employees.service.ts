import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '../Organizations/Organization.entity';
import { CreateEmployeeDto } from './DTO/create-employee.dto';
import { UpdateEmployeeDto } from './DTO/update-employee.dto';
import { Employee } from './Employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
  ) {}

  public async findAll(): Promise<Employee[]> {
    return this.employeeRepo.find();
  }

  public async findOne(id: number): Promise<Employee> {
    const entity = await this.employeeRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return entity;
  }

  public async create(createDto: CreateEmployeeDto): Promise<Employee> {
    const entity = this.employeeRepo.create(createDto);
    const organization = await this.organizationRepo.findOne({
      where: { id: createDto.organizationId },
    });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${createDto.organizationId} not found`);
    }
    return this.employeeRepo.save(entity);
  }

  public async update(id: number, updateDto: UpdateEmployeeDto): Promise<Employee> {
    const entity = await this.findOne(id);
    const organization = await this.organizationRepo.findOne({
      where: { id: updateDto.organizationId },
    });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${updateDto.organizationId} not found`);
    }
    Object.assign(entity, updateDto);
    return this.employeeRepo.save(entity);
  }

  public async remove(id: number): Promise<void> {
    const result = await this.employeeRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  }
}
