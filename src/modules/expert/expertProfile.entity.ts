import {Column, Entity, OneToOne, PrimaryColumn} from 'typeorm';
import {ExpertEntity} from "@/modules/expert/expert.entity";

@Entity('ExpertProfile')
export class ExpertProfileEntity {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;
  @Column({ type: 'text', nullable: true })
  workexperience?: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  companyaddr?: string;
  @Column({ type: 'text', nullable: true })
  product?: string;
  @Column({ type: 'varchar', length: 255, nullable:true })
  image?: string;
  @OneToOne(() => ExpertEntity, entity => entity.expertCode, {nullable: true})
  expertCode: ExpertEntity;
}
