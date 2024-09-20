import {Controller, Get, Res} from "@nestjs/common";
import { ChatLogService } from "./chatlog.service";
import {Response} from "express";

@Controller('chatLog')
export class ChatLogController{
  constructor(private readonly chatLogService: ChatLogService) {}

  @Get()
  async getLogger(@Res() res: Response) {
    const result = await this.chatLogService.getChatLog({
      page:1,
      limit:20
    })
    res.send(result)
  }

  @Get()
  async getFilterLogger(@Res() res: Response) {
    res.send()
  }

}