import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class chatComplaintDto {
  @IsNumber()
  id?: number;

  @IsString()
  @IsNotEmpty()
  declarer: string;

  @IsString()
  @IsNotEmpty()
  perpetrator: string;

  @IsString()
  @IsNotEmpty()
  chatRoomId: string;

  @IsString()
  @IsNotEmpty()
  chatMessage: string;

  @IsString()
  description?: string;

  @IsDate()
  createdAt?: Date;

  @IsNumber()
  processingStatus?: number;
}
