import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from '../entity/User'
import { Role} from '../entity/Role'

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "mydatabase.sqlite",
    entities: [User, Role],
    synchronize: true,
});
