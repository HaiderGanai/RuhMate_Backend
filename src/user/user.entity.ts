import { Exclude } from "class-transformer";
// import { AstrologyProfile } from "../astrology/astrology-profile.entity";
// import { MatchActions } from "../match-making/match-actions.entity";
// import { Match } from "../match-making/match.entity";
// import { UserPreference } from "../user-preference/user-preference.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

//The Profile is for
export enum Profile_For {
    MYSELF= "myself",
    MY_DAUGHTER = "my daughter",
    MY_SON = "my son",
    MY_BROTHER = "my brother",
    MY_SISTER = "my sister",
    MY_FRIEND = "my friend"
}

//Select the Gender
export enum Gender {
    MALE = "male",
    FEMALE = "female"
}

//What is your region
export enum Sect {
    SUNNI = "sunni",
    SHIA = "shia"
}

//Your Education Level
export enum Education_Level {
    SECONDARY = "secondary",
    HIGHER_SECONDARY = "higher secondary",
    BACHLORS_DEGREE = "bachlor's degree",
    MASTERS_DEGREE = "master's degree",
    PROFESSIONAL_DEGREE = "professional_degree"
}

//Your Marital Status
export enum Marital_Status {
    MARRIED = "married",
    UNMARRIED = "unmarried",
    DIVORCED = "divorced",
    SEPARATED = "separated",
    WIDOWED = "widowed",
    ANNULLED = "annulled"
}

//Your Religion Practice
export enum Religion_Practice {
    STRICTLY_PRACTICING = "strictly practicing",
    REGULARLY_PRACTICING = "regularly practicing",
    OCCASIONALLY_PRACTICING = "occasionally practicing",
    CULTURALLY_RELIGIOUS = "culturally religious"
}

//FAITH
export enum FAITH_PREFERENCES {
    DAILY_PRAYERS = "daily prayers",
    FASTING = "fasting",
    FIQH = "fiqh",
    DAWAH = "dawah",
    CHARITY = "charity",
    DHIKR = "dhikr",
    HAJJ = "hajj",
    UMRAH = "umrah",
    FREQUENT_DUA = "frequent dua",
    FRIDAY_PRAYER = "friday prayer",
    GOOD_IKHLAQ = "good ikhlaq",
    LEARNING_HADITH = "learning hadith",
    ISLAMIC_LECTURES = "islamic lectures",
    Learning_ARABIC = "learning arabic",
    NAFAL_PRAYERS = "nafal prayers",
    MODEST_DRESSING = "modest dressing",
    SADAQAH = "sadaqah"
}

//Select Your Interests
export enum Interests {
    TRAVELING = "traveling",
    COOKING = "cooking",
    FITNESS = "fitness",
    READING = "reading",
    WRITING = "writing",
    DHIKR = "dhikr",
    MUSIC_AND_SINGING = "music & singing",
    TECHNOLOGY = "technology",
    MOVIES = "movies",
    TV_SHOWS = "tv shows",
    PHOTOGRAPHY = "photography",
    VIDEOGRAPHY = "videography",
    ARTS_AND_PAINTING = "arts & painting",
    FASHION_AND_STYLING = "fashion & styling",
    LEARNING_LANGUAGES = "learning languages",
    HIKING = "hiking"
}

//Describe Your Personality Traits
export enum Personality_Traits {
    AMBITIOUS = "ambitious",
    CARING = "caring",
    HONEST = "honest",
    ADVENTUROUS = "adventurous",
    INDEPENDENT = "independent",
    CONFIDENT = "confident",
    COMPASSIONATE = "compassionate",
    OPTIMISTIC = "optimistic",
    OUTGOING = "outgoing",
    RESPONSIBLE = "responsible",
    ROMANTIC = "romantic",
    SPIRITUAL = "spiritual",
    CALM = "calm"
}

//Purpose - to verify different OTPs
export enum Purpose {
    EMAIL =  "email verify",
    PHONE = "phone verify",
    PASSWORD_RESET = "password reset"
}

//Select Home Ownership Status
export enum Home_Ownership {
    OWNED = "owned",
    RENT = "rent",
    PREFER_NOT_TO_SAY = "prefer not to say"
}

//Define the Size/Type of Residence
export enum ResidenceSize {
  Apartment1Bed = "1 bed apartment",
  Apartment2Bed = "2 bed apartment",
  Apartment3OrMoreBed = "3+ bed apartment",
  House3To5Marla = "3 to 5 marla house",
  House5To10Marla = "5 to 10 marla house",
  House10To20Marla = "10 to 20 marla house",
  House1Kanal = "1 kanal house",
  House2KanalOrAbove = "2 kanal or above",
}


