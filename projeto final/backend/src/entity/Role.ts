import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User"

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false})
    name!: string;
    
    @OneToMany(() => User, (user) => user.role)
    users!: User [];
}