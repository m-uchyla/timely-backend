import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  durationMinutes: number;

  @Column({ default: 0 })
  pausePeriodMinutes: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  cost: number;
}
