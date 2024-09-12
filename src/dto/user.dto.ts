import { IsString, IsNotEmpty, IsEmail, Length, IsOptional, IsPhoneNumber } from 'class-validator';

export class LoginDTO {
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    username: string;
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    password:string;
}

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    password: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    nickname: string;

    @IsEmail()
    @IsNotEmpty()
    @Length(1, 255)
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    addr: string;

    @IsPhoneNumber('KR')
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsOptional()
    refreshToken?: string;

    @IsString()
    @IsOptional()
    @Length(1, 10)
    gender?: string;

    @IsString()
    @IsOptional()
    @Length(1, 1)
    petOwnership?: string;
}
