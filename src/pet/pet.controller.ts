import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PetService } from './pet.service';
import { petDto } from './dto/pet.dto';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  create(@Body() createPetDto: petDto) {
    return this.petService.create(createPetDto);
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
