import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentsService } from '../Appointments/Appointments.service';
import { EmployeesService } from '../Employees/Employees.service';
import { ServicesService } from '../Services/Services.service';
import { PanelResponse } from './types/ApiResponses';
import { AppointmentPanelItem } from './types/ApiResponses';

@Injectable()
export class PanelService {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly employeesService: EmployeesService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  public async listServices(
    organizationId: number,
  ): Promise<PanelResponse<AppointmentPanelItem[]>> {
    const appointments = await this.appointmentsService.findByOrganization(organizationId);
    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(`No appointments found for organization ID ${organizationId}`);
    }

    const servicesIds = appointments.map((appointment) => appointment.serviceId);
    const services = await this.servicesService.findServicesByIds(servicesIds);
    if (!services || services.length === 0) {
      throw new NotFoundException(`No services found for organization ID ${organizationId}`);
    }
    const serviceMap = new Map(services.map((service) => [service.id, service]));

    const employeesIds = appointments.map((appointment) => appointment.employeeId);
    const employees = await this.employeesService.findEmployeesByIds(employeesIds);
    if (!employees || employees.length === 0) {
      throw new NotFoundException(`No employees found for organization ID ${organizationId}`);
    }
    const employeeMap = new Map(employees.map((emp) => [emp.id, emp]));

    const panelItems = appointments.map((appointment) => {
      const service = serviceMap.get(appointment.serviceId);
      if (!service) {
        throw new NotFoundException(`Service with ID ${appointment.serviceId} not found`);
      }

      const employee = employeeMap.get(appointment.employeeId);
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${appointment.employeeId} not found`);
      }

      // Constructing the AppointmentPanelItem
      return {
        id: appointment.id,
        date: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        notes: appointment.notes,
        cancellationReason: appointment.cancellationReason,
        price: appointment.price,
        employee: {
          id: employee.id,
          name: `${employee.firstName} ${employee.lastName}`,
        },
        service: {
          id: service.id,
          name: service.name,
          description: service.description,
          durationMinutes: service.durationMinutes,
        },
        client: {
          id: 0,
          name: 'not implemented',
          email: 'not implemented',
          phone: 'not implemented',
        },
      };
    });

    return {
      data: panelItems,
      pagination: {
        page: 1,
        totalPages: 1,
        limit: appointments.length,
        total: appointments.length,
        items: appointments.length,
        hasNext: false,
        hasPrevious: false,
      },
    };
  }
}
