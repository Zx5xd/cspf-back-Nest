import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ChatRoomEntity} from "../chatroom/chatroom.entity";

@Entity('Image')
export class ImageEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    filename: string;

    @Column()
    path: string;

    @ManyToOne(() => ChatRoomEntity, chatRoom => chatRoom.images)
    chatRoom: ChatRoomEntity; // 해당 이미지가 속한 채팅방
}