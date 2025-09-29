import { Body, Controller, Get, Patch, Put, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dto/update-data.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';


@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor( private userService: UserService) {}

    @Patch('/profile')
    async updateProfile(@Body() body: UpdateProfileDto, @Req() req) {

        const id = req.user.id;

        return this.userService.updateProfile(id, body);
    }

    @Put('/profile/images')
    @UseInterceptors(
            FilesInterceptor('images', 100, {
                storage: diskStorage({
                    destination: './uploads',
                    filename: (req, file, callback) => {
                        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
                        callback(null, uniqueName);
                    }
                })
            },
        ))
    async uploadImages(@Req() req, @UploadedFiles() images: Array<Express.Multer.File>) {
        const id = req.user.id;
        return this.userService.uploadImages(id, images);
    }

    @Put('/profile/images/main')
    async setMainImage(@Req() req, @Body('imageUrl') imageUrl: string) {
        const id = req.user.id;

        return this.userService.setMainImage(id, imageUrl);
    }

    @Get('/profile')
    async getProfile(@Req() req) {
        const id = req.user.id;

        return this.userService.getProfile(id);

    }

}
