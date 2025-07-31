import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../Employees/Employee.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the schedule', example: 1 })
  public id: number;

  @Column()
  @ApiProperty({
    description: 'The day of the week for the schedule. 1 is Monday and 7 is Sunday',
    example: 1,
  })
  public dayOfWeek: number;

  @Column({ type: 'time' })
  @ApiProperty({
    description: 'The start time of the schedule',
    example: '08:00:00',
  })
  public startTime: string;

  @Column({ type: 'time' })
  @ApiProperty({
    description: 'The end time of the schedule',
    example: '17:00:00',
  })
  public endTime: string;

  @Column({ default: true })
  @ApiProperty({ description: 'Indicates if the schedule is active', example: true })
  public isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date the schedule was created',
    example: '2025-07-30T12:00:00Z',
  })
  public createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date the schedule was last modified',
    example: '2025-07-30T12:00:00Z',
  })
  public lastModifiedAt: Date;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId', referencedColumnName: 'id' })
  @ApiProperty({
    description: 'The employee associated with the schedule',
    type: () => Employee,
  })
  public employee: Employee;

  @Column()
  @ApiProperty({
    description: 'The ID of the employee associated with the schedule',
    example: 1,
  })
  public employeeId: number;
}
