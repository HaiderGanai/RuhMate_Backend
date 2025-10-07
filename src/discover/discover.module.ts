import { Module } from '@nestjs/common';
import { DiscoverController } from './discover.controller';
import { DiscoverService } from './discover.service';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [DiscoverController],
  providers: [DiscoverService]
})
export class DiscoverModule {}
