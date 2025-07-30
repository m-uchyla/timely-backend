import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from '../Organizations/Organization.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column({ default: true })
  public isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public lastModifiedAt: Date;

  @Column()
  public organizationId: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId', referencedColumnName: 'id' })
  public organization: Organization;
}
