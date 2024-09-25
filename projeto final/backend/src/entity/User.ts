import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm"
import { Role } from "./Role"
import { Reserva } from "./Reserva"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({ unique: true })
    username!: string

    @Column()
    email!: string

    @Column()
    password!: string

    @ManyToOne(() => Role, (role) => role.users)
    role!: Role

    @OneToMany(() => Reserva, (reserva) => reserva.user)
    reservas!: Reserva [];
}