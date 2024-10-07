import {BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {QuestionsCommentsEntity} from "./questions_comments.entity";

@Entity('questions')
export class QuestionsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id:number;

  @Column({type:'varchar',length:"255", nullable:false})
  title:string;

  @Column({type:'varchar', length:10, nullable:false})
  authorCode: string;

  @Column({type:'text',nullable:false})
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(()=>QuestionsCommentsEntity, reply=>reply.boardId)
  replies:QuestionsCommentsEntity[];

}