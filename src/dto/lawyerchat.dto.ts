import {IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsTimeZone, Length, Matches} from "class-validator";
import {Type} from "class-transformer";
import {expertDto} from "./expert.dto";

export class ReqLawyerChatDto{
    @IsString()
    @IsNotEmpty()
    lawyerCode: string;

    @Type(() => Date)
    @IsDate()
    reqDate: Date;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    prefTime: string;

    @IsOptional()
    @IsString()
    @Length(1, 512)
    description: string;
}

export class updateStatusDto{

    @IsString()
    @IsNotEmpty()
    lawyerCode: string;

    @IsNumber()
    @Length(1, 5)
    reqStatus: number;

}

export class createLawyerChatDto{
    @IsString()
    @IsNotEmpty()
    lawyerCode: string;

    @Type(() => Date)
    @IsDate()
    reqDate: Date;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    prefTime: string;

    @IsOptional()
    @IsString()
    @Length(1, 512)
    description: string;

    @IsString()
    @Length(1, 255)
    ownerCode: string;
}

export class LawyerchatDto {
    @IsNumber()
    lawChatReqId: number;

    @IsString()
    @IsNotEmpty()
    lawyerCode: string;

    @Type(() => Date)
    @IsDate()
    reqDate: Date;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    prefTime: string;

    @IsNumber()
    @Length(1, 5)
    reqStatus: number;

    @IsString()
    @Length(1, 255)
    ownerCode: string;

    @IsOptional()
    @IsString()
    @Length(1, 512)
    description: string;

    @IsDate()
    @Length(1, 255)
    createdAt: Date;

    @IsDate()
    @Length(1, 255)
    cancelDate: Date;
}
