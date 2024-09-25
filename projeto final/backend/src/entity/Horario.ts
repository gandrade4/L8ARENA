import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Quadra } from "./Quadra";

@Entity()
export class Horario {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "datetime"})
    startTime!: Date;

    @Column({ type: "datetime"})
    endTime!: Date;

    @ManyToOne(() => Quadra, (quadra) => quadra.horarios)
    quadra!: Quadra;

}