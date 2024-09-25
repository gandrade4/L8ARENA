import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from "./User"
import { Quadra } from "./Quadra"

@Entity()
export class Reserva {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.reservas)
    user!: User;

    @ManyToOne(() => Quadra, (quadra) => quadra.reservas)
    quadra!: Quadra;

    @Column()
    reservaData!: Date;

    @Column({ type: "datetime"})
    startTime!: Date;

    @Column({ type: "datetime"})
    endTime!: Date;

}