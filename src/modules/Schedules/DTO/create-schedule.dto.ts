import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The day of the week for the schedule. 1 is Monday and 7 is Sunday',
    example: 1,
  })
  public dayOfWeek: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The start time of the schedule',
    example: '08:00:00',
  })
  public startTime: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The end time of the schedule',
    example: '17:00:00',
  })
  public endTime: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the schedule is active. Optional',
    example: true,
  })
  public isActive?: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the employee associated with the schedule',
    example: 1,
  })
  public employeeId: number;
}
