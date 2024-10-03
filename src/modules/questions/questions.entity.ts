import {BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {QuestionsReplyEntity} from "./questions_reply.entity";

@Entity('questions')
export class QuestionsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id:number;

  @Column({type:'varchar', length:10, nullable:false})
  code: string;

  @Column({type:'text',nullable:false})
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(()=>QuestionsReplyEntity, reply=>reply.boardId)
  replies:QuestionsReplyEntity[];

}