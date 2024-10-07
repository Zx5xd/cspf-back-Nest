import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {QuestionsEntity} from "./questions.entity";
import {QuestionsController} from "./questions.controller";
import {QuestionsCommentsEntity} from "./questions_comments.entity";
import {QuestionsService} from "./questions.service";
import {QuestionCommentController} from "./question_comments.controller";

@Module({
  imports:[TypeOrmModule.forFeature([QuestionsEntity,QuestionsCommentsEntity])],
  controllers:[QuestionsController,QuestionCommentController],
  providers:[QuestionsService]
})
export class QuestionsModule {}