import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, Role, Roles } from '../Auth/Roles';
import { CreateServiceDto } from './DTO/create-service.dto';
import { UpdateServiceDto } from './DTO/update-service.dto';
import { Service as ServiceEntity } from './Service.entity';
import { ServicesService } from './Services.service';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly svc: ServicesService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Retrieve all services' })
  @ApiResponse({
    status: 200,
    description: 'List of all services',
    type: [ServiceEntity],
  })
  public findAll(): Promise<ServiceEntity[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Retrieve a service by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the service to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The service with the specified ID',
    type: ServiceEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<ServiceEntity> {
    return this.svc.findOne(id);
  }

  @Get('organization/:id')
  @Public()
  @ApiOperation({ summary: 'Retrieve all services by organization ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the organization to retrieve services from',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of services from the specified organization',
    type: [ServiceEntity],
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  public findByOrganization(@Param('id', ParseIntPipe) id: number): Promise<ServiceEntity[]> {
    return this.svc.findByOrganization(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({
    status: 201,
    description: 'The service has been successfully created',
    type: ServiceEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  public create(@Body() createDto: CreateServiceDto): Promise<ServiceEntity> {
    return this.svc.create(createDto);
  }

  // @Post('organization')
  // @Roles(Role.ADMIN, Role.OWNER)
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Create a new service for an organization of the logged in user' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'The service has been successfully created',
  //   type: ServiceEntity,
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Invalid input data',
  // })
  // public createForOrganization(@Body() createDto: CreateServiceDto): Promise<ServiceEntity> {
  //   return this.svc.create({createDto, organizationId: createDto.organizationId});
  // }

  @Put(':id')
  @Roles(Role.ADMIN, Role.OWNER)
  @ApiOperation({ summary: 'Update an existing service' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the service to update',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The service has been successfully updated',
    type: ServiceEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateServiceDto,
  ): Promise<ServiceEntity> {
    return this.svc.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.OWNER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a service by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the service to delete',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'The service has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
