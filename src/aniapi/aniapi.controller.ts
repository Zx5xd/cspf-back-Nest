import { Controller, Get } from '@nestjs/common';
import { AniApiService } from './aniapi.service';

@Controller('aniInfo')
export class AniapiController {
    constructor(private readonly aniApiService: AniApiService) {}

    // @Get()
    // getAniInfo(): Promise<any> {
    //     return this.aniApiService.getAniInfo();
    // }

}
