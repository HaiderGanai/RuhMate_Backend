import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.entity';
import { decrypt } from 'src/utils/decrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    //checking the jwt secret before
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error(
        'JWT_SECRET is not defined in the environment variables!',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
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

    //check if email is verified or not
        if (!userExists.isEmailVerified) {
          throw new ForbiddenException('Email not verified!');
        }

    //if exists, return user
    return userExists;
  }
}
