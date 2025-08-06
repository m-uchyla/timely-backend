import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../Employees/Employee.entity';
import { Schedule } from './Schedule.entity';
import { SchedulesController } from './Schedules.controller';
import { SchedulesService } from './Schedules.service';
import { SchedulesAdminController } from './SchedulesAdmin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Employee])],
  providers: [SchedulesService],
  controllers: [SchedulesController, SchedulesAdminController],
})
export class SchedulesModule {}
