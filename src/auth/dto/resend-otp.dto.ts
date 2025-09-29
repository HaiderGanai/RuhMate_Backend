import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Purpose } from "src/user/user.entity";


export class ResendOtpDto {

      @IsNotEmpty()
      @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
      @IsEmail({}, { message: 'please enter correct email!' })
      readonly email: string;

      @IsOptional()
      @IsNumber()
      readonly phone: number

      @IsEnum(Purpose)
        purpose: Purpose;
}