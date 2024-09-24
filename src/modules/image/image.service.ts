import {Injectable, NotFoundException} from "@nestjs/common";
import {ImageEntity} from "./image.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ChatRoomEntity} from "../chatroom/chatroom.entity";
import * as fs from 'fs';
import {join} from 'path';
import {Buffer} from 'buffer';
import * as process from "process";
import {v4} from "uuid";

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
        @InjectRepository(ChatRoomEntity)
        private readonly chatRoomRepository: Repository<ChatRoomEntity>
    ) {}

    async saveImage(imageBuffer: ArrayBuffer, chatRoomId: string): Promise<string> {
        // BufferSource가 Buffer가 아닌 경우 ArrayBuffer로 변환
        const buffer = Buffer.isBuffer(imageBuffer)
            ? imageBuffer
            : Buffer.from(imageBuffer);

        // 파일명 생성
        const filename = `${v4()}-${Date.now()}.webp`;
        const dir = join(process.cwd(), '../../uploads',chatRoomId);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // 파일 저장 경로 설정 (uploads 폴더에 저장)
        const imagePath = join(dir, chatRoomId, filename);

        // 파일 시스템에 이미지 저장
        fs.writeFileSync(imagePath, buffer);

        // DB에 이미지 경로와 정보를 저장하는 로직이 여기에 추가될 수 있습니다.

        const result = await this.imageRepository.create({
            chatRoom:{chatRoomID:chatRoomId},
            path:imagePath,
            filename:filename
        });
        await this.imageRepository.save(result);

        // 파일 경로나 UUID를 반환 (예시로 파일명 반환)
        return Buffer.from(result.uuid).toString('base64');
    }

    async getImageByRoomIdAndUuid(roomId: string, uuid: string): Promise<string> {
        const chatRoom = await this.chatRoomRepository.findOne({ where: { chatRoomID: roomId }, relations: ['images'] });
        if (!chatRoom) {
            throw new NotFoundException('Chat room not found');
        }

        const image = chatRoom.images.find(img => img.uuid === uuid);
        if (!image) {
            throw new NotFoundException('Image not found in this chat room');
        }

        if (!fs.existsSync(image.path)) {
            throw new NotFoundException('Image file not found');
        }

        return image.path;
    }


}