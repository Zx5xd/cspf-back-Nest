import { Module } from '@nestjs/common';
import { ExpertService } from './expert.service';
import { ExpertController } from './expert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpertEntity } from './entities/expert.entity';
import { ExpertProfileEntity } from './entities/expertProfile.entity';
import { ExpertProfileController } from './expertProfile.controller';
import { ExpertProfileService } from './expertProfile.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExpertEntity, ExpertProfileEntity])],
  controllers: [ExpertController, ExpertProfileController],
  providers: [ExpertService, ExpertProfileService],
  exports: [ExpertService, ExpertProfileService],
})
export class ExpertModule {}
