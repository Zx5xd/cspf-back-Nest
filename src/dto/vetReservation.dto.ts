import {IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, Length, Matches} from "class-validator";
import {Expose, Transform, Type} from "class-transformer";
export class createVetReservDto{
    @IsString()
    @IsNotEmpty()
    @Length(1,10)
    hospId: string;

    @Type(() => Date)
    @IsDate()
    resvDate:Date;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    prefTime:string;

    @IsString()
    @Length(1, 255)
    description: string;

    // @Expose()
    // @Transform(({ value }) => (value === null ? undefined : value))
    // @IsString()
    // @Length(1, 10)
    // owner: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    pet: string;
}

export class updateStatusDto{
    @IsString()
    @Length(1,10)
    hospId: string;

    @IsNumber()
    @Length(1, 5)
    resvStatus: number;
}


export class VetReservationDto {
    @IsNumber()
    @Length(1, 10)
    @IsNotEmpty()
    hosReservationId:number;

    @IsString()
    @Length(10)
    @IsNotEmpty()
    hospId:string;

    @IsDate()
    @Type(() => Date)
    resvDate:Date;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    @IsDate()
    @IsNotEmpty()
    @Length(1, 50)
    prefTime:Date;

    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    kndNm:string;

    @IsBoolean()
    @Length(1, 5)
    resvStatus:boolean;

    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    owner: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 20)
    petBirth:string;

    @IsString()
    @Length(1, 255)
    description:string;

    @IsDate()
    createdAt:Date;
}
