// src/users/users.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  naverId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;
}
