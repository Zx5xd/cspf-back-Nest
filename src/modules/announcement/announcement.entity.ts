import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {AdminEntity} from "../admin/admin.entity";

@Entity('announcement')
export class AnnouncementEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>AdminEntity,admin=>admin.announcements, {nullable: false})
  @JoinColumn({ name: 'announcement_adminCode' })
  admin: AdminEntity;

  @Column({type:'text',nullable:false})
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}