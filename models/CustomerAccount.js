import sequelize from 'sequelize'
const { Sequelize } = sequelize
import { db } from "../db/index.js"

export const CustomerAccount = db.define("customer_account", {
    account_no: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }, 
    customer_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    balance: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: false
})