import {Controller, Get, HttpException, HttpStatus, Query, Req, UseGuards} from "@nestjs/common";
import { ChatLogService } from "./chatlog.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {AdminService} from "../admin/admin.service";
import {AdminEntity} from "../admin/admin.entity";

@Controller('chatLog')
export class ChatLogController{
  constructor(
      private readonly chatLogService: ChatLogService,
      private readonly adminService: AdminService
  ) {}

  /*
    http 요청시 query로 http://주소/chatLog?page=1&limit=20 형식으로 하거나 http://주소/chatLog로 보내면 된다.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getLogger(@Query() options,@Req() req) {
    const {userCode,username} = req.user;
    // console.log(userCode, username)
    const existAdmin:AdminEntity|undefined = await this.adminService.findOne(userCode,username)
    if (existAdmin) {
      // throw new HttpException('You do not have permission to access.', HttpStatus.UNAUTHORIZED);
      if (!options.page && !options.limit && !options.roomId) {
        return await this.chatLogService.getChatLog({
          page: 1,
          limit: 20,
        });
      } else {
        const page:number = parseInt(options.page)
        const limit:number = parseInt(options.limit)

        const option = {page,limit}

        if (options.roomId) {
          return await this.chatLogService.getChatLogFilter({
            roomId: options.roomId,
            page: page,
            limit: limit,
          });
        } else {
          return await this.chatLogService.getChatLog(option);
        }
      }
    }else{
      if (options.roomId) {
          const page:number = parseInt(options.page)
          const limit:number = parseInt(options.limit)

          const option = {page,limit}

          return await this.chatLogService.getChatLogFilter({
            roomId: options.roomId,
            page: page,
            limit: limit,
          });


      } else{
        // throw new HttpException('You do not have permission to access.', HttpStatus.UNAUTHORIZED);
        console.log('you do not have roomId')
      }


  }

}}