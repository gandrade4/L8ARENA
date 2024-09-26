import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Quadra } from "./Quadra";

@Entity()
export class Horario {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    startTime!: Date;

    @Column()
    endTime!: Date;

    @ManyToOne(() => Quadra, (quadra) => quadra.horarios)
    quadra!: Quadra;

}