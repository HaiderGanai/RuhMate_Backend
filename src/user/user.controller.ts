import { Body, Controller, Get, Patch, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { onBoardingProcessDto } from './dto/update-data.dto';
import { UploadImagesInterceptor } from 'src/interceptors/upload-images.interceptor';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';


@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor( private userService: UserService) {}

    @Patch('/profile')
    async onBoardingProcess(@Body() body: onBoardingProcessDto, @Req() req) {

        const id = req.user.id;

        return this.userService.onBoardingProcess(id, body);
    }

    @Put('/profile/images')
    @UseInterceptors(UploadImagesInterceptor('images',100))
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

    @Post('/profile/change-password')
    async changePassword(@Body() body: ChangePasswordDto, @Req() req) {
        const id = req.user.id;

        return this.userService.changePassword(id, body);
    }

    @Patch('/profile/update')
    async updateProfile(@Body() body: UpdateProfileDto, @Req() req) {
        const id = req.user.id;

        return this.userService.updateProfile(id, body);
    }

}
