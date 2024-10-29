import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {ChatLogEntity} from "../chatlog/chatlog.entity";
import {ChatRoomEntity} from "../chatroom/chatroom.entity";

@Entity('chatComplaint')
@Unique(['id'])
export class ChatComplaintEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, comment: '신고자' })
  declarer: string;

  @Column({ type: 'varchar', length: 10, comment: '가해자' })
  perpetrator: string;

  @ManyToOne(() => ChatRoomEntity, chatRoom => chatRoom.chatRoom)
  @JoinColumn({ name: 'chatRoomId' })
  chatRoomId: string;

  @ManyToOne(() => ChatLogEntity, chatLog => chatLog.chatMessage)
  @JoinColumn({ name: 'chatMessage' })
  chatLogs: ChatLogEntity;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
    comment: '채팅 신고 사유',
  })
  description: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'int', default: 0, comment: "처리상태. 0: 미처리, 1: 가해자 경고, 2: 가해자 미경고" })
  processingStatus: number;
}
