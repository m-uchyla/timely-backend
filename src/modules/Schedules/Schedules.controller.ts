import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateScheduleDto } from './DTO/create-schedule.dto';
import { UpdateScheduleDto } from './DTO/update-schedule.dto';
import { Schedule as ScheduleEntity } from './Schedule.entity';
import { SchedulesService } from './Schedules.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly svc: SchedulesService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all schedules' })
  @ApiResponse({
    status: 200,
    description: 'List of all schedules',
    type: [ScheduleEntity],
  })
  public findAll(): Promise<ScheduleEntity[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a schedule by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the schedule to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The schedule with the specified ID',
    type: ScheduleEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found',
  })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<ScheduleEntity> {
    return this.svc.findOne(id);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Retrieve all schedules for a specific employee' })
  @ApiParam({
    name: 'employeeId',
    description: 'The ID of the employee whose schedules to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of schedules for the specified employee',
    type: [ScheduleEntity],
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found',
  })
  public findAllByEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<ScheduleEntity[]> {
    return this.svc.findAllByEmployee(employeeId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new schedule' })
  @ApiResponse({
    status: 201,
    description: 'The schedule has been successfully created',
    type: ScheduleEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  public create(@Body() createDto: CreateScheduleDto): Promise<ScheduleEntity> {
    return this.svc.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing schedule' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the schedule to update',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The schedule has been successfully updated',
    type: ScheduleEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found',
  })
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateScheduleDto,
  ): Promise<ScheduleEntity> {
    return this.svc.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the schedule to delete',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'The schedule has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found',
  })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
