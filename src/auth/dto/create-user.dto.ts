import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength, Matches, IsOptional, IsUrl, IsEnum } from 'class-validator';
import { Purpose } from 'src/user/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  readonly full_name: string;

  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  @IsEmail({}, { message: 'please enter correct email!' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Password must include at least one uppercase letter, one number, and one special character',
  })
  readonly password: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  readonly avatarUrl?: string | null;

  @IsEnum(Purpose)
  @IsOptional()
  purpose: Purpose;
}
