import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateOrganizationDto } from './DTO/create-organization.dto';
import { UpdateOrganizationDto } from './DTO/update-organization.dto';
import { Organization as OrganizationEntity } from './Organization.entity';
import { OrganizationsService } from './Organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly svc: OrganizationsService) {}

  @Get()
  public findAll(): Promise<OrganizationEntity[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<OrganizationEntity> {
    return this.svc.findOne(id);
  }

  @Post()
  public create(@Body() createDto: CreateOrganizationDto): Promise<OrganizationEntity> {
    return this.svc.create(createDto);
  }

  @Put(':id')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateOrganizationDto,
  ): Promise<OrganizationEntity> {
    return this.svc.update(id, updateDto);
  }

  @Delete(':id')
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
