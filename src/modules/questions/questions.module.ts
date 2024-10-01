import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {QuestionsEntity} from "./questions.entity";
import {QuestionsController} from "./questions.controller";

@Module({
  imports:[TypeOrmModule.forFeature([QuestionsEntity])],
  controllers:[QuestionsController],
  providers:[]
})
export class QuestionsModule {}