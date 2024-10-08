import {IsString} from "class-validator";

export class QuestionsDto {
  @IsString()
  title:string;

  @IsString()
  content:string;
}