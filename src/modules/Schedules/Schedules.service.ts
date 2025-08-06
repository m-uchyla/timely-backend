import { In, Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../Employees/Employee.entity';
import { CreateScheduleDto } from './DTO/create-schedule.dto';
import { UpdateScheduleDto } from './DTO/update-schedule.dto';
import { Schedule } from './Schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  public async findAll(): Promise<Schedule[]> {
    return this.scheduleRepo.find();
  }

  public async findOne(id: number): Promise<Schedule> {
    const entity = await this.scheduleRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return entity;
  }

  public async createForOrganization(
    createDto: CreateScheduleDto,
    orgId: number,
  ): Promise<Schedule> {
    const employee = await this.employeeRepo.findOne({
      where: { id: createDto.employeeId, organizationId: orgId },
    });
    if (!employee) {
      throw new NotFoundException(`Employee not found for organization ID ${orgId}`);
    }
    return this.create(createDto);
  }

  public async updateForOrganization(
    id: number,
    updateDto: UpdateScheduleDto,
    organizationId: number,
  ): Promise<Schedule> {
    const employee = await this.employeeRepo.findOne({
      where: { id: updateDto.employeeId, organizationId },
    });
    if (!employee) {
      throw new NotFoundException(`Employee not found for organization ID ${organizationId}`);
    }
    return this.update(id, updateDto);
  }

  public async removeForOrganization(id: number, organizationId: number): Promise<void> {
    const schedule = await this.scheduleRepo.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    const employee = await this.employeeRepo.findOne({ where: { id: schedule.employeeId, organizationId } });
    if (!employee) {
      throw new NotFoundException(`Employee not found for organization ID ${organizationId}`);
    }
    await this.remove(id);
  }

  public async create(createDto: CreateScheduleDto): Promise<Schedule> {
    // Validate dayOfWeek
    if (createDto.dayOfWeek < 1 || createDto.dayOfWeek > 7) {
      throw new BadRequestException('dayOfWeek must be between 1 (Monday) and 7 (Sunday)');
    }
    // Validate startTime and endTime format
    if (!this.isValidTimeFormat(createDto.startTime)) {
      throw new BadRequestException(`Invalid start time format: ${createDto.startTime}`);
    }
    if (!this.isValidTimeFormat(createDto.endTime)) {
      throw new BadRequestException(`Invalid end time format: ${createDto.endTime}`);
    }

    // Ensure startTime is before endTime
    if (createDto.startTime >= createDto.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    const employee = await this.employeeRepo.findOne({
      where: { id: createDto.employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${createDto.employeeId} not found`);
    }
    const entity = this.scheduleRepo.create(createDto);
    return this.scheduleRepo.save(entity);
  }

  public async update(id: number, updateDto: UpdateScheduleDto): Promise<Schedule> {
    const entity = await this.findOne(id);

    // Validate dayOfWeek
    if (updateDto.dayOfWeek && (updateDto.dayOfWeek < 1 || updateDto.dayOfWeek > 7)) {
      throw new BadRequestException('dayOfWeek must be between 1 (Monday) and 7 (Sunday)');
    }

    // Validate startTime and endTime format if provided
    if (updateDto.startTime && !this.isValidTimeFormat(updateDto.startTime)) {
      throw new BadRequestException(`Invalid start time format: ${updateDto.startTime}`);
    }
    if (updateDto.endTime && !this.isValidTimeFormat(updateDto.endTime)) {
      throw new BadRequestException(`Invalid end time format: ${updateDto.endTime}`);
    }

    // Ensure startTime is before endTime
    if (updateDto.startTime && updateDto.endTime && updateDto.startTime >= updateDto.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }
    if (updateDto.startTime && !updateDto.endTime && updateDto.startTime >= entity.endTime) {
      throw new BadRequestException('Start time must be before the existing end time');
    }
    if (updateDto.endTime && !updateDto.startTime && updateDto.endTime <= entity.startTime) {
      throw new BadRequestException('End time must be after the existing start time');
    }

    if (updateDto.employeeId !== undefined) {
      const employee = await this.employeeRepo.findOne({
        where: { id: updateDto.employeeId },
      });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${updateDto.employeeId} not found`);
      }
    }
    Object.assign(entity, updateDto);
    return this.scheduleRepo.save(entity);
  }

  public async remove(id: number): Promise<void> {
    const result = await this.scheduleRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
  }

  public async findAllByEmployee(employeeId: number): Promise<Schedule[]> {
    const employee = await this.employeeRepo.findOne({ where: { id: employeeId } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }
    return this.scheduleRepo.find({ where: { employeeId } });
  }

  public async findAllByOrganization(organizationId: number): Promise<Schedule[]> {
    const employees = await this.employeeRepo.find({ where: { organizationId } });
    if (!employees) {
      throw new NotFoundException(`Employees with organization ID ${organizationId} not found`);
    }
    return this.scheduleRepo.find({ where: { employeeId: In(employees.map((emp) => emp.id)) } });
  }

  // Utility function to validate time format (HH:mm:ss)
  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    return timeRegex.test(time);
  }
}
