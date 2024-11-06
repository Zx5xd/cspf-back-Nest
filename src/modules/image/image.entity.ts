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
import {ExpertEntity} from "../expert/expert.entity";

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

    @ManyToOne(() => UserEntity, user => user.chatImages, { nullable: true })
    @JoinColumn({ name: 'userCode' })  // 외래 키로 참조
    user: UserEntity;

    @ManyToOne(() => ExpertEntity, expert => expert.chatImages, {nullable: true})
    @JoinColumn({ name: 'expertCode' })  // 외래 키로 참조
    expert: ExpertEntity;

    @Column({type:'varchar',length:8})
    type: 'USER' | 'EXPERT';

    @CreateDateColumn()
    createdAt: Date;

    @BeforeInsert()
    generateUUID() {
        this.uuid = uuidv4();  // UUID를 생성해서 ChatRoomID에 할당
    }
}

@Entity('ProfileImage')
export class ImageEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

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