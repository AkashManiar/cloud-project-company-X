import { Sequelize } from "sequelize"
import { db } from "../db"

export const Jobs = db.define("jobs", {
    jobName: { 
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    }, 
    partId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    }, 
    qty: { type:  Sequelize.INTEGER, defaultValue: 0}
}, {
    timestamps: false
})