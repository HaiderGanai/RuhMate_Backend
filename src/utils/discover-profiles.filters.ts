import { Gender, User } from 'src/user/user.entity';
import { Between, MoreThanOrEqual, LessThanOrEqual, FindOptionsWhere, In, ArrayContains } from 'typeorm';

export interface DiscoverFilterOptions {
  // Basic filters
  gender?: User['gender'];
  sect?: User['sect'];
  marital_status?: User['marital_status'];
  
  // Height
  minHeight?: number;
  maxHeight?: number;
  height_cm?: number;
  
  // Location
  nationality?: string[];
  homeTown?: string;
  city?: string;
  
  // Demographics
  ethnicity?: string;
  caste?: string;
  
  // Age range
  minAge?: number;
  maxAge?: number;
  
  // Children & Family
  have_children?: boolean;
  
  // Education & Career
  education_level?: User['education_level'] | User['education_level'][];
  profession?: string;
  household_income_range?: string;
  
  // Languages
  languages?: string[];
  
  // Religious preferences
  religion_practice?: User['religion_practice'] | User['religion_practice'][];
  faith_preferences?: User['faith_preferences'];
  born_muslim?: boolean;
  halal_food?: boolean;
  
  // Lifestyle
  smoke?: boolean;
  drink_alcohol?: boolean;
  
  // Interests & Personality
  interests?: User['interests'];
  personality_traits?: User['personality_traits'];
  
  // Relocation & Plans
  relocate?: boolean;
  
  // Verification & Status filters
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  moderatorApproved?: boolean;
  isPremiumUser?: boolean;
  
  // Activity filters (to be used with custom queries)
  recentlyActive?: boolean; // Will need additional date field
  justJoined?: boolean; // Based on createdAt
}

