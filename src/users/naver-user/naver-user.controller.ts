import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NaverUserService } from './naver-user.service';
import { CreateNaverUserDto } from './dto/create-naver-user.dto';
import { UpdateNaverUserDto } from './dto/update-naver-user.dto';

@Controller('naver-user')
export class NaverUserController {
  constructor(private readonly naverUserService: NaverUserService) {}

  // @Post()
  // create(@Body() createNaverUserDto: CreateNaverUserDto) {
  //   return this.naverUserService.create(createNaverUserDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.naverUserService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.naverUserService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateNaverUserDto: UpdateNaverUserDto) {
  //   return this.naverUserService.update(+id, updateNaverUserDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.naverUserService.remove(+id);
  // }
}
