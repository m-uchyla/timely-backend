import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'The date of the appointment',
    example: '2025-07-30',
  })
  public appointmentDate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The start time of the appointment',
    example: '12:00:00',
  })
  public startTime: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The end time of the appointment',
    example: '13:00:00',
  })
  public endTime: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    description: 'Additional notes for the appointment',
    example: 'Customer requested a specific stylist.',
    required: false,
  })
  public notes?: string;

  // Removed the `cancellationReason` field as it is not appropriate for the CreateAppointmentDto.

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The price of the service for the appointment',
    example: 50.0,
    required: false,
  })
  public price?: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the employee associated with the appointment',
    example: 1,
  })
  public employeeId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the service associated with the appointment',
    example: 1,
  })
  public serviceId: number;
}
