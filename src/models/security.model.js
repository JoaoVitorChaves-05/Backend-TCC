import database from "../database/database.js"

export default class SecurityModel {

    static async selectGroup({camera_id}) {
        const {Cameras} = database.models

        const result = await Cameras.findOne({where: {camera_id: camera_id}})
        .then((response) => response)

        console.log(result)

        return result.group_id
    }

    static async selectUsersForCamera({camera_id}) {
        const {Cameras, Groups, Authorized, Photo, Users} = database.models

        Groups.hasMany(Cameras)
        Cameras.belongsTo(Groups)

        Groups.belongsToMany(Users, {through: Authorized})
        Users.belongsToMany(Groups, {through: Authorized})

        Photo.belongsTo(Users)
        Users.hasOne(Photo)

        const result = await Users.findAll({
            attributes: ['user_id'],
            include: [
                {
                    model: Photo,
                    attributes: ['photo_path']
                },
                {
                    model: Cameras,
                    attributes: ['group_id']
                }
            ],
            where: {
                camera_id: camera_id
            }
        }).then(response => response.toJSON())

        console.log(result)

        return result
    }

    static async selectUsersForBiomether({camera_id}) {
        const { Cameras, Groups, Authorized, Biometry, Users } = database.models

        Groups.hasMany(Cameras)
        Cameras.belongsTo(Groups)

        Groups.belongsToMany(Users, {through: Authorized})
        Users.belongsToMany(Groups, {through: Authorized})

        Biometry.belongsTo(Users)
        Users.hasOne(Biometry)

        const result = await Users.findAll({
            attributes: ['user_id'],
            include: [
                {
                    model: Biometry,
                    attributes: ['photo_path']
                },
                {
                    model: Cameras,
                    attributes: ['group_id']
                }
            ],
            where: {
                camera_id: camera_id
            }
        }).then(response => response.toJSON())

        console.log(result)

        return result
    }
}