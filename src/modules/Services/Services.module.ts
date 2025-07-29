import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Service } from "./Service.entity";
import { ServicesService } from "./Services.service";
import { ServicesController } from "./Services.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  providers: [ServicesService],
  controllers: [ServicesController],
})
export class ServicesModule {}
