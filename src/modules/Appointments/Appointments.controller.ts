import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Appointment as AppointmentEntity } from './Appointment.entity';
import { AppointmentsService } from './Appointments.service';
import { CreateAppointmentDto } from './DTO/create-appointment.dto';
import { UpdateAppointmentDto } from './DTO/update-appointment.dto';

@ApiTags('Appointments') // Group endpoints under "Appointments"
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly svc: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all appointments' })
  @ApiResponse({
    status: 200,
    description: 'List of all appointments',
    type: [AppointmentEntity],
  })
  public findAll(): Promise<AppointmentEntity[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an appointment by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the appointment to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The appointment with the specified ID',
    type: AppointmentEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<AppointmentEntity> {
    return this.svc.findOne(id);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Retrieve all appointments for a specific employee' })
  @ApiParam({
    name: 'employeeId',
    description: 'The ID of the employee whose appointments to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of appointments for the specified employee',
    type: [AppointmentEntity],
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found',
  })
  public findAllByEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<AppointmentEntity[]> {
    return this.svc.findAllByEmployee(employeeId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'The appointment has been successfully created',
    type: AppointmentEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  public create(@Body() createDto: CreateAppointmentDto): Promise<AppointmentEntity> {
    return this.svc.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing appointment' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the appointment to update',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The appointment has been successfully updated',
    type: AppointmentEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAppointmentDto,
  ): Promise<AppointmentEntity> {
    return this.svc.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the appointment to delete',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'The appointment has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
