import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class DiscoverProfilesDto {

    @Expose()
    id: string

    @Expose()
    full_name: string

    @Expose({ toClassOnly: true })
    date_of_birth: Date;

    @Expose()
    @Transform(({ obj }) => {
  const dobValue = obj?.date_of_birth;

  if (!dobValue) return null;

  const dob = new Date(dobValue);
  if (isNaN(dob.getTime())) return null; // invalid date check

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  // If birthday hasn't happened yet this year, subtract one
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
})
    age: number;

    @Expose()
    profession: string

    @Expose()
    languages: string

    @Expose()
    religion: string 

    @Expose()
    homeTown: string

    // @Expose()
    // city: string

    @Expose()
    nationality: string

    @Expose()
    isPremiumUser: boolean

    // @Expose()
    // sessionStatus: enum    // to be added

    @Expose()
    images: string
}