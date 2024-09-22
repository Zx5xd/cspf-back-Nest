import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';

@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Get(':roomId/:uuid')
    async getImage(
        @Param('roomId') roomId: string,
        @Param('uuid') uuid: string,
        @Res() res: Response,
    ) {
        try {
            const imagePath = await this.imageService.getImageByRoomIdAndUuid(roomId, uuid);
            res.sendFile(imagePath, { root: '.' });
        } catch (error) {
            throw new NotFoundException('Image not found');
        }
    }
}
