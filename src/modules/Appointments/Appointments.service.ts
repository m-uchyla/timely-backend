import { LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../Employees/Employee.entity';
import { Schedule } from '../Schedules/Schedule.entity';
import { Service } from '../Services/Service.entity';
import { Appointment } from './Appointment.entity';
import { CreateAppointmentDto } from './DTO/create-appointment.dto';
import { UpdateAppointmentDto } from './DTO/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  // eslint-disable-next-line @typescript-eslint/max-params
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  public async findAll(): Promise<Appointment[]> {
    return this.appointmentRepo.find();
  }

  public async findOne(id: number): Promise<Appointment> {
    const entity = await this.appointmentRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return entity;
  }

  public async findAllByEmployee(employeeId: number): Promise<Appointment[]> {
    return this.appointmentRepo.find({ where: { employeeId } });
  }

  public async create(createDto: CreateAppointmentDto): Promise<Appointment> {
    const employee = await this.employeeRepo.findOne({
      where: { id: createDto.employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${createDto.employeeId} not found`);
    }

    const service = await this.serviceRepo.findOne({
      where: { id: createDto.serviceId },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${createDto.serviceId} not found`);
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

    // Check for overlapping appointments
    const availability = await this.isThisTimeSlotAvailable(createDto);

    if (!availability) {
      throw new BadRequestException('This time slot is not available');
    }

    const entity = this.appointmentRepo.create(createDto);
    return this.appointmentRepo.save(entity);
  }

  public async update(id: number, updateDto: UpdateAppointmentDto): Promise<Appointment> {
    const entity = await this.findOne(id);

    if (updateDto.employeeId !== undefined) {
      const employee = await this.employeeRepo.findOne({
        where: { id: updateDto.employeeId },
      });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${updateDto.employeeId} not found`);
      }
    }

    if (updateDto.serviceId !== undefined) {
      const service = await this.serviceRepo.findOne({
        where: { id: updateDto.serviceId },
      });
      if (!service) {
        throw new NotFoundException(`Service with ID ${updateDto.serviceId} not found`);
      }
    }

    if (updateDto.startTime || updateDto.endTime || updateDto.appointmentDate) {
      throw new BadRequestException(
        `Time and date cannot be updated. Please create a new appointment for changes.`,
      );
    }

    Object.assign(entity, updateDto);
    return this.appointmentRepo.save(entity);
  }

  public async remove(id: number): Promise<void> {
    const result = await this.appointmentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
  }

  // Utility function to validate time format (HH:mm:ss)
  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    return timeRegex.test(time);
  }

  private async isThisTimeSlotAvailable(createDto: CreateAppointmentDto): Promise<boolean> {
    // Check for overlapping appointments
    const overlappingAppointment = await this.appointmentRepo.findOne({
      where: {
        employeeId: createDto.employeeId,
        appointmentDate: createDto.appointmentDate,
        startTime: LessThan(createDto.endTime),
        endTime: MoreThan(createDto.startTime),
      },
    });

    if (overlappingAppointment) {
      return false; // Time slot is not available due to overlapping appointment
    }

    // Check if the employee is scheduled to work during this time
    const schedule = await this.scheduleRepo.findOne({
      where: {
        employeeId: createDto.employeeId,
        dayOfWeek: new Date(createDto.appointmentDate).getDay(),
        startTime: LessThanOrEqual(createDto.startTime),
        endTime: MoreThanOrEqual(createDto.endTime),
        isActive: true,
      },
    });

    if (!schedule) {
      return false; // Time slot is not available because the employee is not scheduled to work
    }

    return true; // Time slot is available
  }
}
