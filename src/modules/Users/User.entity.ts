import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../Auth/Roles';

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
  @ApiProperty({ description: 'The role of the user', example: 'user' })
  public role: string;

  @Column({ default: true })
  @ApiProperty({ description: 'Indicates if the user is active', example: true })
  public isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'The date the user was created', example: '2025-07-30T12:00:00Z' })
  public createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date the user was last modified',
    example: '2025-07-30T12:00:00Z',
  })
  public lastModifiedAt: Date;
}
