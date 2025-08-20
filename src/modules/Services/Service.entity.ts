import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '../Organizations/Organization.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the service', example: 1 })
  public id: number;

  @Column()
  @ApiProperty({ description: 'The name of the service', example: 'Premium Cleaning' })
  public name: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'A brief description of the service',
    example: 'A premium cleaning service for offices and homes',
  })
  public description: string;

  @Column()
  @ApiProperty({ description: 'The duration of the service in minutes', example: 120 })
  public durationMinutes: number;

  @Column({ default: true })
  @ApiProperty({ description: 'Indicates if the service is active', example: true })
  public isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date the service was created',
    example: '2025-07-30T12:00:00Z',
  })
  public createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date the service was last modified',
    example: '2025-07-30T12:00:00Z',
  })
  public lastModifiedAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @ApiProperty({ description: 'The cost of the service', example: 99.99 })
  public cost: number;

  @Column()
  @ApiProperty({
    description: 'The ID of the organization offering the service',
    example: 1,
  })
  public organizationId: number;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId', referencedColumnName: 'id' })
  @ApiProperty({
    description: 'The organization offering the service',
    type: () => Organization,
  })
  public organization: Organization;
}
