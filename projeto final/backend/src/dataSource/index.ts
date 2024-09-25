import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from '../entity/User'
import { Role} from '../entity/Role'
import { Quadra } from "../entity/Quadra";
import { Reserva } from "../entity/Reserva";
import { Horario } from "../entity/Horario";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "mydatabase.sqlite",
    entities: [User, Role, Quadra, Reserva, Horario],
    synchronize: true,
});
