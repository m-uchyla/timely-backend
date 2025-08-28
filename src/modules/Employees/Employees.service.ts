import { In, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '../Organizations/Organization.entity';
import { EmployeePanelItem, PanelResponse } from '../Panel/types/ApiResponses';
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

  public async findEmployeesByIds(employeesIds: number[]): Promise<Employee[]> {
    return await this.employeeRepo.findBy({ id: In(employeesIds) });
  }

  public async findOneFromOrganization(id: number, organizationId: number): Promise<Employee> {
    const entity = await this.employeeRepo.findOne({
      where: { id, organizationId },
    });
    if (!entity) {
      throw new NotFoundException(
        `Employee with ID ${id} not found in organization ${organizationId}`,
      );
    }
    return entity;
  }

  public async create(createDto: CreateEmployeeDto): Promise<Employee> {
    const organization = await this.organizationRepo.findOne({
      where: { id: createDto.organizationId },
    });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${createDto.organizationId} not found`);
    }
    const entity = this.employeeRepo.create(createDto);
    return this.employeeRepo.save(entity);
  }

  public async update(id: number, updateDto: UpdateEmployeeDto): Promise<Employee> {
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
    return this.employeeRepo.save(entity);
  }

  public async updateFromOrganization(
    id: number,
    updateDto: UpdateEmployeeDto,
    organizationId: number,
  ): Promise<Employee> {
    const entity = await this.employeeRepo.findOne({
      where: { id, organizationId },
    });
    if (!entity) {
      throw new NotFoundException(
        `Employee with ID ${id} not found in organization ${organizationId}`,
      );
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

  public async removeOrganizationEmployee(id: number, organizationId: number): Promise<void> {
    const result = await this.employeeRepo.delete({ id, organizationId });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Employee with ID ${id} not found in organization ${organizationId}`,
      );
    }
  }

  public async findByOrganization(orgId: number): Promise<Employee[]> {
    const organization = await this.organizationRepo.findOne({ where: { id: orgId } });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${orgId} not found`);
    }
    return this.employeeRepo.find({ where: { organizationId: orgId } });
  }

  public async findByOrganizationWithSchedulePaginated(
    organizationId: number,
    skip: number,
    limit: number,
  ): Promise<{ data: EmployeePanelItem[]; total: number }> {
    const total = await this.employeeRepo.count({
      where: { organizationId },
    });

    // 2. Znajdź tylko ID pracowników dla bieżącej strony paginacji
    // To zapytanie jest proste, bez JOIN-ów, więc paginacja działa poprawnie.
    const employeeIdsQuery = this.employeeRepo
      .createQueryBuilder('employee')
      .select('employee.id')
      .where('employee.organizationId = :organizationId', { organizationId })
      .orderBy('employee.createdAt', 'ASC')
      .addOrderBy('employee.lastName', 'ASC')
      .skip(skip)
      .take(limit);

    const rawEmployees: { employee_id: number }[] = await employeeIdsQuery.getRawMany();
    const employeeIds = rawEmployees.map((employee) => employee.employee_id);

    if (employeeIds.length === 0) {
      return { data: [], total };
    }

    const employeesWithSchedules = await this.employeeRepo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.schedule', 'schedule')
      .whereInIds(employeeIds)
      .orderBy('employee.createdAt', 'ASC')
      .addOrderBy('employee.lastName', 'ASC')
      .addOrderBy('schedule.dayOfWeek', 'ASC')
      .getMany();

    const formattedEmployees: EmployeePanelItem[] = employeesWithSchedules.map((employee) => {
      return {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        isActive: employee.isActive,
        schedules: employee.schedule.map((sch) => ({
          id: sch.id,
          dayOfWeek: sch.dayOfWeek,
          startTime: sch.startTime,
          endTime: sch.endTime,
          isActive: sch.isActive,
        })),
      };
    });

    return {
      data: formattedEmployees,
      total,
    };
  }
}
