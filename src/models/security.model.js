import database from "../database/database.js"

class SecurityModel {
    constructor() {

    }

    async selectUsers({camera_id}) {
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
}