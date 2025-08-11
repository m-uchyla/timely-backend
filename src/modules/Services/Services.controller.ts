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
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, Role, Roles } from '../Auth/Roles';
import { CreateServiceDto } from './DTO/create-service.dto';
import { UpdateServiceDto } from './DTO/update-service.dto';
import { Service as ServiceEntity } from './Service.entity';
import { ServicesService } from './Services.service';

@ApiTags('Services')
@Roles(Role.OWNER, Role.ADMIN)
@Controller('services')
export class ServicesController {
  constructor(private readonly svc: ServicesService) {}

  @Get('organization')
  @ApiOperation({ summary: 'Retrieve all services by logged-in user organization' })
  @ApiResponse({
    status: 200,
    description: 'List of services from the specified organization',
    type: [ServiceEntity],
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  public findByOrganization(
    @Request() req: { user: { organizationId: number } },
  ): Promise<ServiceEntity[]> {
    return this.svc.findByOrganization(req.user.organizationId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new service for the logged-in user organization' })
  @ApiResponse({
    status: 201,
    description: 'The service has been successfully created',
    type: ServiceEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  public create(
    @Body() createDto: CreateServiceDto,
    @Request() req: { user: { organizationId: number } },
  ): Promise<ServiceEntity> {
    createDto.organizationId = req.user.organizationId;
    return this.svc.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing service for the logged-in user organization' })
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
    @Request() req: { user: { organizationId: number } },
  ): Promise<ServiceEntity> {
    return this.svc.updateForOrganization(id, updateDto, req.user.organizationId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a logged-in user organization service by ID' })
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
  public remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { organizationId: number } },
  ): Promise<void> {
    return this.svc.removeOrganizationService(id, req.user.organizationId);
  }
}
