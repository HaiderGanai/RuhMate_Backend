import { Exclude, Expose } from "class-transformer";


@Exclude()
export class DiscoverProfilesDto {

    @Expose()
    full_name: string

    // @Expose()
    // age: number  // to be added

    @Expose()
    profession: string

    // @Expose()
    // languages: string   // to be added

    // @Expose()
    // religion: string  // to be added

    @Expose()
    religion_practice: string

    @Expose()
    nationality: string

    // @Expose()
    // isPremiumUser: boolean  // to be added

    // @Expose()
    // sessionStatus: enum    // to be added

    @Expose()
    images: string

}