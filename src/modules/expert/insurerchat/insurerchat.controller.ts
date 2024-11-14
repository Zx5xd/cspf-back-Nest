import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';

import {createInsuereChatDto} from "@/dto/insurerchat.dto";
import {InsurerchatService} from "@/modules/expert/insurerchat/insurerchat.service";
import {JwtAuthGuard} from "@/modules/auth/jwt-auth.guard";


@Controller('insurerchat')
export class InsurerchatController {
  constructor(private readonly insurerchatService: InsurerchatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createInsurerchatDto: createInsuereChatDto, @Req() req) {
    return this.insurerchatService.create(createInsurerchatDto, req.user.userCode);
  }

  @Get('/cnt')
  @UseGuards(JwtAuthGuard)
  async lawyerCount(@Req() req) {
    return await this.insurerchatService.insurerCnt(req.user.userCode);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.insurerchatService.findOne(+id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.insurerchatService.findAll(req.user.userCode);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateInsurerchatDto: any, @Req() req) {
    updateInsurerchatDto.insurerId = req.user.userCode;
    return this.insurerchatService.updateStatus(+id, updateInsurerchatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insurerchatService.remove(+id);
  }

  @Get('commit/:id')
  @UseGuards(JwtAuthGuard)
  commitChat(@Req() req, @Param('id') id: string) {
    return this.insurerchatService.commitChat(+id, req.user.userCode);
  }
}
