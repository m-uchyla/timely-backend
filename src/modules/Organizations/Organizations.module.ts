import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Users/User.entity';
import { Organization } from './Organization.entity';
import { OrganizationsController } from './Organizations.controller';
import { OrganizationsService } from './Organizations.service';
import { OrganizationsAdminController } from './OrganizationsAdmin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User])],
  providers: [OrganizationsService],
  controllers: [OrganizationsController, OrganizationsAdminController],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
