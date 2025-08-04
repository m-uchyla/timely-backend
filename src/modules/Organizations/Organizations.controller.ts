import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtRolesGuard } from '../Auth/JwtRolesGuard';
import { Role, Roles } from '../Auth/Roles';
import { CreateOrganizationDto } from './DTO/create-organization.dto';
import { UpdateOrganizationDto } from './DTO/update-organization.dto';
import { Organization as OrganizationEntity } from './Organization.entity';
import { OrganizationsService } from './Organizations.service';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly svc: OrganizationsService) {}

  @UseGuards(JwtRolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Retrieve all organizations' })
  @ApiResponse({
    status: 200,
    description: 'List of all organizations',
    type: [OrganizationEntity],
  })
  public findAll(): Promise<OrganizationEntity[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an organization by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the organization to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The organization with the specified ID',
    type: OrganizationEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<OrganizationEntity> {
    return this.svc.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({
    status: 201,
    description: 'The organization has been successfully created',
    type: OrganizationEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  public create(@Body() createDto: CreateOrganizationDto): Promise<OrganizationEntity> {
    return this.svc.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing organization' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the organization to update',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The organization has been successfully updated',
    type: OrganizationEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateOrganizationDto,
  ): Promise<OrganizationEntity> {
    return this.svc.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the organization to delete',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'The organization has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
