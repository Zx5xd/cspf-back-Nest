import {IsNotEmpty, IsString, Length} from "class-validator";
import {UserEntity} from "@/modules/user/user.entity";

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

    @IsNotEmpty()
    owner: UserEntity;

}

export class regPetDataDto{
    // 프론트에서 보호자 이름, 펫 생년월일, 펫등록번호를 받을때 사용하는 DTO.

    @IsString()
    @IsNotEmpty()
    @Length(15)
    dogRegNo: string; // 동물등록번호

    @IsString()
    @IsNotEmpty()
    Birthday: string;

    // @IsNotEmpty()
    // owner: UserEntity;
}