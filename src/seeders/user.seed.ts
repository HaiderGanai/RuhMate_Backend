import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';
import {
  User,
  Gender,
  Profile_For,
  Sect,
  Education_Level,
  Marital_Status,
  Religion_Practice,
  FAITH_PREFERENCES,
  Interests,
  Personality_Traits,
  ResidenceSize,
  Home_Ownership,
} from '../user/user.entity';

function getRandomEnumValue<T extends Record<string, string | number>>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj) as T[keyof T][];
  return values[Math.floor(Math.random() * values.length)];
}

function getRandomEnumArray<T extends Record<string, string | number>>(enumObj: T, count?: number): T[keyof T][] {
  const values = Object.values(enumObj) as T[keyof T][];
  const selectedCount = count ?? Math.floor(Math.random() * 3) + 1; // 1–3 random values
  const shuffled = [...values].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, selectedCount);
}


function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

const randomFromArray = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const incomeRanges = [
  '$1000 - $2000',
  '$2000 - $4000',
  '$4000 - $6000',
  '$6000 - $10000',
  '$10000+',
];

const nationalities = [
  ['Pakistani'],
  ['Indian'],
  ['Bangladeshi'],
  ['British Pakistani'],
  ['Canadian Pakistani'],
  ['American Pakistani'],
];

const castes = ['Syed', 'Ansari', 'Mughal', 'Pathan', 'Rajput', 'Sheikh'];
const professions = ['Engineer', 'Doctor', 'Teacher', 'Designer', 'Developer', 'Lawyer', 'Business Analyst'];

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // Hash password once
  const hashedPassword = await bcrypt.hash('Qwerty123!', 10);
  const users: Partial<User>[] = [];

  for (let i = 1; i <= 30; i++) {
    const gender = getRandomEnumValue(Gender);
    const fullName = gender === Gender.MALE ? `Test User ${i}` : `Test Lady ${i}`;

    users.push({
      full_name: fullName,
      email: `user${i}@example.com`,
      password: hashedPassword,
      isEmailVerified: true,
      isPhoneVerified: true,
      profile_for: getRandomEnumValue(Profile_For),
      gender,
      sect: getRandomEnumValue(Sect),
      nick_name: `Tester${i}`,
      profession: `${randomFromArray(professions)}`,
      education_level: getRandomEnumValue(Education_Level),
      images: [
        { url: `https://picsum.photos/seed/${i}/200`, isMain: true },
      ],
      country_code: '+1',
      mobile_number: `12345678${i.toString().padStart(2, '0')}`,
      nationality: randomFromArray(nationalities),
      caste: randomFromArray(castes),
      ethnicity: 'Asian',
      homeTown: randomFromArray(['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Multan']),
      height_cm: 150 + Math.floor(Math.random() * 40), // between 150–190 cm
      marital_status: getRandomEnumValue(Marital_Status),
      religion_practice: getRandomEnumValue(Religion_Practice),
      faith_preferences: getRandomEnumArray(FAITH_PREFERENCES),
      halal_food: getRandomBoolean(),
      smoke: getRandomBoolean(),
      drink_alcohol: getRandomBoolean(),
      have_children: getRandomBoolean(),
      born_muslim: getRandomBoolean(),
      relocate: getRandomBoolean(),
      household_income_range: randomFromArray(incomeRanges),
      residence_size: getRandomEnumValue(ResidenceSize),
      home_ownership: getRandomEnumValue(Home_Ownership),
      interests: getRandomEnumArray(Interests, 3),
      personality_traits: getRandomEnumArray(Personality_Traits, 3),
      bio: `This is a randomly generated bio for ${fullName}. I enjoy ${randomFromArray(Object.values(Interests))}.`,
      purpose: null,
      moderatorApproved: Math.random() < 0.3, // 30% approved
    });
  }

  await userRepository.save(users);
  console.log('✅ 30 Randomized users seeded successfully');
}
