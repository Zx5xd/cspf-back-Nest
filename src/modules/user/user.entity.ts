import {Entity, Column, Unique, CreateDateColumn, PrimaryColumn, OneToMany} from 'typeorm';
import {ChatLogEntity} from "../chatlog/chatlog.entity";
import {PetEntity} from "../pet/pet.entity";

@Entity('User')
@Unique(['username'])
export class UserEntity {

    @PrimaryColumn({type:'varchar',length:10})
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

    @Column({ type: 'text', nullable: true})
    imageUrl: string | null;

    @CreateDateColumn({ type: 'timestamp' })
    createdTime: Date;

    @OneToMany(() => ChatLogEntity, chatLog => chatLog.user)
    chatLogs: ChatLogEntity[];

    @OneToMany(() => PetEntity, pet => pet.owner)
    pets: PetEntity[];
}
