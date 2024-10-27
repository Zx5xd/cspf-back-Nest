// src/users/users.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('googleUser')
export class GoogleUsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  providerId: string;

  @Column()
  provider: string;

  @Column()
  givenName: string; // 이름

  @Column()
  familyName: string; // 성

  @Column({ unique: true })
  email: string;
}
