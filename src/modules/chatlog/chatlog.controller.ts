import { Controller } from "@nestjs/common";
import { ChatLogService } from "./chatlog.service";

@Controller('chatLog')
export class ChatLogController{
  constructor(private readonly chatLogService: ChatLogService) {}

}