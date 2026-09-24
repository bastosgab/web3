const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../instances/mysql')

class User extends Model { }

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        pass: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pic: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        defaultScope: {
            attributes: { exclude: ['pass'] }
        },
        scopes: {
            withPassword: {
                attributes: { include: ['pass'] }
            }
        }
    }
)

module.exports = User