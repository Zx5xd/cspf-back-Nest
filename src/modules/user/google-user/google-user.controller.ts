import { Controller } from '@nestjs/common';
import { GoogleUserService } from './google-user.service';

@Controller('googleuser')
export class GoogleUserController {
  constructor(private readonly googleUserService: GoogleUserService) {}


}
