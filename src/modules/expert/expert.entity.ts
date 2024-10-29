import {
  Entity,
  PrimaryColumn,
  Column,
  Unique,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ExpertProfileEntity } from './expertProfile.entity';

@Entity('Expert')
@Unique(['username'])
export class ExpertEntity {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  expertCode: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  company: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'int', default: 0 })
  credentialStatus: number;

  @Column({ type: 'int', default: 0 })
  warnCount: number;

  @Column({ type: 'varchar', length: 512, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  certImage: string;

  @Column({type:'text', nullable: true})
  refreshToken: string;

  @OneToOne(() => ExpertProfileEntity)
  @JoinColumn()
  profile: ExpertProfileEntity;
}
