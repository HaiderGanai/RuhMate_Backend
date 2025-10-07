import { Module } from '@nestjs/common';
import { AstrologyController } from './astrology.controller';
import { AstrologyService } from './astrology.service';

@Module({
  controllers: [AstrologyController],
  providers: [AstrologyService]
})
export class AstrologyModule {}
