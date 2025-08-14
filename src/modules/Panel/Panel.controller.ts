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
  public findAllAppointments(
    @Request() req: { user: { organizationId: number } },
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<PanelResponse<AppointmentPanelItem[]>> {
    let pageNumber = parseInt(page, 10);
    let limitNumber = parseInt(limit, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      pageNumber = 1;
    }
    if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
      limitNumber = 10;
    }
    return this.svc.listServices(req.user.organizationId, pageNumber, limitNumber);
  }
}
