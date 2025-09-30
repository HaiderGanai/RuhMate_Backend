import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class ChangePasswordDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Password must include at least one uppercase letter, one number, and one special character',
  })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Password must include at least one uppercase letter, one number, and one special character',
  })
  readonly newPassword: string;

}