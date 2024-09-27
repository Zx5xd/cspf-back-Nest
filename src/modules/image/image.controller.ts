import {
    Controller,
    Get,
    Param,
    Res,
    NotFoundException,
    Post,
    UseGuards,
    Req,
    UseInterceptors, UploadedFiles, NestInterceptor
} from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import { FilesInterceptor } from '@nestjs/platform-express';
import {Buffer} from "buffer";
import {ChatGateway} from "../chat/chat.gateway";

@Controller('images')
export class ImageController {
    constructor(
      private readonly imageService: ImageService,
      private readonly chatGateway: ChatGateway
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

    @Post(':roomId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 3) as unknown as NestInterceptor)
    async uploadImage(
      @Req() req,
      @Param('roomId') roomId: string,
      @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        // console.log(req.user.userCode)
        // console.log(files)
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;

        const savedFileUuids = [];

        for (const file of files) {
            const filename = file.filename
            const fileBuffer = file.buffer as Buffer;
            const savedFileUuid = await this.imageService.saveImage(filename, fileBuffer, roomId);
            savedFileUuids.push(`${protocol}://${host}/images/${roomId}/${savedFileUuid}`); // 각 파일의 UUID 저장
        }

        this.chatGateway.sendMessageToRoom(roomId,
            JSON.stringify({
                images:savedFileUuids
            }))

        return {
            message: 'Files uploaded and converted to webp successfully',
            // fileUuids: savedFileUuids, // 변환된 파일들의 UUID 반환
        };
    }
}
