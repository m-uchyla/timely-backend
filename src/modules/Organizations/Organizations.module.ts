import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Users/User.entity';
import { Organization } from './Organization.entity';
import { OrganizationsController } from './Organizations.controller';
import { OrganizationsService } from './Organizations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User])],
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
