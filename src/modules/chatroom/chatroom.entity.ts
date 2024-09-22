import {BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {accessUsers} from "../../types/chatroomTypes";
import {ChatLogEntity} from "../chatlog/chatlog.entity";
import { v4 as uuidv4 } from 'uuid';
import {ImageEntity} from "../image/image.entity";

@Entity('ChatRoom')
export class ChatRoomEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    chatRoomID: string;
    @Column({type:'json',nullable:true,default:null})
    chatMembersCode:Array<string>;
    @Column({type:'text',nullable:true,default:null})
    chatRoom:string;
    @CreateDateColumn({type:'timestamp'})
    creationTime:Date;
    @Column({type:'datetime',nullable:true,default:null})
    consultEndTime:Date;
    @Column({
        type: 'json',
        name: 'accessUser',
        nullable: true,
        default: null,
        comment: 'ChatRoom 접속 가능 유저 리스트. JSON 오브젝트 형태. 자세한 사항은 Discord 공지 참조',
    })
    accessUser: accessUsers;

    @OneToMany(() => ChatLogEntity, chatLog => chatLog.chatRoom)
    chatLogs: ChatLogEntity[];

    @OneToMany(() => ImageEntity, image => image.chatRoom)
    images: ImageEntity[]; // ChatRoom에서 업로드된 이미지들

    @BeforeInsert()
    generateUUID() {
        this.chatRoomID = uuidv4();  // UUID를 생성해서 ChatRoomID에 할당
    }
}