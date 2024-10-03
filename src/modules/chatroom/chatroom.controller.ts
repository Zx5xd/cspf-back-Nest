import {Controller, Get, Post, Request, UseGuards} from "@nestjs/common";
import { ChatRoomService } from "./chatroom.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { accessUsers } from "../../types/chatroomTypes";
import {ChatRoomEntity} from "./chatroom.entity";

@Controller('chatRoom')
export class ChatRoomController {
    constructor(private chatRoomService: ChatRoomService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createRoom(@Request() req: any) {
        const accessUser:accessUsers = {
            owner:req.user.userCode,
            access:[req.user.userCode,],
            invite:[]
        }

        const roomId:string = await this.chatRoomService.create({accessUser:accessUser})
        return {
            id:roomId
        }
    }

    @Get()
    async getRooms(): Promise<ChatRoomEntity[]> {
        return this.chatRoomService.findAll();
    }
}