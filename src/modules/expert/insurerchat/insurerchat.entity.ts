import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Timestamp} from "typeorm";
import {UserEntity} from "../../user/user.entity";
import {PetEntity} from "../../pet/pet.entity";
import {ExpertEntity} from "../expert.entity";
import * as timers from "node:timers";

@Entity('InsurerChat')
export class InsurerchatEntity {
    @PrimaryGeneratedColumn()
    insChatReqNumber: number;

    @ManyToOne(() => ExpertEntity, expert => expert.expertCode, {nullable:false})
    @JoinColumn({ name: 'insurerId' })
    insurerId: ExpertEntity;

    @Column({type: 'int', default:0, comment: '상담요청 처리상태(0: 미수락 상태, 1: 수락 상태, 2: 진행중, 3: 상담종료)', nullable: true})
    reqStatus: number;

    @Column({type: 'timestamp', comment: '상담요청 시각' })
    createdAt: Date;

    @Column({type: 'date', comment: '상담요청 취소시각', nullable: true})
    cancelAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.userCode, {nullable:false})
    @JoinColumn({ name: 'OwnerName' }) // 외래 키가 참조할 UserEntity의 컬럼 설정
    owner: UserEntity; // OwnerName 참조용

    @ManyToOne(() => PetEntity, pet => pet.dogRegNo, {nullable:false})
    @JoinColumn({name:'petRegNo'})
    pet: PetEntity; // petKindNm, petBirth 참조용

    // @Column()
    // name: string;

    // @Column()
    // kindNm: string;
    //
    // @Column()
    // petBirth: string;
}
