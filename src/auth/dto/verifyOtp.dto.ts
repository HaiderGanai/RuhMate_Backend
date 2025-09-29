import { IsEmail, IsEnum, IsNumber, IsString } from "class-validator";
import { Purpose } from "src/user/user.entity";

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsNumber()
  otp: number;

  @IsEnum(Purpose)
  purpose: Purpose;
}
