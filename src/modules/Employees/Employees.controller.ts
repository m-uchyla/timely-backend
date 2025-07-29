import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from "@nestjs/common";
import { EmployeesService } from "./Employees.service";
import { Employee as EmployeeEntity } from "./Employee.entity";
import { CreateEmployeeDto } from "./DTO/create-employee.dto";
import { UpdateEmployeeDto } from "./DTO/update-employee.dto";

@Controller("services")
export class EmployeesController {
  constructor(private readonly svc: EmployeesService) {}

  @Get()
  findAll(): Promise<EmployeeEntity[]> {
    return this.svc.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<EmployeeEntity> {
    return this.svc.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateEmployeeDto): Promise<EmployeeEntity> {
    return this.svc.create(createDto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateEmployeeDto
  ): Promise<EmployeeEntity> {
    return this.svc.update(id, updateDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
