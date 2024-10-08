import {IsNumber, IsOptional, IsString, Length} from "class-validator";
import {Type} from "class-transformer";

export class AnnouncementDto {
  @IsString()
  @Length(1,255)
  title:string;

  @IsString()
  content:string;
}

export class AnnouncementFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?:number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?:number;
}