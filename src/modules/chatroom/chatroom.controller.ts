import {Body, Controller, Get, Post, Request, UseGuards} from "@nestjs/common";
import {ChatRoomService} from "@/modules/chatroom/chatroom.service";
import {JwtAuthGuard} from "@/modules/auth/jwt-auth.guard";
import {accessUsers} from "@/types/chatroomTypes";
import {ChatRoomEntity} from "@/modules/chatroom/chatroom.entity";

@Controller('chatRoom')
export class ChatRoomController {
    constructor(private chatRoomService: ChatRoomService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createRoom(@Request() req: any, @Body() expertCode:string ) {

        const accessUser:accessUsers = {
            owner:req.user.userCode,
            access:[req.user.userCode,expertCode],
            invite:[]
        }

        const roomId:string = await this.chatRoomService.create({accessUser:accessUser})
        return {
            id:roomId
        }
    }

    @Get()
    async getRooms(): Promise<ChatRoomEntity[]> {
        return await this.chatRoomService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/user/owner')
    async getUserCreateRooms(@Request() req: any) {
        const userCode = req.user.userCode;
        const result:ChatRoomEntity[] = await this.chatRoomService.findUserCreateRooms(userCode);
        return {
            content: result
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/user/access')
    async getUserAccessRooms(@Request() req: any) {
        const userCode = req.user.userCode;
        const result:ChatRoomEntity[] = await this.chatRoomService.findUserAccessRooms(userCode);
        return {
            content: result
        }
    }
}