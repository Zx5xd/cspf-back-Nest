import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query} from "@nestjs/common";
import {AnnouncementService} from "./announcement.service";
import {AnnouncementDto, AnnouncementFilterDto} from "../../dto/announcement.dto";

@Controller('announcement')
export class AnnouncementController {
  constructor(
    private readonly announcementService: AnnouncementService
  ) {}

  @Get('pages')
  async getAnnouncements(@Query() filterDTO:AnnouncementFilterDto) {
    const {page,limit} = filterDTO;
    return await this.announcementService.getAnnouncements(page, limit);
  }

  @Get(':id')
  async getAnnouncementBoard(
    @Param('id') id: number
  ) {
    return await this.announcementService.getAnnouncementBoard(id);
  }

  @Post()
  async createAnnouncementBoard(@Body() createAnnouncementDTO:AnnouncementDto) {
    const { content } = createAnnouncementDTO;
    const result = await this.announcementService.createAnnouncement('',content)
  }

  @Patch(':id')
  async updateAnnouncementBoard(@Param('id') id: number,@Body() updateAnnouncementDTO:AnnouncementDto) {
    const { content } = updateAnnouncementDTO;
    const isUpdated = await this.announcementService.updateAnnouncementBoard(id, content);

    if (!isUpdated) {
      throw new HttpException('Update failed, entity not found.', HttpStatus.NOT_FOUND);
    }

    return { success: true };
  }

  @Delete(':id')
  async deleteAnnouncementBoard(@Param('id') id: number){
    await this.announcementService.deleteAnnouncementBoard(id);
    return {
      message: 'announcement is delete successful'
    }
  }
}