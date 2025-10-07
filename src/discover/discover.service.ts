import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { DiscoverProfilesDto } from './dto/discover-profiles.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DiscoverService {
    constructor(  @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  

    async discoverProfiles(page = 1, limit = 10): Promise<{
        page: number,
        limit: number,
        total: number,
        results: DiscoverProfilesDto[]
    }> {

        //validate inputs
        if( page < 1 || limit < 10) {
            throw new BadRequestException('Invalid Pagination parameters!')
        }

        //get profiles based on filter
        const [userProfiles, total] = await this.userRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });
        const results = plainToInstance(DiscoverProfilesDto, userProfiles, {
            excludeExtraneousValues: true
        })

        return { page, limit, total, results};
    }
}
