import { config } from 'dotenv';
config(); // <--- Just this

import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';
import { UserPreference } from '../user-preference/user-preference.entity';
import { MatchActions } from '../match-making/match-actions.entity';
import { Match } from '../match-making/match.entity';
import { AstrologyProfile } from '../astrology/astrology-profile.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // must be a string
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [User, UserPreference, MatchActions, Match, AstrologyProfile],
});
