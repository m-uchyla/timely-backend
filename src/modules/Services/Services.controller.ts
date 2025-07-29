import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from "@nestjs/common";
import { ServicesService } from "./Services.service";
import { Service as ServiceEntity } from "./Service.entity";
import { CreateServiceDto } from "./DTO/create-service.dto";
import { UpdateServiceDto } from "./DTO/update-service.dto";

@Controller("services")
export class ServicesController {
  constructor(private readonly svc: ServicesService) {}

  @Get()
  findAll(): Promise<ServiceEntity[]> {
    return this.svc.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<ServiceEntity> {
    return this.svc.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateServiceDto): Promise<ServiceEntity> {
    return this.svc.create(createDto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateServiceDto
  ): Promise<ServiceEntity> {
    return this.svc.update(id, updateDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
