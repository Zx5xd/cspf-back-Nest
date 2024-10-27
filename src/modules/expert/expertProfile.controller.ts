import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { updateExpertDto } from '../../dto/expert.dto';
import { ExpertProfileService } from './expertProfile.service';
import { ExpertProfileEntity } from './expertProfile.entity';

@Controller('expertProfile')
export class ExpertProfileController {
  constructor(private readonly expertProfileServ: ExpertProfileService) {}

  @Post()
  create(@Body() createExpertProp: any) {
    // 수신할 데이터 : expertCode, ExpertProfileDto .
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
