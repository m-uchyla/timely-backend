import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from '../Organizations/Organization.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public description: string;

  @Column()
  public durationMinutes: number;

  @Column({ default: 0 })
  public pausePeriodMinutes: number;

  @Column({ default: true })
  public isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public lastModifiedAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  public cost: number;

  @Column()
  public organizationId: number;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId', referencedColumnName: 'id' })
  public organization: Organization;
}
