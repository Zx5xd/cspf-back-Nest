import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards, Req, Res,
} from '@nestjs/common';
import {ExpertService} from "@/modules/expert/expert.service";
import {JwtAuthGuard} from "@/modules/auth/jwt-auth.guard";
import {ExpertEntity} from "@/modules/expert/expert.entity";

@Controller('expert')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  @Post()
  create(@Body() createExpertProp: any) {
    console.log(createExpertProp);
    return this.expertService.create(createExpertProp);
  }

  @Get('/findAll')
  findAll() {
    return this.expertService.findAll();
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.expertService.findOne(username);
  }

  @Get('/type/:type')
  attList(@Param('type') type: string) {
    console.log(type)
    if(type === 'Lawyer'){
      return this.expertService.expertList('L');
    }
    if(type === 'Insurance'){
      return this.expertService.expertList('I');
    }
    if(type === 'Veterinarian'){
      return this.expertService.expertList('V');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  expertProfile(@Req() req:any){
    return this.expertService.getExpertByUsername(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/simple_profile")
  expertSimpleProfile(@Req() req:any){
    return this.expertService.getExpertSimpleProfile(req.user.username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: Partial<ExpertEntity>) {
    // console.log(`expert Update`,id, updateDto);
    return this.expertService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.expertService.delete(id);
  }
}
