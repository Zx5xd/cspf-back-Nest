import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpertService } from './expert.service';
import {expertLoginDto, expertDto, updateExpertDto} from './dto/expert.dto';

@Controller('expert')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  @Post()
  create(@Body() createExpertProp: any) {
    console.log(createExpertProp);
    return this.expertService.create(createExpertProp);
  }

  @Get()
  findAll() {
    return this.expertService.findAll();
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.expertService.findOne(username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: updateExpertDto) {

    return this.expertService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.expertService.delete(id);
  }
}
