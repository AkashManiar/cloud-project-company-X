import { Sequelize } from "sequelize"
import {
    dialect,
    database,
    username,
    password,
    host
} from "./credentials"

export const db = new Sequelize(database, username, password, {
    dialect: dialect,
    host: host,
    logging: false
})

export const connectDB = db.authenticate()
    .then(() => console.log('Database connected..'))
    .catch(err => console.log('Error occurred', err))
