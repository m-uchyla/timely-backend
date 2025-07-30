import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  public cost: number;
}
