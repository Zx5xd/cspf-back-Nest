import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class expertLoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  password: string;
}

export class expertDto {
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
  company: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(1, 255)
  email: string;

  @IsPhoneNumber('KR')
  @IsNotEmpty()
  phone: string;

  // @IsString()
  // @IsOptional()
  // refreshToken?: string;

  @IsString()
  @IsOptional()
  @Length(1)
  CredentialStatus: number;

  @IsString()
  @Length(1, 512)
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  image: string;

  @IsString()
  @Length(1, 512)
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  certImage: string;
}

export class updateExpertDto {
  @IsString()
  @Length(1, 255)
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  password: string;

  @IsString()
  @Length(1, 255)
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  name: string;

  @IsString()
  @Length(1, 255)
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  company: string;

  @IsEmail()
  @Length(1, 255)
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  email: string;

  @IsPhoneNumber('KR')
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  phone: string;
}
