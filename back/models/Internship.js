const Sequelize = require('sequelize')
const sequelize = require('../db_connection.js')

class Internships extends Sequelize.Model {}

Internships.init(
    {
        title: {
            type: Sequelize.DataTypes.STRING,
            length: 255,
            allowNull: false
        },
        description: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
        },
        startDate: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false
    }
)

module.exports = Internships