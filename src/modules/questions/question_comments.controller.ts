import {Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Res, UseGuards} from "@nestjs/common";
import {QuestionsService} from "./questions.service";
import {CommentDto} from "../../dto/comment.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {QuestionsCommentsEntity} from "./questions_comments.entity";

@Controller('comment')
export class QuestionCommentController {
  constructor(
    private readonly questionsService:QuestionsService
  ) {}

  @Get(':boardId/comments')
  async getComments(@Param('boardId') boardId:number):Promise<QuestionsCommentsEntity[]> {
    return await this.questionsService.findBoardComments(boardId);
  }

  @Get(':commentId')
  async getComment(@Res() res,@Param('commentId') commentId:number):Promise<QuestionsCommentsEntity> {
    const authorCode:string = res.user.userCode ?? res.user.adminCode;
    return await this.questionsService.findBoardComment(commentId,authorCode)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':boardId')
  async createComment(@Res() res,commentDto:CommentDto,@Param('boardId') boardId:number) {
    const authorCode:string = res.user.userCode ?? res.user.adminCode;
    const result:QuestionsCommentsEntity = await this.questionsService.createComment(boardId,authorCode,commentDto.content);
    return {
      id:result
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':commentId')
  async updateComment(@Res() res,@Param('commentId') commentId:number,commentDto:CommentDto) {
    const userCode = res.user.userCode ?? res.user.adminCode;
    const isUpdated:boolean = await this.questionsService.updateBoardComment(commentId,userCode,commentDto.content)
    if (!isUpdated) {
      throw new HttpException('Update failed, entity not found.', HttpStatus.NOT_FOUND);
    }
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(@Res() res,@Param('commentId') id:number) {
    const userCode = res.user.userCode ?? res.user.adminCode;
    await this.questionsService.deleteBoardComment(id,userCode);
    return {
      message: 'comment delete successful'
    }
  }
}