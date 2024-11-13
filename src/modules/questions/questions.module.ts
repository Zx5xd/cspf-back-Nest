import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {QuestionsEntity} from "@/modules/questions/questions.entity";
import {QuestionsCommentsEntity} from "@/modules/questions/questions_comments.entity";
import {QuestionsController} from "@/modules/questions/questions.controller";
import {QuestionCommentController} from "@/modules/questions/question_comments.controller";
import {QuestionsService} from "@/modules/questions/questions.service";

@Module({
  imports:[TypeOrmModule.forFeature([QuestionsEntity,QuestionsCommentsEntity])],
  controllers:[QuestionsController,QuestionCommentController],
  providers:[QuestionsService]
})
export class QuestionsModule {}