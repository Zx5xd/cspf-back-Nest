import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ExpertEntity} from "../expert.entity";
import {UserEntity} from "../../user/user.entity";

@Entity('LawyerChat')
export class LawyerchatEntity {

    @PrimaryGeneratedColumn()
    lawChatReqId: number;

    @ManyToOne(()=>ExpertEntity, expert => expert.lawChatReqs, {nullable:false})
    @JoinColumn({name: 'lawyerId'})
    lawyerCode : ExpertEntity;

    @Column({type:'date', comment:'요청시각'})
    reqDate : Date;

    @Column({type:'time', comment:'희망시간'})
    prefTime: string;

    @Column({type:'int', default:0, nullable:true, comment:'상담 처리상태(0: 미수락 상태, 1: 수락 상태, 2: 진행중, 3: 상담종료)'})
    reqStatus: number;

    @ManyToOne(()=>UserEntity, (user) => user.userCode, {nullable:false})
    @JoinColumn({ name: 'OwnerCode' })
    ownerCode: UserEntity;

    @Column({type:'text', nullable: true, comment:'신청사유'})
    description: string;

    @Column({type:'timestamp'})
    createdAt: Date;

    @Column({type:'date', nullable:true})
    cancelDate: Date;
}
