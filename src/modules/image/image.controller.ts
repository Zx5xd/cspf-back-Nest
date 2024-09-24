import {
    Controller,
    Get,
    Param,
    Res,
    NotFoundException,
    Post,
    UseGuards,
    Req,
    UseInterceptors, UploadedFiles, NestInterceptor
} from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import { FilesInterceptor } from '@nestjs/platform-express';
import {MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

const options: MulterOptions = {
    dest: './upload',
};
function getMulterOptions(): MulterOptions {
    return {
        dest: './upload',
    };
}

@Controller('images')
export class ImageController {
    constructor(
      private readonly imageService: ImageService
    ) {}

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

    @Post(':roomId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 3) as unknown as NestInterceptor)
    async uploadImage(
      @Req() req,
      @Param('roomId') roomId: string,
      @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        console.log(req.user.userCode)
        console.log(files)
    }
}
