import { Controller } from '@nestjs/common';
import {NaverUserService} from "@/modules/user/naver-user/naver-user.service";
@Controller('naver-user')
export class NaverUserController {
  constructor(private readonly naverUserService: NaverUserService) {}
}
