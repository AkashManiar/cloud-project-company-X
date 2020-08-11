import sequelize from 'sequelize'
const { Sequelize } = sequelize
import { db } from "../db/index.js"

export const Transactions = db.define("transaction", {
    transaction_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    }, 
    account_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    vendor_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false
})