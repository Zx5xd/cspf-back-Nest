import {IsString} from "class-validator";

export class QuestionsDto {
  @IsString()
  content:string;
}