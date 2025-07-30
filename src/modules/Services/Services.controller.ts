import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateServiceDto } from './DTO/create-service.dto';
import { UpdateServiceDto } from './DTO/update-service.dto';
import { Service as ServiceEntity } from './Service.entity';
import { ServicesService } from './Services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly svc: ServicesService) {}

  @Get()
  public findAll(): Promise<ServiceEntity[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<ServiceEntity> {
    return this.svc.findOne(id);
  }

  @Post()
  public create(@Body() createDto: CreateServiceDto): Promise<ServiceEntity> {
    return this.svc.create(createDto);
  }

  @Put(':id')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateServiceDto,
  ): Promise<ServiceEntity> {
    return this.svc.update(id, updateDto);
  }

  @Delete(':id')
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
