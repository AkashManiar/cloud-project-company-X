import sequelize from 'sequelize'
const { Sequelize } = sequelize
import cred from "./credentials.js"

export const db = new Sequelize(cred.database, cred.username, cred.password, {
    dialect: cred.dialect,
    host: cred.host,
    logging: false
})

export const connectDB = db.authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch(err => console.log('Error occurred', err))
