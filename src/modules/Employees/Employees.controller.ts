import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateEmployeeDto } from './DTO/create-employee.dto';
import { UpdateEmployeeDto } from './DTO/update-employee.dto';
import { Employee as EmployeeEntity } from './Employee.entity';
import { EmployeesService } from './Employees.service';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly svc: EmployeesService) {}

  @Get()
  public findAll(): Promise<EmployeeEntity[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<EmployeeEntity> {
    return this.svc.findOne(id);
  }

  @Post()
  public create(@Body() createDto: CreateEmployeeDto): Promise<EmployeeEntity> {
    return this.svc.create(createDto);
  }

  @Put(':id')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEmployeeDto,
  ): Promise<EmployeeEntity> {
    return this.svc.update(id, updateDto);
  }

  @Delete(':id')
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
