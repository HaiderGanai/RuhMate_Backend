import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(128)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
      message: 'Password must include at least one uppercase letter, one number, and one special character',
    })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
    message: 'Invalid JWT format',
  })
  @MinLength(50) // optional: prevent too-short strings
  @MaxLength(600) // optional: prevent abuse with huge strings
  readonly token: string;
}
