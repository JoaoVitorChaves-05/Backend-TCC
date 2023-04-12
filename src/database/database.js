import { Sequelize, DataTypes } from "sequelize"

class Database {
    constructor() {
        this.connection = new Sequelize('mysql://root:root@localhost:3306/security_system')
        this.models = {}
        this.createTables()
    }

    async authentication() {
        try {
            await this.connection.authenticate()
        } catch (err) {
            console.error('Unable to connect to the database: ', err)
        }
    }

    async createTables() {
        this.models.Users = this.connection.define('Users', {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password_hash: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        })

        this.models.Groups = this.connection.define('Groups', {
            group_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            group_name: {
                type: DataTypes.STRING,
                allowNull: true
            }
        })

        this.models.Cameras = this.connection.define('Cameras')
    }
}