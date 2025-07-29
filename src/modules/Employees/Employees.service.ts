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
    private readonly employeeRepo: Repository<Employee>
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepo.find();
  }

  async findOne(id: number): Promise<Employee> {
    const entity = await this.employeeRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return entity;
  }

  async create(createDto: CreateEmployeeDto): Promise<Employee> {
    const entity = this.employeeRepo.create(createDto);
    return this.employeeRepo.save(entity);
  }

  async update(id: number, updateDto: UpdateEmployeeDto): Promise<Employee> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return this.employeeRepo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.employeeRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  }
}
