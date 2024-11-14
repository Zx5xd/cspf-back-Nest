import {IsDate, IsNotEmpty, IsNumber, IsString, Length} from "class-validator";

export class createInsuereChatDto{
    @IsNotEmpty()
    @IsString()
    @Length(1,10)
    insurerId: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    pet: string; // petBirth, kindNm

    // @IsString()
    // @Length(1, 12)
    // owner: string; // ownerNAme
}
export class updateStatusDto{

    // @IsString()
    // @IsNotEmpty()
    // insurerId: string;

    @IsNumber()
    @Length(1, 5)
    reqStatus: number;

}

export class InsurerListDto {

    @IsNotEmpty()
    @IsNumber()
    insChatReqNumber: number;

    @IsNotEmpty()
    @IsString()
    @Length(10)
    insurerId: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    kindNm: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 20)
    petBirth: string;

    @IsString()
    @Length(1, 5)
    reqStatus: string;

    @IsDate()
    @IsNotEmpty()
    createdAt: Date;

    @IsDate()
    @Length(1, 255)
    cancelAt: Date;

    @IsString()
    @Length(1, 12)
    owner: string;
}
