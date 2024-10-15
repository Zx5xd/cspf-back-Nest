import {Injectable, NotFoundException} from "@nestjs/common";
import {ChatImageEntity, ImageEntity, ImageType} from "./image.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ChatRoomEntity} from "../chatroom/chatroom.entity";
import * as fs from 'fs';
import {join} from 'path';
import {Buffer} from 'buffer';
import * as process from "process";
import {v4} from "uuid";
import * as sharp from "sharp";
import * as zlib from "zlib";
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(ChatImageEntity)
        private readonly chatImageRepository: Repository<ChatImageEntity>,
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
        @InjectRepository(ChatRoomEntity)
        private readonly chatRoomRepository: Repository<ChatRoomEntity>
    ) {}

    async imageProcess(uri:string,imgBuffer:Buffer):Promise<{filename:string,directory:string}> {
        const filename = `${Date.now()}_${v4()}.webp`
        const dir = join(process.cwd(), uri);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const imagePath:string = join(dir, filename);
        await sharp(imgBuffer).webp({quality:100}).toFile(imagePath);

        return {
            filename,
            directory:dir
        }
    }

    async saveChatImage(filename:string,imgBuffer:Buffer, chatRoomId:string, userCode:string):Promise<string> {
        try {
            const file = await this.imageProcess(join("./uploads","chatImage",chatRoomId),imgBuffer);

            const result:ChatImageEntity = this.chatImageRepository.create({
                chatRoom: { chatRoomID: chatRoomId },
                path: file.directory,
                filename,
                user:{userCode}
            });
            await this.chatImageRepository.save(result);

            return Buffer.from(result.uuid).toString('base64');
        } catch (err) {
            console.error('Error saving image:', err);
            throw new Error('Image save failed');
        }
    }

    async saveDefaultImage(type:ImageType,filename:string, imgBuffer:Buffer, userCode:string) {
        try {
            const file = await this.imageProcess(
              join("./uploads",type+"Image"),
              imgBuffer
            );

            const result:ImageEntity = this.imageRepository.create({
                type,
                path:file.directory,
                filename,
                user:{userCode}
            });
            await this.imageRepository.save(result);

            return Buffer.from(result.uuid).toString('base64');
        } catch (err) {
            console.error('Error saving image:', err);
            throw new Error('Image save failed');
        }
    }

    /**
     * @deprecated 해당 함수는 File System과 DB 작업을 분리하기 위해 지원이 종료되었습니다.
     */
    async saveImage(_filename:string, imageBuffer: Buffer, chatRoomId: string): Promise<string> {
        // BufferSource가 Buffer가 아닌 경우 ArrayBuffer로 변환
        /*const buffer = Buffer.isBuffer(imageBuffer)
            ? imageBuffer
            : Buffer.from(imageBuffer);*/

        // 파일명 생성
        const filename = `${Date.now()}_${v4()}.webp`;
        const dir = join(process.cwd(), './uploads',chatRoomId);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        /*// 파일 저장 경로 설정 (uploads 폴더에 저장)
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
        return Buffer.from(result.uuid).toString('base64');*/

        // 파일 저장 경로 설정 (uploads 폴더에 저장)
        const imagePath = join(dir, filename);

        try {
            // Sharp을 이용해 webp로 변환 후 저장
            await sharp(imageBuffer)
              .webp({ quality: 100 }) // 변환 품질 설정 (0-100)
              .toFile(imagePath); // webp로 변환된 파일을 저장

            // DB에 이미지 경로와 정보를 저장하는 로직
            const result = this.chatImageRepository.create({
                chatRoom: { chatRoomID: chatRoomId },
                path: imagePath,
                filename: filename,
            });
            await this.chatImageRepository.save(result);

            // 파일 경로나 UUID를 반환 (예시로 파일명 반환)
            return Buffer.from(result.uuid).toString('base64');
        } catch (error) {
            console.error('Error saving image:', error);
            throw new Error('Image save failed');
        }
    }

    async getImageByRoomIdAndUuid(roomId: string, uuid: string): Promise<string> {
        const chatRoom = await this.chatRoomRepository.findOne({ where: { chatRoomID: roomId }, relations: ['images'] });
        if (!chatRoom) {
            throw new NotFoundException('Chat room not found');
        }

        const buffer = Buffer.from(uuid, 'base64').toString('utf8'); // Base64 문자열을 Buffer로 변환

        const image = chatRoom.images.find(img => img.uuid === buffer);
        if (!image) {
            throw new NotFoundException('Image not found in this chat room');
        }

        if (!fs.existsSync(image.path)) {
            throw new NotFoundException('Image file not found');
        }

        return image.path;
    }


}