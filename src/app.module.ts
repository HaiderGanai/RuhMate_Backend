import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { UserPreferenceModule } from './user-preference/user-preference.module';
import { MatchMakingModule } from './match-making/match-making.module';
import { AstrologyModule } from './astrology/astrology.module';
import { UserPreference } from './user-preference/user-preference.entity';
import { MatchActions } from './match-making/match-actions.entity';
import { Match } from './match-making/match.entity';
import { AstrologyProfile } from './astrology/astrology-profile.entity';
import { DiscoverModule } from './discover/discover.module';

const envFilePath = path.resolve(__dirname, '../.env');
console.log('ENV FILE PATH:', envFilePath);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, UserPreference, MatchActions, Match, AstrologyProfile],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 15 *10000,
      store: redisStore
    }),
    UserPreferenceModule,
    MatchMakingModule,
    AstrologyModule,
    DiscoverModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
