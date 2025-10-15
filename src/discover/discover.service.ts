import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { DiscoverProfilesDto } from './dto/discover-profiles.dto';
import { plainToInstance } from 'class-transformer';
import type { Cache } from 'cache-manager';
import { buildDiscoverFilters } from 'src/utils/discover-profiles.filters';

@Injectable()
export class DiscoverService {
    constructor(  @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache
  ) {}

    async discoverProfiles(page = 1, limit = 10, filterOption: any, user): Promise<{
        page: number,
        limit: number,
        total: number,
        results: DiscoverProfilesDto[]
    }> {

        //validate inputs
        if( page < 1 || limit < 1) {
            throw new BadRequestException('Invalid Pagination parameters!')
        }

        //setup a cached key
        // const cacheKey = `discoverProfile:${page}:${limit}`;


        //get profiles from the cache first
        // const cachedProfiles = await this.cacheManager.get<{
        //     page: number,
        //     limit: number,
        //     total: number,
        //     results: DiscoverProfilesDto[]
        // }>(cacheKey);
        // if(cachedProfiles) {
        //     console.log("Profiles found in the cache...");
        //     return cachedProfiles;
        // }

        //else fetch from db and store them in cache

        //build dynamic filter
        const whereClause = buildDiscoverFilters(user,filterOption)
        console.log("Filters::", whereClause)

        //get profiles based on filter
        const [userProfiles, total] = await this.userRepository.findAndCount({
            where: whereClause,
            skip: (page - 1) * limit,
            take: limit,
        });
        const results = plainToInstance(DiscoverProfilesDto, userProfiles, {
            excludeExtraneousValues: true
        })

        const response =  { page, limit, total, results };

        //store in cache for 5 min
        // await this.cacheManager.set(cacheKey, response,  300 * 10000 );

        // console.log("not found in cache, fetching from db...")
        return response;
    }
}
