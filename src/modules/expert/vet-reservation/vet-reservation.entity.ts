import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/user.entity";
import {PetEntity} from "../../pet/pet.entity";
import {ExpertEntity} from "../expert.entity";

@Entity('VetReservation')
export class VetReservationEntity {
    @PrimaryGeneratedColumn()
    hosReservationId: number;

    @ManyToOne(() => ExpertEntity, expert => expert.vetResvReqs, {nullable:false})
    @JoinColumn({ name: 'hospId' })
    hospId: ExpertEntity; // 수의사 Code

    @Column({type: 'date', comment:'예약 희망날짜'})
    resvDate: Date;

    @Column({type:'time', comment:'예약 희망시간'})
    prefTime: Date;

    @ManyToOne(()=>UserEntity, user => user.userCode, {nullable:false})
    @JoinColumn({name:'ownerName'}) // 예약자 성함
    owner: UserEntity;

    @ManyToOne(() => PetEntity, (pet) => pet.dogRegNo, {nullable:false})
    @JoinColumn({name:'petRegNo'})
    pet: PetEntity; // KindNm, petBirth 참조용

    @Column({type:'text', nullable:true, comment:'증상 등 서명'})
    description: string;

    @Column({type:'int', default: 0, comment:'예약 처리상태'})
    resvStatus: number;

    @Column({type:'timestamp', comment: '예약신청 시각'})
    createdAt: Date;

    @Column({type:'date', comment:'예약취소 시각', nullable: true})
    cancelAt: Date;
}
