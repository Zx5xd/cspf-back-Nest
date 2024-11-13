import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req} from '@nestjs/common';
import { VetReservationService } from './vet-reservation.service';
import {createVetReservDto, updateStatusDto} from '@/dto/vetReservation.dto';
import {JwtAuthGuard} from "@/modules/auth/jwt-auth.guard";

@Controller('vetReservation')
export class VetReservationController {
  constructor(private readonly vetReservationService: VetReservationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createVetReservationDto: createVetReservDto, @Req() req) {

    return this.vetReservationService.create(createVetReservationDto, req.user.userCode);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.vetReservationService.findAll(req.user.userCode);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number, @Req() req) {
    return this.vetReservationService.findOne(+id, req.user.userCode);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateVetReservationDto: any, @Req() req) {
    updateVetReservationDto.hospId = req.user.userCode;
    return this.vetReservationService.updateStatus(+id, updateVetReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vetReservationService.remove(+id);
  }
}