export function buildDiscoverFilters(
  currentUser: User,
  options: DiscoverFilterOptions = {}
): FindOptionsWhere<User> {
  const where: FindOptionsWhere<User> = {};

  //BASIC FILTERS
  
  // Default gender: opposite of the logged-in user
  if (!options.gender && currentUser.gender) {
    where.gender = currentUser.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
  } else if (options.gender) {
    where.gender = options.gender;
  }

  // Sect
  if (options.sect) {
    where.sect = options.sect;
  }

  // Marital Status
  if (options.marital_status) {
    where.marital_status = options.marital_status;
  }

  //LOCATION FILTERS
  
  // Nationality (array field - can match multiple)
  if (options.nationality && options.nationality.length > 0) {
    where.nationality = ArrayContains(options.nationality);
  }

  // Home Town - default to same city as user
  if (!options.homeTown && currentUser.homeTown) {
    where.homeTown = currentUser.homeTown;
  } else if (options.homeTown) {
    where.homeTown = options.homeTown;
  }

  // City
  if (options.city) {
    where.city = options.city;
  }

  //DEMOGRAPHICS
  
  // Ethnicity
  if (options.ethnicity) {
    where.ethnicity = options.ethnicity;
  }

  // Caste
  if (options.caste) {
    where.caste = options.caste;
  }

  //HEIGHT FILTER
  
  if (options.height_cm) {
    where.height_cm = options.height_cm;
  } else if (options.minHeight && options.maxHeight) {
    where.height_cm = Between(options.minHeight, options.maxHeight);
  } else if (options.minHeight) {
    where.height_cm = MoreThanOrEqual(options.minHeight);
  } else if (options.maxHeight) {
    where.height_cm = LessThanOrEqual(options.maxHeight);
  }

  //AGE FILTER
  
  // If specific age range provided, use that
  if (options.minAge || options.maxAge) {
    const now = new Date();
    const minAge = options.minAge || 18;
    const maxAge = options.maxAge || 100;

    const maxDOB = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
    const minDOB = new Date(now.getFullYear() - maxAge, now.getMonth(), now.getDate());

    where.date_of_birth = Between(minDOB, maxDOB);
  }
  // Otherwise, default to ±2 years from current user's age
  else if (currentUser.date_of_birth) {
    const now = new Date();
    const age = now.getFullYear() - currentUser.date_of_birth.getFullYear();

    const minAge = age - 2 > 18 ? age - 2 : 18;
    const maxAge = age + 2;

    const maxDOB = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
    const minDOB = new Date(now.getFullYear() - maxAge, now.getMonth(), now.getDate());

    where.date_of_birth = Between(minDOB, maxDOB);
  }

  //FAMILY & CHILDREN
  
  if (options.have_children !== undefined) {
    where.have_children = options.have_children;
  }

  // EDUCATION & CAREER
  
  // Education Level
  if (options.education_level) {
    if (Array.isArray(options.education_level)) {
      where.education_level = In(options.education_level);
    } else {
      where.education_level = options.education_level;
    }
  }

  // Profession
  if (options.profession) {
    where.profession = options.profession;
  }

  // Household Income
  if (options.household_income_range) {
    where.household_income_range = options.household_income_range;
  }

  // LANGUAGES
  
  if (options.languages && options.languages.length > 0) {
    where.languages = ArrayContains(options.languages);
  }

  //RELIGIOUS PREFERENCES
  
  // Religion Practice Level
  if (options.religion_practice) {
    if (Array.isArray(options.religion_practice)) {
      where.religion_practice = In(options.religion_practice);
    } else {
      where.religion_practice = options.religion_practice;
    }
  }

  // Faith Preferences (array field)
  if (options.faith_preferences && options.faith_preferences.length > 0) {
    where.faith_preferences = ArrayContains(options.faith_preferences);
  }

  // Born Muslim
  if (options.born_muslim !== undefined) {
    where.born_muslim = options.born_muslim;
  }

  // Halal Food
  if (options.halal_food !== undefined) {
    where.halal_food = options.halal_food;
  }

  // LIFESTYLE FILTERS
  
  // Smoking
  if (options.smoke !== undefined) {
    where.smoke = options.smoke;
  }

  // Alcohol
  if (options.drink_alcohol !== undefined) {
    where.drink_alcohol = options.drink_alcohol;
  }

  // INTERESTS & PERSONALITY 
  
  // Interests (array field)
  if (options.interests && options.interests.length > 0) {
    where.interests = ArrayContains(options.interests);
  }

  // Personality Traits (array field)
  if (options.personality_traits && options.personality_traits.length > 0) {
    where.personality_traits = ArrayContains(options.personality_traits);
  }

  //RELOCATION
  
  if (options.relocate !== undefined) {
    where.relocate = options.relocate;
  }

  //VERIFICATION & STATUS
  
  // Email Verified
  if (options.isEmailVerified !== undefined) {
    where.isEmailVerified = options.isEmailVerified;
  }

  // Phone Verified
  if (options.isPhoneVerified !== undefined) {
    where.isPhoneVerified = options.isPhoneVerified;
  }

  // Moderator Approved
  if (options.moderatorApproved !== undefined) {
    where.moderatorApproved = options.moderatorApproved;
  }

  // Premium User
  if (options.isPremiumUser !== undefined) {
    where.isPremiumUser = options.isPremiumUser;
  }

  //ACTIVITY FILTERS
  // Note: These require additional handling in the service layer
  
  // Just Joined (e.g., within last 7 days)
  if (options.justJoined) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    where.createdAt = MoreThanOrEqual(sevenDaysAgo);
  }

  // Note: 'recentlyActive' would require a lastActiveAt field in the User entity
  // which is not present in the current schema

  return where;
}

// Helper function to get additional query options for special filters
export function getAdditionalQueryOptions(options: DiscoverFilterOptions = {}) {
  const queryOptions: any = {};

  // Order by creation date if filtering for "Just Joined"
  if (options.justJoined) {
    queryOptions.order = { createdAt: 'DESC' };
  }

  // You can add more special ordering or selection logic here
  
  return queryOptions;
}
