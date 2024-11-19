import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post, Req,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PetService } from '@/modules/pet/pet.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageExtractService } from '@/API/image-extract/image-extract.service';
import { AniApiService } from '@/API/aniapi/aniapi.service';
import { regPetDataDto } from '@/dto/pet.dto';
import {JwtAuthGuard} from "@/modules/auth/jwt-auth.guard";

@Controller('pet')
export class PetController {
  constructor(
    private readonly petService: PetService,
    private readonly imageExtractService: ImageExtractService,
    private readonly aniService: AniApiService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createImage(@UploadedFile() file: Express.Multer.File, @Req() req) {

    const userCode = req.user.userCode;
    console.log(req.user);

    const visionData = await this.imageExtractService.detextImageToPetDataBase(
      file.buffer,
    );

    const { owner, petId, birth } = visionData;

    const aniInfoData = await this.aniService.getAniInfo(owner, petId);

    aniInfoData.Birthday = birth;
    aniInfoData.owner = userCode
    console.log('image aniInfo', aniInfoData);

    return this.petService.create(aniInfoData);
  }

  @Post('/text')
  @UseGuards(JwtAuthGuard)
  async regPetDB(@Body() petData: regPetDataDto, @Req() req) {
    const { dogRegNo, Birthday } = petData;
    const owner = req.user.userCode
    console.log(`regPetDB`, owner, dogRegNo, Birthday);

    const aniInfoData = await this.aniService.getAniInfo(owner, dogRegNo);
    console.log(aniInfoData);
    aniInfoData.Birthday = Birthday;

    return this.petService.create(aniInfoData);
  }
  // @Get()
  // findAll() {
  //   return this.petService.findAll();
  // }

  @Get(':dogRegNo')
  findOne(@Param('dogRegNo') dogRegNo: string) {
    return this.petService.findOne(dogRegNo);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
  //   return this.petService.update(+id, updatePetDto);
  // }

  @Delete(':dogRegNo')
  remove(@Param('dogRegNo') dogRegNo: string) {
    return this.petService.remove(dogRegNo);
  }
}
