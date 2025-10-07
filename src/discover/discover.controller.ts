import { Controller, Get, Injectable, Query, UseGuards } from '@nestjs/common';
import { DiscoverService } from './discover.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('discover')
export class DiscoverController {
    constructor( private discoverService: DiscoverService
    ) {}

    @Get('/')
    @UseGuards(AuthGuard('jwt'))
    async discoverProfiles(@Query('page') page = 1, @Query('limit') limit = 10) {

        return this.discoverService.discoverProfiles(Number(page), Number(limit));
    }

}
