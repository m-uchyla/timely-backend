import { Body, Controller, Get, Param, Patch, Query, Request } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role, Roles } from '../Auth/Roles';
import { PanelService } from './Panel.service';
import { AuthenticatedUser, PanelInfo, PanelResponse } from './types/ApiResponses';
import { AppointmentPanelItem } from './types/ApiResponses';

@ApiTags('Panel')
@Roles(Role.ADMIN, Role.OWNER)
@Controller('panel')
export class PanelController {
  constructor(private readonly svc: PanelService) {}

  @Get('info')
  @ApiOperation({
    summary: 'Retrieve panel information',
  })
  public async getPanelInfo(@Request() req: { user: AuthenticatedUser }): Promise<PanelInfo> {
    return this.svc.getPanelInfo(req.user);
  }

  @Get('appointments')
  @ApiOperation({
    summary: 'Retrieve all appointments with pagination, including appointment details',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by appointment status',
  })
  @ApiQuery({
    name: 'archivedOnly',
    required: false,
    type: Boolean,
    description: 'Filter by archived status',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Filter by appointment date',
  })
  public async findAllAppointments(
    @Request() req: { user: AuthenticatedUser },
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status') status?: string,
    @Query('archivedOnly') archivedOnly = false,
    @Query('date') date?: string,
  ): Promise<PanelResponse<AppointmentPanelItem[]>> {
    let pageNumber = parseInt(page, 10);
    let limitNumber = parseInt(limit, 10);
    const statuses = status ? status.split(',') : [];
    if (isNaN(pageNumber) || pageNumber < 1) {
      pageNumber = 1;
    }
    if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
      limitNumber = 10;
    }
    return this.svc.listAppointments(
      req.user.organizationId,
      pageNumber,
      limitNumber,
      statuses,
      date,
      archivedOnly,
    );
  }

  @Patch('appointments/:id/confirm')
  @ApiOperation({
    summary: 'Confirm an appointment',
    description: 'Change the status of an appointment from pending to confirmed',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the appointment to confirm',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment confirmed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found or does not belong to organization',
  })
  public async confirmAppointment(
    @Request() req: { user: AuthenticatedUser },
    @Param('id') appointmentId: string,
  ): Promise<{ success: boolean; message: string }> {
    const id = parseInt(appointmentId, 10);
    if (isNaN(id)) {
      return {
        success: false,
        message: 'Invalid appointment ID',
      };
    }

    return this.svc.confirmAppointment(id, req.user.organizationId);
  }

  @Patch('appointments/:id/decline')
  @ApiOperation({
    summary: 'Decline an appointment',
    description: 'Change the status of an appointment from pending to declined',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the appointment to decline',
    type: Number,
  })
  @ApiBody({
    description: 'Optional cancellation reason',
    required: false,
    schema: {
      type: 'object',
      properties: {
        cancellationReason: {
          type: 'string',
          description: 'Reason for declining the appointment',
          example: 'Customer requested to reschedule',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment declined successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found or does not belong to organization',
  })
  public async declineAppointment(
    @Request() req: { user: AuthenticatedUser },
    @Param('id') appointmentId: string,
    @Body() body?: { cancellationReason?: string },
  ): Promise<{ success: boolean; message: string }> {
    const id = parseInt(appointmentId, 10);
    if (isNaN(id)) {
      return {
        success: false,
        message: 'Invalid appointment ID',
      };
    }

    return this.svc.declineAppointment(id, req.user.organizationId, body?.cancellationReason);
  }
}
