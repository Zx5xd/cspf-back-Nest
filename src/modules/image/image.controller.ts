import {
    Controller,
    Get,
    InternalServerErrorException,
    NestInterceptor,
    NotFoundException,
    Param,
    Post,
    Query,
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
import {Chat, ChatType, UserType} from "@/types/chatTypes";
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

    // 방 ID와 UUID를 사용하여 이미지를 가져오는 엔드포인트
    @Get(':roomId/:uuid')
    async getImage(
        @Param('roomId') roomId: string,
        @Param('uuid') uuid: string,
        @Res() res: Response,
    ) {
        try {
            // 이미지 경로를 방 ID와 UUID로 가져옴
            const imagePath = await this.imageService.getImageByRoomIdAndUuid(roomId, uuid);
            // 이미지를 파일로 클라이언트에 전송
            res.sendFile(imagePath);
        } catch (error) {
            throw new NotFoundException('Image not found');
        }
    }

    // 전문가 코드로 인증 이미지를 가져오는 엔드포인트
    @Get(':expertCode')
    async getExpertCertImage(@Param('expertCode') expertCode: string) {
        try {
            return await this.imageService.getExpertCertImage(expertCode);
        } catch (error) {
            throw new NotFoundException('Image not found');
        }
    }

    // 전문가 인증 이미지를 업로드하는 엔드포인트
    @Post('cert')
    @UseInterceptors(FileInterceptor('file'))
    async expertCertImageUpload(
        @UploadedFile() file: Express.Multer.File,
    ) {
        try {
            return this.imageService.signupCertImage(file.buffer);
        } catch (error) {
            throw new InternalServerErrorException('Unable to save the image');
        }
    }


    // 채팅 이미지 파일을 업로드하는 엔드포인트 (최대 3개의 파일 업로드 가능)
    @Post('chat')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 3) as unknown as NestInterceptor)
    async uploadImage(
      @Req() req,
      @Query('roomId') roomId: string,
      @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        // 요청 헤더에서 호스트 정보를 가져옴 (프록시를 통한 요청 처리 지원)
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        // 요청 헤더에서 프로토콜 정보를 가져옴 (프록시를 통한 요청 처리 지원)
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;

        // 사용자 코드 또는 관리자 코드를 가져옴
        const userCode = req.user.userCode ?? req.user.adminCode;
        // 사용자 타입을 결정 (일반 사용자 또는 전문가)
        const type = userCode.charAt(0);

        const savedFileUuids:Array<string> = [];

        const user:UserEntity = await this.userService.getUserById(req.user.username)

        const userType = (user instanceof UserEntity) ? UserType.User : UserType.Expert;

        for (const file of files) {
            // 파일 원본 이름 변수 저장
            const filename = file.originalname
            const fileBuffer = file.buffer as Buffer;
            // 채팅 이미지 저장 후 UUID 인코딩된 파일명 반환
            const encodeUUID = await this.imageService.saveChatImage(filename, fileBuffer, roomId, userCode, type);
            // 이미지 접근 URL 생성
            const url = `${protocol}://${host}/images/${roomId}/${encodeUUID}`
            savedFileUuids.push(url); // 각 파일의 UUID 저장

            // 채팅 메시지 객체 생성
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
            // 채팅방에 메시지 전송
            this.chatService.sendMessageToRoom(roomId,'message', sendMsg)
        }
        // 채팅 메시지 로그에 추가
        await this.chatLogService.addChatMessageList(roomId,userCode,savedFileUuids)

        return {
            message: 'Files uploaded and converted to webp successfully'
        };
    }





}
