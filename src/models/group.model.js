import database from "../database/database.js"

const thisGroupExists = async (group_name) => {
    const result_findGroup = await database.models.Groups.findOne({
        where: { group_name: group_name }
    })

    const findGroup = result_findGroup.toJSON()

    if (findGroup) return { status: true, message: 'This name already exists' }
    return { status: false, message: 'Group created successfully' }
}

const validateData = (data) => {
    if (data[0].trim().length > 0) return false
    if (typeof data[1] == 'number') return false
    return true
}

export default class GroupModel {
    static async create({ group_name, user_id }) {
        const groupExists = await thisGroupExists(group_name)
        
        if (validateData([group_name, user_id])) {

            if (!groupExists.status) {
                const group = await database.models.Groups.create({ group_name: group_name })
                await database.models.Admins.create({ user_id: user_id, group_id: group.group_id })
            }

            return { message: groupExists.message }
        }

        return { message: 'The data is not valid. Try again.' }

    }

    static async getGroup({ user_id }) {
        if (user_id) {
            const { Admins, Groups, Authorized } = database.models

            Groups.hasMany(Admins)
            Admins.belongsTo(Groups, { foreignKey: 'group_id' })

            const result_administredGroups = await Admins.findAll({ 
                attributes: ['admin_id', 'user_id', 'group_id'],
                include: {
                    model: Groups,
                    attributes: ['group_name']
                } 
            })

            const administredGroups = result_administredGroups.map(admin => admin.toJSON())

            Groups.hasMany(Authorized)
            Authorized.belongsTo(Groups, { foreignKey: 'group_id' })

            const result_authorizedGroups = await Authorized.findAll({
                attributes: ['authorized_id', 'group_id', 'user_id'],
                include: {
                    model: Groups,
                    attributes: ['group_name']
                }
            })

            const authorizedGroups = result_authorizedGroups.map(authorized => authorized.toJSON())
            
            return {
                administredGroups: administredGroups,
                authorizedGroups: authorizedGroups
            }
        }

        return { 
            message: 'This user is invalid',
            administredGroups: null,
            authorizedGroups: null
        }
    }

    static async update({user_id, group_id, group_name}) {
        if (user_id && group_id && group_name.trim()) {
            const admin = await database.models.Admin.findOne({
                where: {
                    user_id: user_id,
                    group_id: group_id
                }
            })

            if (admin.toJSON()) {
                const group = await database.models.Groups.update({
                    group_name: group_name
                }, {
                    where: {
                        group_id: group_id
                    }
                })

                return { message: 'This group has been updated.' }
            }
            
            return { message: 'You are not authorized to do this.' }
        }

        return {
            message: 'This group is invalid.'
        }
    }

    static async delete({user_id, group_id}) {
        if (user_id && group_id) {
            const admin = await database.models.Admin.findOne({
                where: {
                    user_id: user_id,
                    group_id: group_id
                }
            })

            if (admin.toJSON()) {

                await database.models.Admin.destroy({
                    where: { group_id: group_id }
                })

                await database.models.Cameras.destroy({
                    where: { group_id: group_id }
                })

                await database.models.Authorized.destroy({
                    where: { group_id: group_id }
                })

                return { message: 'This group has been deleted.' }
            }

            return { message: 'You are not authorized to do this.' }
        }

        return {
            message: 'This data is invalid'
        }
    }

    static async createKey({user_id, group_id}) {
        const admin = await database.models.Admin.findOne({
            where: {
                user_id: user_id,
                group_id: group_id
            }
        }).toJSON()

        if (admin) {
            const key = ''

            for (let n_sorteio = 4; n_sorteio > 0; n_sorteio--) {
                const number = Math.floor(Math.random() * 10)
                key += number.toString()
            }

            return key
        }
    }

    static async addUser({user_id, group_id}) {
        const user = await database.models.Authorized.findOne({
            where: {
                user_id: user_id,
                group_id: group_id
            }
        }).toJSON()

        if (!user) {
            await database.models.Authorized.create({
                group_id: group_id,
                user_id: user_id
            })

            return { message: 'The user has been added', status: true }
        }

        return { message: 'The user has already in this group', status: false }
    }

    static async removeUser({user_admin_id, user_id, group_id}) {
        const user = await database.models.Authorized.findOne({
            where: {
                user_id: user_admin_id,
                group_id: group_id
            }
        }).toJSON()

        if (!user) {
            await database.models.Authorized.destroy({
                where: {
                    user_id: user_id
                }
            })

            return { message: 'The user has been removed.' }
        }

        return { message: 'You can not authorized to remove this user.' }
    }

    static async updateToAdmin({user_admin_id, user_id, group_id}) {
        const isAdmin = await database.models.Admins.findOne({
            where: {
                user_id: user_admin_id
            }
        }).toJSON()

        if (!isAdmin) {
            await database.models.Admins.create({
                user_id,
                group_id
            })

            return { message: 'This user is an admin now.' }
        }

        return { message: 'You can not authorized to update to admin this user.'}
    }

    static async addCamera({user_id, camera_id, group_id}) {

        const admin = await database.models.Admins.findOne({
            where: {
                user_id: user_id,
                group_id: group_id
            }
        }).then(res => res.toJSON())
        .catch(err => console.log(err))

        const camera = await database.models.Cameras.findOne({
            where: {
                camera_id: camera_id
            }
        }).then(res => res.toJSON())
        .catch(err => console.log(err))

        if (!camera && admin) {

            await database.models.Cameras.create({
                group_id,
                camera_id
            })

            return { message: 'The camera has been added.', status: true }
        }

        return { message: 'This camera has already in another group', status: false }
    }

    static async removeCamera({user_id, group_id, camera_id}) {

        const admin = await database.models.Admins.findOne({
            where: {
                user_id: user_id,
                group_id: group_id
            }
        }).then(res => res.toJSON())
        .catch(err => console.log(err))

        if (user_id && group_id && camera_id && admin) {

            await database.models.Cameras.destroy({
                where: {
                    group_id: group_id
                }
            }).then(res => res.toJSON())
            .catch(err => console.log(err))

            return { message: 'The camera has been removed.', status: true }
        }

        return { message: 'The camera could not be removed. Try again later.', status: false }
        
    }

    static async updatePermissions({admin_id, user_id, group_id, changeToAdmin}) {
        const admin = await database.models.Admins.findOne({
            where: {
                user_id: admin_id,
                group_id: group_id
            }
        }).then(res => res.toJSON())
        .catch(err => console.log(err))

        if (admin) {
            if (changeToAdmin) {
                const alreadyAdmin = await database.models.Admins.findOne({
                    where: {
                        user_id: admin_id,
                        group_id: group_id
                    }
                }).then(res => res.toJSON())
                .catch(err => console.log(err))

                if (alreadyAdmin) {

                    return { message: 'This user already an admin', status: false}
                }

                await database.models.Admins.create({ user_id: user_id, group_id: group_id })
                return { message: 'This user has new permissions.', status: true}
            }

            await database.models.Admins.destroy({ user_id: user_id, group_id: group_id})
            return { message: 'The user is not admin anymore.', status: true }
        }
    }
}