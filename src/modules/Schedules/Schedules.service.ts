import { Repository } from 'typeorm';
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

  public async create(createDto: CreateScheduleDto): Promise<Schedule> {
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

  // Utility function to validate time format (HH:mm:ss)
  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    return timeRegex.test(time);
  }
}
