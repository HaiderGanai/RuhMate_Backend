import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsNumber,
  MaxLength,
} from 'class-validator';
import {
  Education_Level,
  FAITH_PREFERENCES,
  Gender,
  Home_Ownership,
  Interests,
  Marital_Status,
  Personality_Traits,
  Profile_For,
  Religion_Practice,
  ResidenceSize,
  Sect,
} from '../user.entity';

export class UpdateProfileDto {
  @IsEnum(Profile_For)
  @IsOptional()
  profile_for?: Profile_For;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  nick_name?: string;

  @IsEnum(Sect)
  @IsOptional()
  sect?: Sect;

  @IsString()
  @IsOptional()
  profession?: string;

  @IsEnum(Education_Level)
  @IsOptional()
  education_level?: Education_Level;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  nationality?: string[];

  @IsString()
  @IsOptional()
  caste?: string;

  @IsString()
  @IsOptional()
  homeTown?: string;  //where you grow up

  @IsString()
  @IsOptional()
  ethnicity?: string;

  @IsNumber()
  @IsOptional()
  height_cm?: number;

  @IsEnum(Marital_Status)
  @IsOptional()
  marital_status?: Marital_Status;

  @IsEnum(Religion_Practice)
  @IsOptional()
  religion_practice?: Religion_Practice;

  @IsArray()
  @IsEnum(FAITH_PREFERENCES, { each: true })
  @IsOptional()
  faith_preferences?: FAITH_PREFERENCES[];

  @IsBoolean()
  @IsOptional()
  halal_food?: boolean;

  @IsBoolean()
  @IsOptional()
  smoke?: boolean;

  @IsBoolean()
  @IsOptional()
  drink_alcohol?: boolean;

  @IsBoolean()
  @IsOptional()
  have_children?: boolean;

  @IsBoolean()
  @IsOptional()
  born_muslim?: boolean;

  @IsBoolean()
  @IsOptional()
  relocate?: boolean;

  @IsString()
  @IsOptional()
  household_income_range?: string;

  @IsEnum(Home_Ownership)
  @IsOptional()
  home_ownership?: Home_Ownership;

  @IsEnum(ResidenceSize)
  @IsOptional()
  residence_size?: ResidenceSize;

  @IsArray()
  @IsEnum(Interests, { each: true })
  @IsOptional()
  interests?: Interests[];

  @IsArray()
  @IsEnum(Personality_Traits, { each: true })
  @IsOptional()
  personality_traits?: Personality_Traits[];

  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;
}
