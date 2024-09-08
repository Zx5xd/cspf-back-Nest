import { Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn } from 'typeorm';

@Entity('User')
@Unique(['username'])
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    userCode: string;

    @Column({ type: 'varchar', length: 255 })
    username: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    nickname: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    addr: string;

    @Column({ type: 'varchar', length: 20 })
    phone: string;

    @Column({type:'text', nullable: true})
    refreshToken: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    gender: string | null;

    @Column({ type: 'char', length: 1, nullable: true })
    petOwnership: string | null;

    @CreateDateColumn({ type: 'timestamp' })
    createdTime: Date;
}
