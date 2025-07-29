import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "./Employee.entity";
import { EmployeesService } from "./Employees.service";
import { EmployeesController } from "./Employees.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeesService],
  controllers: [EmployeesController],
})
export class EmployeesModule {}