@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    full_name: string

    @Column({ unique: true})
    email: string

    @Exclude() 
    @Column()
    password: string

    @Column({ nullable: true })
    date_of_birth: Date

    @Column({type: 'text', nullable: true,  array: true })
    languages: string[]

    @Column({ nullable: true })
    city: string

    @Column({ nullable: true })
    religion: string

    @Column({ type: 'varchar', nullable: true })
    otp: string | null

    @Column({ type: 'timestamp', nullable: true })
    otpExpiresAt: Date | null

    @Column({
        nullable: true,
        type: "enum",
        enum: Profile_For,
    })
    profile_for: Profile_For //enum

    @Column({
        nullable: true,
        type: "enum",
        enum: Gender
    })
    gender: Gender //enum

    @Column({ nullable: true })
    nick_name: string
    
    @Column({
        nullable: true,
        type: "enum",
        enum: Sect
    })
    sect: Sect //enum

    @Column({ nullable: true })
    profession: string

    @Column({
        nullable: true,
        type: "enum",
        enum: Education_Level
    })
    education_level: Education_Level //maybe enum

    @Column("jsonb", { nullable: true })
    images?: { url: string; isMain: boolean }[];


    @Column({ nullable: true })
    country_code: string

    @Column({ nullable: true })
    mobile_number: string

    @Column("text", { nullable: true, array: true })
    nationality: string[]

    @Column({ nullable: true })
    caste: string

    @Column({ nullable: true })
    ethnicity: string

    @Column({ nullable: true })
    homeTown: string

    @Column({ nullable: true })
    height_cm: number

    @Column({
        nullable: true,
        type: "enum",
        enum: Marital_Status
    })
    marital_status: Marital_Status //enum

    @Column({
        nullable: true,
        type: "enum",
        enum: Religion_Practice
    })
    religion_practice: Religion_Practice //enum

    @Column({
        nullable: true,
        type: "enum",
        enum: FAITH_PREFERENCES,
        array: true
    })
    faith_preferences: FAITH_PREFERENCES[] //enum

    @Column({ nullable: true })
    halal_food: boolean

    @Column({ nullable: true })
    smoke: boolean

    @Column({ nullable: true })
    drink_alcohol: boolean

    @Column({ nullable: true })
    have_children: boolean

    @Column({ nullable: true })
    born_muslim: boolean

    @Column({ nullable: true })
    relocate: boolean

    @Column({ nullable: true })
    household_income_range: string

    @Column({ 
        nullable: true,
        type: "enum",
        enum: ResidenceSize
    
    })
    residence_size: ResidenceSize

    @Column({ 
        nullable: true,
        type: "enum",
        enum: Home_Ownership 
    })
    home_ownership: Home_Ownership //enum

    @Column({
        nullable: true,
        type: "enum",
        enum: Interests,
        array: true
    })
    interests: Interests[] //enum


    @Column({
        nullable: true,
        type: "enum",
        enum: Personality_Traits,
        array: true
    })
    personality_traits: Personality_Traits[] //enum

    @Column({ nullable: true})
    bio: string

    @Column({
        nullable: true,
        type: "enum",
    enum: Purpose
})
    purpose?: Purpose | null //enum

    //entities for verifications

    @Column({ default: false})
    isEmailVerified: boolean

    @Column({ default: false})
    isPhoneVerified: boolean

    @Column({ default: 'false' })
    isPremiumUser: boolean

    @Column({ default: false})
    moderatorApproved: boolean  //if the profile is approved by admin

    //timestamps
    @CreateDateColumn({ type: 'timestamptz' }) 
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' }) 
    updatedAt: Date;

    //relations

    // //User - UserPreference -- One to One
    // @OneToOne(() => UserPreference, preferences => preferences.user)
    // preferences: UserPreference


    // //User - MatchAction -- One to Many
    // @OneToMany(() => MatchActions, matchactions => matchactions.user)
    // match_actions: MatchActions[]

    
    // //User - AstrologyProfile -- One to One
    // @OneToOne(()=>AstrologyProfile, astrologyProfile => astrologyProfile.user)
    // astrologyProfile: AstrologyProfile
    
    // //User - Match -- Many to Many
    
    // //Initiator - One to Many
    // @OneToMany(() => Match, match => match.initiator)
    // sentMatch: Match[]

    // //receiver - One to Many
    // @OneToMany(() => Match, match => match.receiver)
    // receivedMatch: Match[];
    
}