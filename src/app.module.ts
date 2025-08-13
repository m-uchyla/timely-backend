import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsModule } from './modules/Appointments/Appointments.module';
import { AuthModule } from './modules/Auth/Auth.module';
import { JwtRolesGuard } from './modules/Auth/JwtRolesGuard';
import { ClientsModule } from './modules/Clients/Clients.module';
import { EmployeesModule } from './modules/Employees/Employees.module';
import { OrganizationsModule } from './modules/Organizations/Organizations.module';
import { PanelModule } from './modules/Panel/Panel.module';
import { SchedulesModule } from './modules/Schedules/Schedules.module';
import { ServicesModule } from './modules/Services/Services.module';
import { UsersModule } from './modules/Users/Users.module';

@Module({
  imports: [
    ServicesModule,
    EmployeesModule,
    SchedulesModule,
    OrganizationsModule,
    UsersModule,
    AppointmentsModule,
    AuthModule,
    PanelModule,
    ClientsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.getOrThrow('DB_PORT'), 10),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtRolesGuard,
    },
  ],
})
export class AppModule {}
