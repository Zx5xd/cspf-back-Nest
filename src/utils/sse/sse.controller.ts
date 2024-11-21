import {Controller, Param, Sse, UseGuards} from '@nestjs/common';
import { SseService } from './sse.service';
import {JwtAuthGuard} from "@/modules/auth/jwt-auth.guard";
import {Observable} from "rxjs";

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse(":userCode")
  @UseGuards(JwtAuthGuard)
  stream(@Param("userCode") userCode:string): Observable<MessageEvent> {
    return this.sseService.getUserEvents(userCode);
  }
}
