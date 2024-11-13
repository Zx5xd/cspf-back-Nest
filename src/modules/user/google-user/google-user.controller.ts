import { Controller } from '@nestjs/common';
import {GoogleUserService} from "@/modules/user/google-user/google-user.service";

@Controller('googleuser')
export class GoogleUserController {
  constructor(private readonly googleUserService: GoogleUserService) {}


}
