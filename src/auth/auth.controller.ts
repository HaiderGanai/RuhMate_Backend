import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/signIn.to';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { encrypt } from 'src/utils/encrypt';
import { ResendOtpDto } from './dto/resend-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/register')
  async signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Post('/login')
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const { email } = body;

    return this.authService.forgetPassword(email);
  }

  @Post('/verify-code')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const { otp, email, purpose } = body;
    return this.authService.verifyOtp(otp, email, purpose);
  }

  @Post('/resend-code')
  async resendOtp(@Body() body: ResendOtpDto) {
    const { email, phone, purpose } = body;

    return this.authService.resendOtp(email, phone, purpose);
  }

  @Post('/reset-password')
  @UseGuards(AuthGuard('jwt-email'))
  async resetPassword(@Body() body: ResetPasswordDto, @Req() req) {
    const id = req.user.id;
    const { password } = body;

    return this.authService.resetPassword(id, password);
  }

  // @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('/google/login')
  googleLogin() {}

  // @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  async googleCallback(@Req() req) {
    const user = req.user;
    //ENCRYPT THE USERID TO SEND OVER THE JWT
    const encryptedId = encrypt(user.id);

    //return a jwt token
    const token = this.jwtService.sign({ sub: encryptedId });

    return { token };
  }
}
