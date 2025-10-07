import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

//actions
export enum Action {
    LIKE = 'like',
    PASS = 'pass',
    REPORT = 'report',
    BLOCK = 'block',
    FAVORITE = 'favorite',
    COMPLIMENT = 'compliment'
}

@Entity()
export class MatchActions {
    @PrimaryGeneratedColumn('uuid')
    id: string

    //MatchAction -- User -- Many to One
    // @ManyToOne(() => User, user => user.match_actions, { onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'userId'})
    // user: User

    @Column()
    targetId: string

    @Column({
        nullable: true,
        type: 'enum',
        enum: Action
    })
    action: Action

    @Column({ nullable: true })
    compliment_text: string

    @Column({ nullable: true})
    report_reason: string

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date
}