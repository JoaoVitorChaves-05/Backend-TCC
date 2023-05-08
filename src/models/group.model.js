import database from "../database/database.js"

export default class GroupModel {
    static async create({group_name, user_id}) {
        const group = await database.models.Groups.create({group_name: group_name})
        await database.models.Admins.create({user_id: user_id})
    }

    static async getGroup() {

    }

    static async update() {

    }

    static async delete() {

    }
}