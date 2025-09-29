import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.entity';
import { decrypt } from 'src/utils/decrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategyEmail extends PassportStrategy(Strategy, 'jwt-email') {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    //checking the jwt secret before
    const jwtEmailSecret = configService.get<string>('JWT_SECRET');
if (!jwtEmailSecret) {
  throw new Error('JWT_EMAIL_SECRET is not defined in the environment variables!');
}

super({
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req?.body?.token || null,
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: jwtEmailSecret,
});
  }

  async validate(payload) {
    const { id } = payload;

    //decrypt the id
    const decryptedId = decrypt(id);

    //check if user exists or not
    const userExists = await this.userRepository.findOne({
      where: { id: decryptedId },
    });
    if (!userExists) {
      throw new NotFoundException('User does not exists!');
    }

    //if exists, return user
    return userExists;
  }
}
