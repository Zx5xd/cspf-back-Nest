import {Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Res, UseGuards} from "@nestjs/common";
import {QuestionsService} from "./questions.service";
import {ReplyDto} from "../../dto/reply.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('reply')
export class QuestionReplyController {
  constructor(
    private readonly questionsService:QuestionsService
  ) {}

  @Get(':boardId/comments')
  async getReplies(@Param('boardId') boardId:number) {
    return await this.questionsService.findBoardReplies(boardId);
  }

  @Get(':replyId')
  async getReply(@Param('replyId') replyId:number) {
    return await this.questionsService.findBoardReply(replyId)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReply(@Res() res,replyDto:ReplyDto) {
    const authorCode = res.user.userCode ?? res.user.adminCode;
    const result = await this.questionsService.createQuestion(authorCode,replyDto.content);
    return {
      id:result
    }
  }

  @Patch(':replyId')
  async updateReply(@Param('replyId') replyId:number,replyDto:ReplyDto) {
    const isUpdated = await this.questionsService.updateBoardReply(replyId,replyDto.content)
    if (!isUpdated) {
      throw new HttpException('Update failed, entity not found.', HttpStatus.NOT_FOUND);
    }
    return { success: true };
  }

  @Delete(':replyId')
  async deleteReply(@Param('replyId') id:number) {
    await this.questionsService.deleteBoardReply(id);
    return {
      message: 'reply delete successful'
    }
  }
}