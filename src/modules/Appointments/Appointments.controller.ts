import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Request } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, Role, Roles } from '../Auth/Roles';
import { Appointment as AppointmentEntity } from './Appointment.entity';
import { AppointmentsService } from './Appointments.service';
import { CreateAppointmentDto } from './DTO/create-appointment.dto';
import { UpdateAppointmentDto } from './DTO/update-appointment.dto';

@ApiTags('Appointments')
@Roles(Role.ADMIN, Role.OWNER)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly svc: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all appointments for the logged-in user organization' })
  @ApiResponse({
    status: 200,
    description: 'List of all organization appointments',
    type: [AppointmentEntity],
  })
  public findAll(
    @Request() req: { user: { organizationId: number } },
  ): Promise<AppointmentEntity[]> {
    return this.svc.findByOrganization(req.user.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an appointment by ID for the logged-in user organization' })
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
  public findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { organizationId: number } },
  ): Promise<AppointmentEntity> {
    return this.svc.findOneInOrganization(id, req.user.organizationId);
  }

  @Get('employee/:employeeId')
  @ApiOperation({
    summary: 'Retrieve all appointments for a specific employee in logged-in user organization',
  })
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
    @Request() req: { user: { organizationId: number } },
  ): Promise<AppointmentEntity[]> {
    return this.svc.findAllByEmployeeOrganization(employeeId, req.user.organizationId);
  }

  @Post()
  @Public()
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
  @Public()
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
}
