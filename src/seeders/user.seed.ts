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

// --- Utility helpers ---
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

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ✅ Random date generator (18–50 years old)
function getRandomDateOfBirth(): Date {
  const start = new Date();
  const end = new Date();
  start.setFullYear(start.getFullYear() - 50);
  end.setFullYear(end.getFullYear() - 18);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
}

// --- Static data ---
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
const languagesList = ['Urdu', 'English', 'Punjabi', 'Arabic', 'French'];
const religions = ['Islam', 'Christianity', 'Hindu'];
const city = ['Islamabad', 'Lahore', 'Karachi'];

// --- Seeder function ---
export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const hashedPassword = await bcrypt.hash('Qwerty123!', 10);
  const users: Partial<User>[] = [];

  for (let i = 1; i <= 15000; i++) {
    const gender = getRandomEnumValue(Gender);
    const fullName = gender === Gender.MALE ? `Test User ${i}` : `Test Lady ${i}`;

    users.push({
      full_name: fullName,
      email: `user${i}@example.com`,
      password: hashedPassword,
      date_of_birth: getRandomDateOfBirth(),
      languages: [randomFromArray(languagesList)],
      city: randomFromArray(city),
      isPremiumUser: getRandomBoolean(),
      religion: randomFromArray(religions),
      isEmailVerified: true,
      isPhoneVerified: true,
      profile_for: getRandomEnumValue(Profile_For),
      gender,
      sect: getRandomEnumValue(Sect),
      nick_name: `Tester${i}`,
      profession: randomFromArray(professions),
      education_level: getRandomEnumValue(Education_Level),
      images: [{ url: `https://picsum.photos/seed/${i}/200`, isMain: true }],
      country_code: '+1',
      mobile_number: `12345678${i.toString().padStart(2, '0')}`,
      nationality: randomFromArray(nationalities),
      caste: randomFromArray(castes),
      ethnicity: 'Asian',
      homeTown: randomFromArray(['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Multan']),
      height_cm: 150 + Math.floor(Math.random() * 40),
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
      moderatorApproved: Math.random() < 0.3,
    });
  }

  // await userRepository.save(users);

//batch the users into chunks to insert
const batchSize = 100;
for (let i = 0; i < users.length; i += batchSize) {
  const batch = users.slice(i, i + batchSize);
  await userRepository.save(batch); // ✅ Save only the current batch
  console.log(`Inserted users ${i + 1} to ${Math.min(i + batchSize, users.length)}`);
}
  console.log('✅ 15000 Randomized users seeded successfully');
}
