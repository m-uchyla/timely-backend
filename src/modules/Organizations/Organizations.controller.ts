import { Body, Controller, Get, NotFoundException, Put, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role, Roles } from '../Auth/Roles';
import { UpdateOrganizationDto } from './DTO/update-organization.dto';
import { Organization as OrganizationEntity } from './Organization.entity';
import { OrganizationsService } from './Organizations.service';

@ApiTags('Organizations')
@Roles(Role.ADMIN, Role.OWNER)
@Controller('userOrganizations')
export class OrganizationsController {
  constructor(private readonly svc: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve the organization of the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'The organization of the logged-in user',
    type: OrganizationEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  public findUserOrganization(
    @Request() req: { user: { organizationId: number } },
  ): Promise<OrganizationEntity> {
    const organizationId = req.user.organizationId;
    if (!organizationId) {
      throw new NotFoundException('The logged-in user does not belong to any organization.');
    }
    return this.svc.findOne(organizationId);
  }

  @Put()
  @ApiOperation({ summary: 'Update an existing organization of the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'The organization has been successfully updated',
    type: OrganizationEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  public updateUserOrganization(
    @Request() req: { user: { organizationId: number } },
    @Body() updateDto: UpdateOrganizationDto,
  ): Promise<OrganizationEntity> {
    const user = req.user;
    if (!user.organizationId) {
      throw new NotFoundException('User does not belong to any organization');
    }
    return this.svc.update(user.organizationId, updateDto);
  }
}
