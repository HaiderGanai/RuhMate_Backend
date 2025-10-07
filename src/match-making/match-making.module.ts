import { Module } from '@nestjs/common';
import { MatchMakingController } from './match-making.controller';
import { MatchMakingService } from './match-making.service';

@Module({
  controllers: [MatchMakingController],
  providers: [MatchMakingService]
})
export class MatchMakingModule {}
