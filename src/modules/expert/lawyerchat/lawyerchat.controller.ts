import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req} from '@nestjs/common';
import {LawyerchatService} from "@/modules/expert/lawyerchat/lawyerchat.service";
import {ExpertService} from "@/modules/expert/expert.service";
import {UserService} from "@/modules/user/user.service";
import {JwtAuthGuard} from "@/modules/auth/jwt-auth.guard";
import {createLawyerChatDto, ReqLawyerChatDto} from "@/dto/lawyerchat.dto";

@Controller('lawyerchat')
export class LawyerchatController {
  constructor(
      private readonly lawyerchatService: LawyerchatService,
      private readonly expertService: ExpertService,
      private readonly userService: UserService,
              ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.lawyerchatService.findAll(req.user.userCode);
  }

  @Get('/cnt')
  @UseGuards(JwtAuthGuard)
  async lawyerCount(@Req() req) {
    return await this.lawyerchatService.lawyerCount(req.user.userCode);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req, @Param('id') id: string) {
    return this.lawyerchatService.findOne(+id, req.user.userCode);
  }

  @Get('commit/:id')
  @UseGuards(JwtAuthGuard)
  commitChat(@Req() req, @Param('id') id: string) {
    return this.lawyerchatService.commitChat(+id, req.user.userCode);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createLawyerchatDto: ReqLawyerChatDto, @Req() req) {
    const userCode = req.user.userCode
    
    const lawyerchat:createLawyerChatDto = {...createLawyerchatDto, ownerCode: userCode};
    lawyerchat.ownerCode = userCode

    return this.lawyerchatService.create(lawyerchat);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLawyerchatDto: any) {
    return this.lawyerchatService.updateStatus(+id, updateLawyerchatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lawyerchatService.remove(+id);
  }
}
