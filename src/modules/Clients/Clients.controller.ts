import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, Role, Roles } from '../Auth/Roles';
import { Client as ClientEntity } from './Client.entity';
import { ClientsService } from './Clients.service';
import { CreateClientDto } from './DTO/create-client.dto';
import { UpdateClientDto } from './DTO/update-user.dto';

@ApiTags('Clients')
@Controller('clients')
@Roles(Role.ADMIN)
export class ClientsController {
  constructor(private readonly svc: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all clients' })
  @ApiResponse({
    status: 200,
    description: 'List of all clients',
    type: [ClientEntity],
  })
  public findAll(): Promise<ClientEntity[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a client by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the client to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The client with the specified ID',
    type: ClientEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<ClientEntity> {
    return this.svc.findOne(id);
  }

  @Post()
  @Public() //TO BE REMOVED IN PRODUCTION
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'The client has been successfully created',
    type: ClientEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  public create(@Body() createDto: CreateClientDto): Promise<ClientEntity> {
    return this.svc.create(createDto);
  }

  @Put(':id')
  @Public() //TO BE REMOVED IN PRODUCTION
  @ApiOperation({ summary: 'Update an existing client' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to update',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The client has been successfully updated',
    type: ClientEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateClientDto,
  ): Promise<Omit<ClientEntity, 'password'>> {
    return this.svc.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the client to delete',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'The client has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
