import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post, Query,
  Req,
  UseGuards
} from "@nestjs/common";
import {QuestionsService} from "./questions.service";
import {QuestionsDto} from "../../dto/questions.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService:QuestionsService
  ) {}

  @Get()
  async finaPagination(@Query('page') page:number, @Query('limit') limit?:number) {
    console.log('questions page')
    return this.questionsService.pagination(page, limit);
  }

  @Get(':boardId')
  async findBoard(@Param('boardId') boardId:number) {
    return await this.questionsService.findOne(boardId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBoard(@Req() req,@Body() questionDto:QuestionsDto) {
    const code = req.user.userCode ?? req.user.adminCode;
    const result = await this.questionsService.createQuestion(code,questionDto)
    return {
      id: result,
      message:'question board is create successful.'
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':boardId')
  async editBoard(@Req() req,@Param('boardId') boardId: number,@Body() questionDto:QuestionsDto) {
    const code = req.user.userCode ?? req.user.adminCode
    const isUpdated = await this.questionsService.update(code,boardId,questionDto);

    if (!isUpdated) {
      throw new HttpException('Update failed, entity not found.', HttpStatus.NOT_FOUND);
    }

    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':boardId')
  async deleteBoard(@Req() req,@Param('boardId') boardId: number) {
    const code = req.user.userCode ?? req.user.adminCode
    await this.questionsService.delete(code,boardId);
    return { success: true };
  }
}