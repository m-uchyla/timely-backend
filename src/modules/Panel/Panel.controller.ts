import { Controller, Get, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, Roles } from '../Auth/Roles';
import { PanelService } from './Panel.service';
import { PanelResponse } from './types/ApiResponses';
import { AppointmentPanelItem } from './types/ApiResponses';

@ApiTags('Panel')
@Roles(Role.ADMIN, Role.OWNER)
@Controller('panel')
export class PanelController {
  constructor(private readonly svc: PanelService) {}

  @Get('services')
  @ApiOperation({ summary: 'Retrieve all services with pagination, including appointment details' })
  @Get('appointments')
  @ApiOperation({ summary: 'Retrieve all appointments with pagination, including appointment details' })
  public findAllAppointments(
    @Request() req: { user: { organizationId: number } },
  ): Promise<PanelResponse<AppointmentPanelItem[]>> {
    return this.svc.listServices(req.user.organizationId);
  }
}
