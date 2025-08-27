import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../Organizations/Organization.entity';
import { Service } from './Service.entity';
import { ServicesController } from './Services.controller';
import { ServicesService } from './Services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Organization])],
  providers: [ServicesService],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule {}
