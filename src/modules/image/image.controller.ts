import {
    Controller,
    Get,
    InternalServerErrorException,
    NestInterceptor,
    NotFoundException,
    Param,
    Post, Query,
    Req,
    Res,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ImageService} from '@/modules/image/image.service';
import {Response} from 'express';
import {JwtAuthGuard} from "@/modules/auth/jwt-auth.guard";
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {Buffer} from "buffer";
import {ChatService} from "@/modules/chat/chat.service";
import {ChatLogService} from "@/modules/chatlog/chatlog.service";
import {Chat, ChatType, Pet, User, UserType} from "@/types/chatTypes";
import {UserService} from "@/modules/user/user.service";
import {UserEntity} from "@/modules/user/user.entity";


@Controller('images')
export class ImageController {
    constructor(
      private readonly imageService: ImageService,
      private readonly chatLogService: ChatLogService,
      private readonly chatService: ChatService,
      private readonly userService: UserService
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
    @Post('chat')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 3) as unknown as NestInterceptor)
    async uploadImage(
      @Req() req,
      @Query('roomId') roomId: string,
      @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        // console.log(req.user.userCode)
        // console.log(files)
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;

        const userCode = req.user.userCode ?? req.user.adminCode;
        const type = userCode.charAt(0);

        const savedFileUuids:Array<string> = [];

        const user:UserEntity = await this.userService.getUserById(req.user.username)

        const userType = (user instanceof UserEntity) ? UserType.User : UserType.Expert;

        for (const file of files) {
            // const filename = file.
            const filename = file.originalname
            const fileBuffer = file.buffer as Buffer;
            const encodeUUID = await this.imageService.saveChatImage(filename, fileBuffer, roomId, userCode, type);
            const url = `${protocol}://${host}/images/${roomId}/${encodeUUID}`
            savedFileUuids.push(url); // 각 파일의 UUID 저장

            const sendMsg:Chat = {
                userType: userType,
                msgType: ChatType.IMG,
                profile: {
                    userCode:user.userCode,
                    nickname:user.nickname,
                    profileImg:user.profileImg
                },
                msg: null,
                imgUrl: url,
                petMsg: null,
                date: new Date()
            }

            this.chatService.sendMessageToRoom(roomId,'message', sendMsg)
        }
        // this.chatService.sendMessageToAll('message','test')

        await this.chatLogService.addChatMessageList(roomId,userCode,savedFileUuids)

        return {
            message: 'Files uploaded and converted to webp successfully',
            // fileUuids: savedFileUuids, // 변환된 파일들의 UUID 반환
        };
    }





}
