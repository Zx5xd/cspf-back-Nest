import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {ChatRoomEntity} from "../chatroom/chatroom.entity";
import {v4 as uuidv4} from "uuid";
import {UserEntity} from "../user/user.entity";

export enum ImageType {
    EXPERT = 'expert',
    USER = 'user',
}

@Entity('ChatImage')
export class ChatImageEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    filename: string;

    @Column()
    path: string;

    @ManyToOne(() => ChatRoomEntity, chatRoom => chatRoom.images)
    @JoinColumn({ name: 'chatRoom' })  // 외래 키로 참조
    chatRoom: ChatRoomEntity; // 해당 이미지가 속한 채팅방

    @ManyToOne(() => UserEntity, user => user.chatImages)
    @JoinColumn({ name: 'userCode' })  // 외래 키로 참조
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @BeforeInsert()
    generateUUID() {
        this.uuid = uuidv4();  // UUID를 생성해서 ChatRoomID에 할당
    }
}

@Entity('Image')
export class ImageEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({type:'enum',enum:ImageType, nullable:false})
    type:ImageType;

    @Column({type:'text',nullable:false})
    filename: string;

    @Column({type:'text',nullable:false})
    path: string;

    @ManyToOne(() => UserEntity, user => user.userCode)
    @JoinColumn({ name: 'userCode' })  // 외래 키로 참조
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @BeforeInsert()
    generateUUID() {
        this.uuid = uuidv4();
    }
}