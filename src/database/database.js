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

        await this.models.Users.sync()

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

        await this.models.Groups.sync()

        this.models.Cameras = this.connection.define('Cameras', {
            camera_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            group_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: this.models.Groups,
                    key: 'group_id'
                }
            },
            camera_name: {
                type: DataTypes.STRING,
                allowNull: true
            }
        })

        await this.models.Cameras.sync()

        this.models.Admins = this.connection.define('Admins', {
            admin_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: this.models.Users,
                    key: 'user_id'
                }
            },
            group_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: this.models.Groups,
                    key: 'group_id'
                }
            }
        })

        await this.models.Admins.sync()

        this.models.Authorized = this.connection.define('Authorized', {
            authorized_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            group_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: this.models.Groups,
                    key: 'group_id'
                }
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: this.models.Users,
                    key: 'user_id'
                }
            }
        })

        await this.models.Authorized.sync()

        this.models.Biometry = this.connection.define('Biometry', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: this.models.Users,
                    key: 'user_id'
                }
            },
            biometry_path: {
                type: DataTypes.STRING,
                allowNull: false
            }
        })

        await this.models.Biometry.sync()

        this.models.Photo = this.connection.define('Photo', {
            id: { 
                type: DataTypes.INTEGER, 
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: this.models.Users,
                    key: 'user_id'
                }
            },
            photo_path: {
                type: DataType.STRING,
                allowNull: false
            }
        })

    }
}

export default new Database()