import { CanActivate, ExecutionContext, ForbiddenException, Injectable,UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class EmailVerificationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext, ): boolean | Promise<boolean> | Observable<boolean> {
    //get the http request object of express
    const request = context.switchToHttp().getRequest();

    //extract the user from jwt token
    const user = request.user;

    //check if there is any user
    if (!user) {
      throw new UnauthorizedException('User not authenticated!');
    }

    //check if email is verified or not
    if (!user.isEmailVerified) {
      throw new ForbiddenException('Email not verified!');
    }

    return true;
  }
}
