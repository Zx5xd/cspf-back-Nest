import { Expose, Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class ExpertProfileDto {
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  @IsString()
  workexperience: string;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  @IsString()
  @Length(1, 255)
  companyaddr: string;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  @IsString()
  product: string;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  @IsString()
  @Length(1, 255)
  image: string;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  @IsString()
  @Length(1, 10)
  id: string;
}
