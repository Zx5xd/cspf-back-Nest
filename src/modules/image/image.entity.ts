import {BaseEntity, BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ChatRoomEntity} from "../chatroom/chatroom.entity";
import {v4 as uuidv4} from "uuid";

@Entity('Image')
export class ImageEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    filename: string;

    @Column()
    path: string;

    @ManyToOne(() => ChatRoomEntity, chatRoom => chatRoom.images)
    @JoinColumn({ name: 'chatRoom' })  // 외래 키로 참조
    chatRoom: ChatRoomEntity; // 해당 이미지가 속한 채팅방

    @BeforeInsert()
    generateUUID() {
        this.uuid = uuidv4();  // UUID를 생성해서 ChatRoomID에 할당
    }
}