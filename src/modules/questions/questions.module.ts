import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {QuestionsEntity} from "./questions.entity";
import {QuestionsController} from "./questions.controller";
import {QuestionsReplyEntity} from "./questions_reply.entity";
import {QuestionsService} from "./questions.service";

@Module({
  imports:[TypeOrmModule.forFeature([QuestionsEntity,QuestionsReplyEntity])],
  controllers:[QuestionsController],
  providers:[QuestionsService]
})
export class QuestionsModule {}