import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn, BaseEntity, ManyToOne, JoinColumn, OneToMany
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { ChatRoomEntity } from "../chatroom/chatroom.entity";
import {ChatComplaintEntity} from "../chat-complaint/chatcomp.entity";

@Entity('ChatLog')
export class ChatLogEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type:'bigint'})
  chatLogID: number;  // 고유 식별자, 자동 생성됨

  @CreateDateColumn({type:'timestamp'})
  createdAt: Date;

  @ManyToOne(() => UserEntity, user => user.chatLogs, { nullable: true })
  @JoinColumn({ name: 'chatUserCode' })
  user: UserEntity;

  @ManyToOne(() => ChatRoomEntity, chatRoom => chatRoom.chatLogs, { nullable: false })
  @JoinColumn({ name: 'chatRoomID' })  // 외래 키로 참조
  chatRoom: ChatRoomEntity;

  @OneToMany(() => ChatComplaintEntity, chatCompaint => chatCompaint.chatLogs)
  chatCompaints: ChatComplaintEntity[];

  @Column({ type: 'text' })
  chatMessage: string;  // 채팅 메시지 저장

  @Column({type:'varchar', length:512, nullable: true})
  chatImageUrl: string;
}
