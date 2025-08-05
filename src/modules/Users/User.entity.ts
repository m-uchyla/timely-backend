import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../Auth/Roles';
import { Organization } from '../Organizations/Organization.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the user', example: 1 })
  public id: number;

  @Column()
  @ApiProperty({ description: 'The first name of the user', example: 'John' })
  public firstName: string;

  @Column()
  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  public lastName: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'The email of the user', example: 'john.doe@example.com' })
  public email: string;

  @Column({ select: false })
  @ApiProperty({ description: 'The password of the user', example: 'securepassword123' })
  public password: string;

  @Column({ default: Role.USER, type: 'enum', enum: Role })
  @ApiProperty({ description: 'The role of the user', example: Role.USER })
  public role: Role;

  @Column({ default: true })
  @ApiProperty({ description: 'Indicates if the user is active', example: true })
  public isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'The date the user was created', example: '2025-07-30T12:00:00Z' })
  public createdAt: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'The ID of the organization that user owns',
    example: 1,
  })
  public organizationId: number;

  @OneToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId', referencedColumnName: 'id' })
  @ApiProperty({
    description: 'The organization offering the service',
    type: () => Organization,
  })
  public organization: Organization;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date the user was last modified',
    example: '2025-07-30T12:00:00Z',
  })
  public lastModifiedAt: Date;
}
