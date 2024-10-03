import {Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {QuestionsEntity} from "./questions.entity";

@Entity('questions_reply')
export class QuestionsReplyEntity{
  @PrimaryGeneratedColumn()
  id:number;

  @Index()  // 인덱스 추가
  @Column({ type: 'int' })
  boardId: number | null;

  @Column({type:'varchar',length:"12"})
  authorCode:string;

  @Column({type:'text'})
  content:string;

  @CreateDateColumn()
  createdAt:Date;

  @ManyToOne(() => QuestionsEntity, (contactRequest) => contactRequest.replies, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'boardId' })  // 외래키 컬럼 지정
  board: QuestionsEntity;
}