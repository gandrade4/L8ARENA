import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Reserva } from "./Reserva";
import { Horario } from "./Horario"

@Entity()
export class Quadra {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    type!: string;

    @Column({ default: true })
    isAvailable!: boolean;
    
    @OneToMany(() => Reserva, (reservas) => reservas.quadra)
    reservas!: Reserva [];

    @OneToMany(() => Horario, (horarios) => horarios.quadra, { cascade: true })
    horarios!: Horario [];
}