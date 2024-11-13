import {
  Entity,
  PrimaryColumn,
  Column,
  Unique,
  JoinColumn,
  OneToOne, OneToMany,
} from 'typeorm';
import { ExpertProfileEntity } from './expertProfile.entity';
import {ChatLogEntity} from "../chatlog/chatlog.entity";
import {ChatImageEntity} from "../image/image.entity";
import {InsurerchatEntity} from "./insurerchat/insurerchat.entity";

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
  credentialStatus?: number;

  @Column({ type: 'int', default: 0 })
  warnCount?: number;

  @Column({ type: 'varchar', length: 512, nullable: true })
  image?: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  certImage?: string;

  @Column({type:'text', nullable: true})
  refreshToken?: string;

  @OneToOne(() => ExpertProfileEntity)
  @JoinColumn()
  profile?: ExpertProfileEntity;

  @OneToMany(()=> ChatImageEntity, chatImage => chatImage.expert)
  chatImages: ChatImageEntity[];

  @OneToMany(() => ChatLogEntity, chatLog => chatLog.user)
  chatLogs: ChatLogEntity[];

  @OneToMany(() => InsurerchatEntity, insChat => insChat.insurerId)
  insChatReqs: InsurerchatEntity[];
}
