import {IsNumber, IsOptional, IsString} from "class-validator";

export class AnnouncementDto {
  @IsString()
  content:string;
}

export class AnnouncementFilterDto {
  @IsOptional()
  @IsNumber()
  page?:number;

  @IsOptional()
  @IsNumber()
  limit?:number;
}