import { Body, Controller, Post } from '@nestjs/common';
import { AniApiService } from './aniapi.service';

@Controller('aniInfo')
export class AniapiController {
  constructor(private readonly aniApiService: AniApiService) {}

  @Post()
  getAniInfo(@Body() param: any): Promise<any> {
    console.log(param.owner, param.petId);

    return this.aniApiService.getAniInfo(param.owner, param.petId);
  }
}
