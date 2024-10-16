import {IsNotEmpty, IsString, Length} from "class-validator";

export class petDto{

    @IsString()
    @IsNotEmpty()
    @Length(15)
    dogRegNo: string; // 동물등록번호

    @IsString()
    @IsNotEmpty()
    dogNm: string; // 동물이름

    @IsString()
    @IsNotEmpty()
    sexNm: string; // 성별

    @IsString()
    @IsNotEmpty()
    petType: string; // 강아지 or 고양이

    @IsString()
    @IsNotEmpty()
    kindNm: string; // 품종

    @IsString()
    @IsNotEmpty()
    neuterYn: string; // 중성화여부

    @IsString()
    @IsNotEmpty()
    Birthday: string;

    @IsString()
    @IsNotEmpty()
    aprGbNm: string; // 승인여부

}