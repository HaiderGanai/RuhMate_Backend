import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


export class CreateUserDto {

   @IsNotEmpty()
    @IsString()
    readonly full_name: string

    @IsNotEmpty()
    @IsEmail({}, {message: 'please enter correct email!'})
    readonly email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string
    
    @IsOptional()
    @IsString()
    readonly avatarUrl?: string | null;


}