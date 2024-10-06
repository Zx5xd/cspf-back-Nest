import { PartialType } from '@nestjs/mapped-types';
import { CreateNaverUserDto } from './create-naver-user.dto';

export class UpdateNaverUserDto extends PartialType(CreateNaverUserDto) {}
