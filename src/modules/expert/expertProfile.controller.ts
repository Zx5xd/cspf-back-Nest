import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param, UseGuards, Req,
} from '@nestjs/common';
import {ExpertProfileService} from "@/modules/expert/expertProfile.service";
import {ExpertProfileDto} from "@/dto/expertProfile.dto";
import {ExpertProfileEntity} from "@/modules/expert/expertProfile.entity";
import {JwtAuthGuard} from "@/modules/auth/jwt-auth.guard";

@Controller('expertProfile')
export class ExpertProfileController {
  constructor(private readonly expertProfileServ: ExpertProfileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createExpertProp: any, @Req() req: any) {
    // 수신할 데이터 : expertCode, ExpertProfileDto .
    console.log(req.user.userCode)
    createExpertProp.expertCode = req.user.userCode;
    return this.expertProfileServ.create(createExpertProp);
  }

  @Get()
  findAll() {
    return this.expertProfileServ.findAll();
  }

  @Get(':expertCode')
  findOne(@Param('expertCode') expertCode: string) {
    return this.expertProfileServ.findOne(expertCode);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: ExpertProfileEntity) {
    return this.expertProfileServ.update(id, updateDto);
  }
}
