import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../Users/User.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the organization', example: 1 })
  public id: number;

  @Column()
  @ApiProperty({ description: 'The name of the organization', example: 'Tech Corp' })
  public name: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'A brief description of the organization',
    example: 'A leading technology company',
  })
  public description: string;

  @Column({ default: true })
  @ApiProperty({ description: 'Indicates if the organization is active', example: true })
  public isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date the organization was created',
    example: '2025-07-30T12:00:00Z',
  })
  public createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date the organization was last modified',
    example: '2025-07-30T12:00:00Z',
  })
  public lastModifiedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId', referencedColumnName: 'id' })
  @ApiProperty({
    description: 'The user who owns the organization',
    type: () => User,
  })
  public owner: User;

  @Column()
  @ApiProperty({
    description: 'The ID of the user who owns the organization',
    example: 1,
  })
  public ownerId: number;
}
