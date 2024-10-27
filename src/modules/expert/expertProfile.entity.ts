import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ExpertProfile')
export class ExpertProfileEntity {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;
  @Column({ type: 'text' })
  workexperience?: string;
  @Column({ type: 'varchar', length: 255 })
  companyaddr?: string;
  @Column({ type: 'text' })
  product?: string;
  @Column({ type: 'varchar', length: 255 })
  image?: string;
}
