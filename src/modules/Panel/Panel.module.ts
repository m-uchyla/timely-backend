import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsModule } from '../Appointments/Appointments.module';
import { ClientsModule } from '../Clients/Clients.module';
import { Employee } from '../Employees/Employee.entity';
import { EmployeesModule } from '../Employees/Employees.module';
import { OrganizationsModule } from '../Organizations/Organizations.module';
import { ServicesModule } from '../Services/Services.module';
import { PanelController } from './Panel.controller';
import { PanelService } from './Panel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    AppointmentsModule,
    ServicesModule,
    EmployeesModule,
    ClientsModule,
    OrganizationsModule,
  ],
  providers: [PanelService],
  controllers: [PanelController],
})
export class PanelModule {}
