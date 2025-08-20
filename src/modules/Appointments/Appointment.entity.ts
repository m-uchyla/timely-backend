import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../Clients/Client.entity';
import { Employee } from '../Employees/Employee.entity';
import { Organization } from '../Organizations/Organization.entity';
import { Service } from '../Services/Service.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
  CANCELLED = 'cancelled',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the appointment', example: 1 })
  public id: number;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({
    description: 'The date of the appointment',
    example: '2025-07-30',
  })
  public appointmentDate: string;

  @Column({ type: 'time' })
  @ApiProperty({
    description: 'The start time of the appointment',
    example: '12:00:00',
  })
  public startTime: string;

  @Column({ type: 'time' })
  @ApiProperty({
    description: 'The end time of the appointment',
    example: '13:00:00',
  })
  public endTime: string;

  @Column({ default: AppointmentStatus.PENDING, type: 'enum', enum: AppointmentStatus })
  @ApiProperty({ description: 'Indicates the appointment status', example: 'pending' })
  public status: AppointmentStatus;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: 'Indicates whether the appointment is archived', example: false })
  public isArchived: boolean;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Additional notes for the appointment',
    example: 'Customer requested a specific stylist.',
  })
  public notes: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Reason for appointment cancellation',
    example: 'Customer was unavailable.',
  })
  public cancellationReason: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @ApiProperty({
    description: 'The price of the service for the appointment',
    example: 50.0,
  })
  public price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date the appointment was created',
    example: '2025-07-30T12:00:00Z',
  })
  public createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date the appointment was last modified',
    example: '2025-07-30T12:00:00Z',
  })
  public lastModifiedAt: Date;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId', referencedColumnName: 'id' })
  @ApiProperty({
    description: 'The employee associated with the appointment',
    type: () => Employee,
  })
  public employee: Employee;

  @Column()
  @ApiProperty({
    description: 'The ID of the employee associated with the appointment',
    example: 1,
  })
  public employeeId: number;

  @ManyToOne(() => Service, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId', referencedColumnName: 'id' })
  @ApiProperty({
    description: 'The service associated with the appointment',
    type: () => Service,
  })
  public service: Service;

  @Column()
  @ApiProperty({
    description: 'The ID of the service associated with the appointment',
    example: 1,
  })
  public serviceId: number;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'id' })
  @ApiProperty({
    description: 'The client associated with the appointment',
    type: () => Client,
  })
  public client: Client;

  @Column()
  @ApiProperty({
    description: 'The ID of the client associated with the appointment',
    example: 1,
  })
  public clientId: number;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId', referencedColumnName: 'id' })
  @ApiProperty({
    description: 'The organization associated with the appointment',
    type: () => Organization,
  })
  public organization: Organization;

  @Column()
  @ApiProperty({
    description: 'The ID of the organization associated with the appointment',
    example: 1,
  })
  public organizationId: number;
}
