import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../Organizations/Organization.entity';
import { Employee } from './Employee.entity';
import { EmployeesController } from './Employees.controller';
import { EmployeesService } from './Employees.service';
import { EmployeesAdminController } from './EmployeesAdmin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Organization])],
  providers: [EmployeesService],
  controllers: [EmployeesController, EmployeesAdminController],
})
export class EmployeesModule {}
