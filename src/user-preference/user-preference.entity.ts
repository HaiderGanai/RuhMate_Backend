import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


//What is your region
export enum Sect {
    SUNNI = "sunni",
    SHIA = "shia"
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

//Your Education Level
export enum Education_Level {
    SECONDARY = "secondary",
    HIGHER_SECONDARY = "higher secondary",
    BACHLORS_DEGREE = "bachlor's degree",
    MASTERS_DEGREE = "master's degree",
    PROFESSIONAL_DEGREE = "professional_degree"
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

//Your Religion Practice
export enum Religion_Practice {
    STRICTLY_PRACTICING = "strictly practicing",
    REGULARLY_PRACTICING = "regularly practicing",
    OCCASIONALLY_PRACTICING = "occasionally practicing",
    CULTURALLY_RELIGIOUS = "culturally religious"
}

export enum Membership_Filter {
    PREMIUM = 'premium',
    VERIFIED_ONLY = 'verified only'
}

@Entity()
export class UserPreference {

    @PrimaryGeneratedColumn('uuid')
    id: string

    //UserPreferences - User -- One to One
    // @OneToOne(() => User, user => user.preferences)
    // @JoinColumn()
    // user: User

    @Column()
    minAge: number

    @Column()
    maxAge: number

    @Column()
    location_radius_km: number

    @Column({
        nullable: true,
        type: 'enum',
        enum: Sect
    })
    sect: Sect

    @Column("text", { array: true, nullable: true})
    ethnicity: string[]

    @Column()
    nationality: string

    @Column({ nullable: true })
    caste: string

    @Column()
    height_min_cm: number

    @Column()
    height_max_cm: number

    @Column({
        type: 'enum',
        enum: Marital_Status
    })
    marital_status: Marital_Status

    @Column()
    children_preferences: string

    @Column({ nullable: true })
    born_muslim: boolean

    @Column({
        type: 'enum',
        enum: Education_Level
    })
    education_level: Education_Level

    @Column()
    profession: string
    
    @Column({
        type: 'enum',
        enum: Interests,
        array: true,
        nullable: true
    })
    interests: Interests[]

    @Column({
        type: 'enum',
        enum: Personality_Traits,
        array: true,
        nullable: true
    })
    personality_traits: Personality_Traits[]

    @Column({
        type: 'enum',
        enum: Religion_Practice
    })
    religion_practice: Religion_Practice

    @Column()
    halal_food: boolean

    @Column()
    drink_alchohol: boolean

    @Column()
    smoke: boolean

    @Column()
    relocate: boolean

    @Column({
        type: 'enum',
        enum: Membership_Filter
    })
    membership_filter: Membership_Filter

    @Column()
    astrology_based: boolean

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date

}