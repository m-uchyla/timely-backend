import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '../Organizations/Organization.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the client', example: 1 })
  public id: number;

  @Column()
  @ApiProperty({ description: 'The first name of the client', example: 'John' })
  public firstName: string;

  @Column()
  @ApiProperty({ description: 'The last name of the client', example: 'Doe' })
  public lastName: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'The email of the client', example: 'john.doe@example.com' })
  public email: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'The phone number of the client', example: '123-456-7890' })
  public phone: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'The date the client was created', example: '2025-07-30T12:00:00Z' })
  public createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date the client was last modified',
    example: '2025-07-30T12:00:00Z',
  })
  public lastModifiedAt: Date;

  @Column()
  @ApiProperty({
    description: 'The ID of the organization the client belongs to',
    example: 1,
  })
  public organizationId: number;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId', referencedColumnName: 'id' })
  @ApiProperty({
    description: 'The organization the client belongs to',
    type: () => Organization,
  })
  public organization: Organization;
}
