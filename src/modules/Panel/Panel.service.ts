import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentsService } from '../Appointments/Appointments.service';
import { ClientsService } from '../Clients/Clients.service';
import { EmployeesService } from '../Employees/Employees.service';
import { ServicesService } from '../Services/Services.service';
import { PanelResponse } from './types/ApiResponses';
import { AppointmentPanelItem } from './types/ApiResponses';

@Injectable()
export class PanelService {
  // eslint-disable-next-line @typescript-eslint/max-params
  constructor(
    private readonly servicesService: ServicesService,
    private readonly employeesService: EmployeesService,
    private readonly appointmentsService: AppointmentsService,
    private readonly clientsService: ClientsService,
  ) {}

  public async listAppointments(
    organizationId: number,
    page = 1,
    limit = 10,
    statuses: string[] = [],
    date?: string,
  ): Promise<PanelResponse<AppointmentPanelItem[]>> {
    // Apply pagination at database level
    const skip = (page - 1) * limit;

    await this.appointmentsService.checkForArchiving(organizationId);

    // Get paginated appointments and total count in parallel
    const { appointments, total } = await this.appointmentsService.findByOrganizationPaginated(
      organizationId,
      skip,
      limit,
      statuses,
      date,
    );

    if (!appointments || appointments.length === 0) {
      return {
        data: [],
        pagination: {
          page,
          totalPages: Math.ceil(total / limit),
          limit,
          total,
          items: appointments.length,
          hasNext: page < Math.ceil(total / limit),
          hasPrevious: page > 1,
        },
      };
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

    const clientsIds = appointments.map((appointment) => appointment.clientId);
    const clients = await this.clientsService.findClientsByIds(clientsIds);
    if (!clients || clients.length === 0) {
      throw new NotFoundException(`No clients found for organization ID ${organizationId}`);
    }
    const clientMap = new Map(clients.map((client) => [client.id, client]));

    const panelItems = appointments.map((appointment) => {
      const service = serviceMap.get(appointment.serviceId);
      if (!service) {
        throw new NotFoundException(`Service with ID ${appointment.serviceId} not found`);
      }

      const employee = employeeMap.get(appointment.employeeId);
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${appointment.employeeId} not found`);
      }

      const client = clientMap.get(appointment.clientId);
      if (!client) {
        throw new NotFoundException(`Client with ID ${appointment.clientId} not found`);
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
          id: client.id,
          name: `${client.firstName} ${client.lastName}`,
          email: client.email,
          phone: client.phone,
        },
      };
    });

    return {
      data: panelItems,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        limit,
        total,
        items: panelItems.length,
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }
}
