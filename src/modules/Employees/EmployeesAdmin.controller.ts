import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role, Roles } from '../Auth/Roles';
import { CreateEmployeeDto } from './DTO/create-employee.dto';
import { UpdateEmployeeDto } from './DTO/update-employee.dto';
import { Employee as EmployeeEntity } from './Employee.entity';
import { EmployeesService } from './Employees.service';

@ApiTags('Employees')
@Roles(Role.ADMIN)
@Controller('employees/admin')
export class EmployeesAdminController {
  constructor(private readonly svc: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all employees' })
  @ApiResponse({
    status: 200,
    description: 'List of all employees',
    type: [EmployeeEntity],
  })
  public findAll(): Promise<EmployeeEntity[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an employee by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the employee to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The employee with the specified ID',
    type: EmployeeEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found',
  })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<EmployeeEntity> {
    return this.svc.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({
    status: 201,
    description: 'The employee has been successfully created',
    type: EmployeeEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  public create(@Body() createDto: CreateEmployeeDto): Promise<EmployeeEntity> {
    return this.svc.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing employee' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the employee to update',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The employee has been successfully updated',
    type: EmployeeEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found',
  })
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEmployeeDto,
  ): Promise<EmployeeEntity> {
    return this.svc.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employee by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the employee to delete',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'The employee has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found',
  })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.svc.remove(id);
  }

  @Get('organization/:orgId')
  @ApiOperation({ summary: 'Retrieve all employees from a specific organization' })
  @ApiParam({
    name: 'orgId',
    description: 'The ID of the organization to retrieve employees from',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of employees from the specified organization',
    type: [EmployeeEntity],
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  public findByOrganization(
    @Param('orgId', ParseIntPipe) orgId: number,
  ): Promise<EmployeeEntity[]> {
    return this.svc.findByOrganization(orgId);
  }
}
