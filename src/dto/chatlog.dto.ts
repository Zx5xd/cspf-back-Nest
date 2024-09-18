import { IsDate, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class ChatLogDto {
  @IsNumber()
  ChatRoomID: number;

  @IsDate()
  CreationTime: Date;

  @IsString()
  ChatMessage: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  ChatUserCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  ChatRoom?: string;
}