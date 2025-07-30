import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '../Organizations/Organization.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the employee', example: 1 })
  public id: number;

  @Column()
  @ApiProperty({ description: 'The first name of the employee', example: 'Jane' })
  public firstName: string;

  @Column()
  @ApiProperty({ description: 'The last name of the employee', example: 'Doe' })
  public lastName: string;

  @Column({ default: true })
  @ApiProperty({ description: 'Indicates if the employee is active', example: true })
  public isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date the employee was created',
    example: '2025-07-30T12:00:00Z',
  })
  public createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date the employee was last modified',
    example: '2025-07-30T12:00:00Z',
  })
  public lastModifiedAt: Date;

  @Column()
  @ApiProperty({
    description: 'The ID of the organization the employee belongs to',
    example: 1,
  })
  public organizationId: number;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId', referencedColumnName: 'id' })
  @ApiProperty({
    description: 'The organization the employee belongs to',
    type: () => Organization,
  })
  public organization: Organization;
}
