import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role, Roles } from '../Auth/Roles';
import { PanelService } from './Panel.service';
import { PanelResponse } from './types/ApiResponses';
import { AppointmentPanelItem } from './types/ApiResponses';

@ApiTags('Panel')
@Roles(Role.ADMIN, Role.OWNER)
@Controller('panel')
export class PanelController {
  constructor(private readonly svc: PanelService) {}

  // eslint-disable-next-line @typescript-eslint/max-params
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
    name: 'date',
    required: false,
    type: String,
    description: 'Filter by appointment date',
  })
  public findAllAppointments(
    @Request() req: { user: { organizationId: number } },
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status') status?: string,
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
    );
  }
}
