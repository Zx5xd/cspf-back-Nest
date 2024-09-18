import { IsString, IsOptional, IsDate, IsJSON } from "class-validator";
import { accessUsers } from "../types/chatroomTypes";

export class CreateChatRoomDto {
  @IsOptional()
  @IsString()
  ChatRoom?: string;  // 채팅방 이름

  @IsOptional()
  @IsDate()
  CreationTime?: Date;  // 생성 시간 (자동으로 추가될 수 있음)

  @IsOptional()
  @IsDate()
  ConsultEndTime?: Date;  // 상담 종료 시간

  @IsOptional()
  @IsJSON()
  accessUser?: accessUsers;  // 접속 가능한 유저 리스트 (JSON)
}
