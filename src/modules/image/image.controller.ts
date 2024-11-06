import {
    Controller,
    Get,
    Param,
    Res,
    NotFoundException,
    Post,
    UseGuards,
    Req,
    UseInterceptors, UploadedFiles, NestInterceptor, UploadedFile, InternalServerErrorException, SetMetadata
} from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {Buffer} from "buffer";
import {ChatService} from "../chat/chat.service";
import {ChatLogService} from "../chatlog/chatlog.service";

@Controller('images')
export class ImageController {
    constructor(
      private readonly imageService: ImageService,
      private readonly chatLogService: ChatLogService,
      private readonly chatService: ChatService
    ) {}

    @Get(':roomId/:uuid')
    async getImage(
        @Param('roomId') roomId: string,
        @Param('uuid') uuid: string,
        @Res() res: Response,
    ) {
        try {
            const imagePath = await this.imageService.getImageByRoomIdAndUuid(roomId, uuid);
            res.sendFile(imagePath);
        } catch (error) {
            throw new NotFoundException('Image not found');
        }
    }

    // 마이그레이션
    @Get(':expertCode')
    async getExpertCertImage(@Param('expertCode') expertCode: string) {
        try {
            const imagePath = await this.imageService.getExpertCertImage(expertCode);
            return imagePath;
        } catch (error) {
            throw new NotFoundException('Image not found');
        }
    }

    @Post('cert')
    @UseInterceptors(FileInterceptor('file'))
    async expertCertImageUpload(
        @UploadedFile() file: Express.Multer.File, // 여기에서 @UploadedFile()이 매개변수 `file` 앞에 있어야 합니다.
    ) {
        try {

            return this.imageService.signupCertImage(file.buffer);
        } catch (error) {
            console.error('Error while saving image:', error);
            throw new InternalServerErrorException('Unable to save the image');
        }
    }


    // 채팅 이미지 저장
    @Post(':roomId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 3) as unknown as NestInterceptor)
    async uploadImage(
      @Req() req,
      @Param('roomId') roomId: string,
      @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        // console.log(req.user.userCode)
        console.log(files)
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;

        const userCode = req.user.userCode ?? req.user.adminCode;
        const type = userCode.charAt(0);

        const savedFileUuids:Array<string> = [];

        for (const file of files) {
            // const filename = file.
            const filename = file.originalname
            const fileBuffer = file.buffer as Buffer;
            const savedFileUuid = await this.imageService.saveChatImage(filename, fileBuffer, roomId, userCode, type);
            savedFileUuids.push(`${protocol}://${host}/images/${roomId}/${savedFileUuid}`); // 각 파일의 UUID 저장
        }
        // this.chatService.sendMessageToAll('message','test')
        this.chatService.sendMessageToRoom(roomId,'image',
            JSON.stringify({
                userCode:userCode,
                images:savedFileUuids
            })
        )

        await this.chatLogService.addChatMessageList(roomId,userCode,savedFileUuids)

        return {
            message: 'Files uploaded and converted to webp successfully',
            // fileUuids: savedFileUuids, // 변환된 파일들의 UUID 반환
        };
    }





}
