import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'node_modules/bcryptjs';
import { EmailService } from './email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purpose, User } from '../user/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/signIn.to';
import { encrypt } from 'src/utils/encrypt';
const crypto = require('crypto');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async signUp(data: CreateUserDto): Promise<{ message: string }> {
    //check if email already exists
    const userExists = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (userExists) {
      throw new ConflictException('User Already Exists!');
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    //generate a 5 digit code
    const verificationCode = Math.floor(10000 + Math.random() * 9000).toString();

    //hash the code
    const hashCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

    //set the code reset fields
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    //set the purpose
    const purpose = Purpose.EMAIL;

    //create the user
    const user = await this.userRepository.create({...data,email: data.email.trim().toLowerCase() , password: hashedPassword, otp: hashCode, otpExpiresAt: otpExpiresAt, purpose: purpose});

    //save into db
    await this.userRepository.save(user);

    //send email
    await this.emailService.sendEmail(data.email, verificationCode);

    //return the response
    return { message: 'Verification code sent to the email!' };
  }

  async signIn(data: SignInDto): Promise<{ token: string, user:User }> {
    //check if email exists using userService
    const user = await this.userRepository.findOne({
      where: { email: data.email.trim().toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('Username or Password Incorrect!');
    }

    //check the passwords
    const isPasswordConfirm = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isPasswordConfirm) {
      throw new UnauthorizedException('Username or Passwod Incorrect!');
    }

    //ENCRYPT THE USERID TO SEND OVER THE JWT
    const encryptedId = encrypt(user.id);

    //generate a return a new token
    const token = this.jwtService.sign({ id: encryptedId });
    return { token, user };
  }

  async forgetPassword(email: string): Promise<{ message: string }> {
    //find the email in db
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Email does not exists!');
    }

    //generate a 5 digit code
    const verificationCode = Math.floor(10000 + Math.random() * 9000).toString();

    //hash the code
    const hashCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

    //set the code reset fields
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    //save the fields in db
    // const updatedUser = await this.userService.resetPasswordTokens({id: user.id, resetToken: hashCode, resetExpiry: password_reset_expires_at});

    //update fields in db
    await this.userRepository.update(
      { id: user.id },
      {
        otp: hashCode,
        otpExpiresAt: otpExpiresAt,
        purpose: Purpose.PASSWORD_RESET,
      },
    );

    //send email
    await this.emailService.sendEmail(email, verificationCode);

    //return the response
    return { message: 'Reset code sent to the email!' };
  }
  
  async verifyOtp( otp: number, email: string, purpose: Purpose ): Promise<{ token?: string; message?: string, user?: User  }> {
    //hash the received otp to match it with the one in db
    const hashCode = crypto.createHash('sha256').update(String(otp)).digest('hex');

    //find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    //find user based on the hashed token
    if (
      user.otp !== hashCode ||
      user.purpose !== purpose ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      throw new NotFoundException('Invalid or Expired OTP!');
    }

    //clean up otp fields
    user.otp = null;
    user.otpExpiresAt = null;
    user.purpose = null;

    //ENCRYPT THE USERID TO SEND OVER THE JWT
    const encryptedId = encrypt(user.id);

    //handling different purposes
    if (purpose === Purpose.PASSWORD_RESET) {
      //Send back a jwt token
      const token = this.jwtService.sign(
        { id: encryptedId },
        { expiresIn: '5m' },
      );

      return { token,  message: `OTP Verified successfully!` };
    } else if (purpose === Purpose.EMAIL) {
      //set the email field
      user.isEmailVerified = true;
      //generate a return a new token
      const token = this.jwtService.sign({ id: encryptedId }, { expiresIn: '5m' });
      await this.userRepository.save(user);
      return { token, user,  message: `Email Verified successfully!` };
    } else if (purpose === Purpose.PHONE) {
      //set the phone filed
      user.isPhoneVerified = true;
      await this.userRepository.save(user);
      return { message: `Phone Verified successfully!` };
    }

    throw new NotFoundException('Invalid Purpose');
  }

  async resendOtp(email: string, phone: number, purpose: Purpose ): Promise<{message: string}> {
  
    //fetch the user
    const user = await this.userRepository.findOne({where: {email}});
    if(!user) {
      throw new NotFoundException('User not found!')
    }

    //generate a 5 digit code
    const verificationCode = Math.floor(10000 + Math.random() * 9000).toString();

    //hash the code
    const hashCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

    //set the code reset fields
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    //update fields in db
    await this.userRepository.update(
      { id: user.id },
      {
        otp: hashCode,
        otpExpiresAt: otpExpiresAt,
        purpose: purpose
      },
    );

    if(email) {
      //send email
      await this.emailService.sendEmail(email, verificationCode);

    } else if (phone){
      //send to phone
    }
    //return the response
    return { message: 'Reset code sent to the email!' };
}

async resetPassword( userId: string, password: string ): Promise<{ message: string }> {
    //find the user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    //hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    //clear reset fields
    user.otp = null;
    user.otpExpiresAt = null;

    //save in db
    await this.userRepository.save(user);

    return { message: 'Password updated successfully!' };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userRepository.findOne({where: {email: googleUser.email}});
    //if user exists in db, then return
    if (user) return user;

    //if user does not exists in our db, then create the user
    const userCreated = await this.userRepository.create(googleUser);

    userCreated.isEmailVerified = true;
    await this.userRepository.save(userCreated)
    return userCreated;
  }
}



