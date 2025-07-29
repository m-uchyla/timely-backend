import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Employee } from "./Employee.entity";
import { CreateEmployeeDto } from "./DTO/create-employee.dto";
import { UpdateEmployeeDto } from "./DTO/update-employee.dto";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly serviceRepo: Repository<Employee>
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.serviceRepo.find();
  }

  async findOne(id: number): Promise<Employee> {
    const entity = await this.serviceRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return entity;
  }

  async create(createDto: CreateEmployeeDto): Promise<Employee> {
    const entity = this.serviceRepo.create(createDto);
    return this.serviceRepo.save(entity);
  }

  async update(id: number, updateDto: UpdateEmployeeDto): Promise<Employee> {
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
