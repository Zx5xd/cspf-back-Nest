import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post, Req,
  UseGuards
} from "@nestjs/common";
import {QuestionsService} from "@/modules/questions/questions.service";
import {QuestionsCommentsEntity} from "@/modules/questions/questions_comments.entity";
import {JwtAuthGuard} from "@/modules/auth/jwt-auth.guard";
import {CommentDto} from "@/dto/comment.dto";

@Controller('comment')
export class QuestionCommentController {
  constructor(
    private readonly questionsService:QuestionsService
  ) {}

  @Get(':boardId/comments')
  async getComments(@Param('boardId') boardId:number):Promise<QuestionsCommentsEntity[]> {
    return await this.questionsService.findBoardComments(boardId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':commentId')
  async getComment(@Req() req,@Param('commentId') commentId:number):Promise<QuestionsCommentsEntity> {
    const authorCode:string = req.user.userCode ?? req.user.adminCode;
    return await this.questionsService.findBoardComment(commentId,authorCode)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':boardId')
  async createComment(@Req() req,@Body() commentDto:CommentDto,@Param('boardId') boardId:number) {
    const authorCode:string = req.user.userCode ?? req.user.adminCode;
    const result:QuestionsCommentsEntity = await this.questionsService.createComment(boardId,authorCode,commentDto.content);
    return {
      id:result
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':commentId')
  async updateComment(@Req() req,@Param('commentId') commentId:number,@Body() commentDto:CommentDto) {
    const userCode = req.user.userCode ?? req.user.adminCode;
    const isUpdated:boolean = await this.questionsService.updateBoardComment(commentId,userCode,commentDto.content)
    if (!isUpdated) {
      throw new HttpException('Update failed, entity not found.', HttpStatus.NOT_FOUND);
    }
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(@Req() req,@Param('commentId') id:number) {
    const userCode = req.user.userCode ?? req.user.adminCode;
    await this.questionsService.deleteBoardComment(id,userCode);
    return {
      message: 'comment delete successful'
    }
  }
}