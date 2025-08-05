import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../Employees/Employee.entity';
import { Schedule } from '../Schedules/Schedule.entity';
import { Service } from '../Services/Service.entity';
import { Appointment } from './Appointment.entity';
import { AppointmentsController } from './Appointments.controller';
import { AppointmentsService } from './Appointments.service';
import { AppointmentsAdminController } from './AppointmentsAdmin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Employee, Service, Schedule])],
  providers: [AppointmentsService],
  controllers: [AppointmentsController, AppointmentsAdminController],
})
export class AppointmentsModule {}
