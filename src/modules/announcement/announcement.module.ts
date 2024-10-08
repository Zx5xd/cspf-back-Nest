import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AnnouncementEntity} from "./announcement.entity";
import {AnnouncementService} from "./announcement.service";
import {AnnouncementController} from "./announcement.controller";

@Module({
  imports:[TypeOrmModule.forFeature([AnnouncementEntity])],
  controllers:[AnnouncementController],
  providers:[AnnouncementService],
})
export class AnnouncementModule {}