import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../Appointment.entity';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsEnum(AppointmentStatus)
  @ApiProperty({
    description: 'The status of the appointment',
    enum: AppointmentStatus,
    example: AppointmentStatus.CONFIRMED,
    required: false,
  })
  public status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({
    description: 'Reason for appointment cancellation or decline',
    example: 'Customer requested to reschedule',
    required: false,
  })
  public cancellationReason?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Indicates whether the appointment is archived',
    example: false,
    required: false,
  })
  public isArchived?: boolean;
}
