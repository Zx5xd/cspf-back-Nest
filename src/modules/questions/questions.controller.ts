import {Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, UseGuards} from "@nestjs/common";
import {QuestionsService} from "./questions.service";
import {QuestionsDto} from "../../dto/questions.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService:QuestionsService
  ) {}

  @Get()
  async findAll() {
    return await this.questionsService.findAll()
  }

  @Get(':boardId')
  async findBoard(@Param('boardId') boardId:number) {
    return await this.questionsService.findOne(boardId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBoard(@Req() req,questionDto:QuestionsDto) {
    const code = req.user.userCode ?? req.user.adminCode
    const result = await this.questionsService.createQuestion(code,questionDto.content)
    return {
      id: result,
      message:'question board is create successful.'
    }
  }

  @Patch(':boardId')
  async editBoard(@Param('boardId') boardId: number,questionDto:QuestionsDto) {
    const isUpdated = await this.questionsService.update(boardId,questionDto.content);

    if (!isUpdated) {
      throw new HttpException('Update failed, entity not found.', HttpStatus.NOT_FOUND);
    }

    return { success: true };
  }

  @Delete(':boardId')
  async deleteBoard(@Param('boardId') boardId: number) {
    await this.questionsService.delete(boardId);
    return { success: true };
  }
}