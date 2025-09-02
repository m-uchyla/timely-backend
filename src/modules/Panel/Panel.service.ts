import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AppointmentStatus } from '../Appointments/Appointment.entity';
import { AppointmentsService } from '../Appointments/Appointments.service';
import { CreateAppointmentDto } from '../Appointments/DTO/create-appointment.dto';
import { ClientsService } from '../Clients/Clients.service';
import { Employee } from '../Employees/Employee.entity';
import { EmployeesService } from '../Employees/Employees.service';
import { OrganizationsService } from '../Organizations/Organizations.service';
import { ServicesService } from '../Services/Services.service';
import {
  AppointmentPanelItem,
  AuthenticatedUser,
  EmployeePanelItem,
  PanelInfo,
  PanelResponse,
} from './types/ApiResponses';

@Injectable()
export class PanelService {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly employeesService: EmployeesService,
    private readonly appointmentsService: AppointmentsService,
    private readonly clientsService: ClientsService,
    private readonly organizationsService: OrganizationsService,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  public async getPanelInfo(user: AuthenticatedUser): Promise<PanelInfo> {
    const organization = await this.organizationsService.findOne(user.organizationId);
    const pendingNumber = await this.appointmentsService.countPendingAppointments(
      user.organizationId,
    );
    return {
      userID: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      organizationID: user.organizationId,
      organizationName: organization.name,
      notificationsNumber: 0,
      pendingNumber,
    };
  }

  public async createAppointment(createDto: CreateAppointmentDto): Promise<Appointment> {
    throw new Error('Method not implemented.');
  }

  public async listAppointments(
    organizationId: number,
    page = 1,
    limit = 10,
    statuses: string[] = [],
    date?: string,
    archivedOnly?: boolean,
  ): Promise<PanelResponse<AppointmentPanelItem[]>> {
    // Apply pagination at database level
    const skip = (page - 1) * limit;

    await this.appointmentsService.checkForArchiving(organizationId);

    // Get paginated appointments with relations loaded in one query
    const { appointments, total } =
      await this.appointmentsService.findByOrganizationPaginatedWithRelations(
        organizationId,
        skip,
        limit,
        statuses,
        date,
        archivedOnly,
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

    // No need for separate service calls - relations are already loaded
    const panelItems = appointments.map((appointment) => {
      // Relations are already loaded, so we can access them directly
      const { service, employee, client } = appointment;

      if (!service) {
        throw new NotFoundException(`Service with ID ${appointment.serviceId} not found`);
      }

      if (!employee) {
        throw new NotFoundException(`Employee with ID ${appointment.employeeId} not found`);
      }

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
        isArchived: appointment.isArchived,
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

  public async confirmAppointment(
    appointmentId: number,
    organizationId: number,
  ): Promise<{ success: boolean; message: string }> {
    // First verify the appointment exists and belongs to the organization
    const appointment = await this.appointmentsService.findOneInOrganization(
      appointmentId,
      organizationId,
    );

    if (appointment.status !== AppointmentStatus.PENDING) {
      return {
        success: false,
        message: 'Cannot confirm an appointment that is not pending',
      };
    }

    // Update the appointment status to confirmed
    await this.appointmentsService.update(appointmentId, {
      status: AppointmentStatus.CONFIRMED,
    });

    return {
      success: true,
      message: 'Appointment confirmed successfully',
    };
  }

  public async declineAppointment(
    appointmentId: number,
    organizationId: number,
    cancellationReason?: string,
  ): Promise<{ success: boolean; message: string }> {
    // First verify the appointment exists and belongs to the organization
    const appointment = await this.appointmentsService.findOneInOrganization(
      appointmentId,
      organizationId,
    );

    if (
      appointment.status !== AppointmentStatus.PENDING &&
      appointment.status !== AppointmentStatus.CONFIRMED
    ) {
      return {
        success: false,
        message: 'Cannot decline an appointment that is not pending or confirmed',
      };
    }

    // Update the appointment status to declined with optional cancellation reason
    const updateData: { status: AppointmentStatus; cancellationReason?: string } = {
      status: AppointmentStatus.DECLINED,
    };

    if (cancellationReason) {
      updateData.cancellationReason = cancellationReason;
    }

    await this.appointmentsService.update(appointmentId, updateData);

    return {
      success: true,
      message: 'Appointment declined successfully',
    };
  }

  public async listEmployees(
    organizationId: number,
    page: number,
    limit: number,
  ): Promise<PanelResponse<EmployeePanelItem[]>> {
    const skip = (page - 1) * limit;

    await this.appointmentsService.checkForArchiving(organizationId);
    const { data, total } = await this.employeesService.findByOrganizationWithSchedulePaginated(
      organizationId,
      skip,
      limit,
    );

    return {
      data,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        limit,
        total,
        items: data.length,
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }

  public async listServices(
    organizationId: number,
    page: number,
    limit: number,
  ): Promise<PanelResponse<EmployeePanelItem[]>> {
    const skip = (page - 1) * limit;

    await this.appointmentsService.checkForArchiving(organizationId);
    const { data, total } = await this.employeesService.findByOrganizationWithSchedulePaginated(
      organizationId,
      skip,
      limit,
    );

    return {
      data,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        limit,
        total,
        items: data.length,
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }
}
