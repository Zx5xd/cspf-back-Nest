import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

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
}