import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(7)
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
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'startTime must be in the format HH:mm:ss',
  })
  public startTime: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The end time of the schedule',
    example: '17:00:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'endTime must be in the format HH:mm:ss',
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
