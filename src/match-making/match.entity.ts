import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match {

    @PrimaryGeneratedColumn('uuid')
    id: string

    //Match - User -- Many to Many
    
    
    //Initiator -- Many to One
    // @ManyToOne(() => User, user => user.sentMatch)
    // @JoinColumn({ name: 'initiatorId'})
    // initiator: User

    // //Receiver -- Many to One
    // @ManyToOne(()=> User, user => user.receivedMatch)
    // @JoinColumn({ name: 'receiverId'})
    // receiver: User

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    matchedAt: Date
}