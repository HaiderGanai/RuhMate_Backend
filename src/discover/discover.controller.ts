import { Body, Controller, Get, Injectable, Query, Req, UseGuards } from '@nestjs/common';
import { DiscoverService } from './discover.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('discover')
export class DiscoverController {
    constructor( private discoverService: DiscoverService
    ) {}

    @Get('/')
    @UseGuards(AuthGuard('jwt'))
    async discoverProfiles(@Query('page') page = 1, @Query('limit') limit = 10, @Body() body, @Req() req) {

        const user = req.user;

        return this.discoverService.discoverProfiles(Number(page), Number(limit), body, user);
    }

}
