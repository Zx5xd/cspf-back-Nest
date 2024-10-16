import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetEntity } from './entities/pet.entity';
import { ImageExtractService } from '../API/image-extract/image-extract.service';
import { AniApiService } from '../API/aniapi/aniapi.service';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity])],
  controllers: [PetController],
  providers: [PetService, ImageExtractService, AniApiService],
  exports: [PetService],
})
export class PetModule {}
