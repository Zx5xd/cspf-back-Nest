import {Controller, Get, Query, Req, Res, UseGuards} from "@nestjs/common";
import { ChatLogService } from "./chatlog.service";
import {Response} from "express";
import {ChatLogFilterDto} from "../../dto/chatlog.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {AdminService} from "../admin/admin.service";

@Controller('chatLog')
export class ChatLogController{
  constructor(
      private readonly chatLogService: ChatLogService,
      private readonly adminService: AdminService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getLogger(@Query() options:ChatLogFilterDto,@Req() req,@Res() res: Response) {
    const {userCode,username} = req.user;
    const existAdmin = await this.adminService.findOne(userCode,username)
    if (!existAdmin) {
      return res.status(401).send({message:'You do not have permission to access.'})
    }

    if (!options) {
      const result = await this.chatLogService.getChatLog({
        page:1,
        limit:20
      })
      return res.send(result)
    } else {
      if (options.roomId) {
        const result = await this.chatLogService.getChatLogFilter({
          roomId:options.roomId,
          page:options.page,
          limit:options.limit
        })
        return res.send(result)
      } else {
        const result = await this.chatLogService.getChatLog({
          page:options.page,
          limit:options.limit
        })
        return res.send(result)
      }
    }
  }

}