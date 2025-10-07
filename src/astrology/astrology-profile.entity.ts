import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AstrologyProfile {

    @PrimaryGeneratedColumn('uuid')
    id: string

    //AstrologyProfile - User -- One to One
    // @OneToOne(() => User, user => user.astrologyProfile)
    // @JoinColumn({ name: 'userId'})
    // user: User

    @Column()
    date_of_birth: Date

    @Column({ nullable: true})
    time_of_birth: Date

    @Column({ nullable: true })
    place_of_birth: string

    @Column()
    zodiac_sign: string

    @Column()
    moon_sign: string

    @Column()
    sun_sign: string

    @Column()
    ascendent: string

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date
}