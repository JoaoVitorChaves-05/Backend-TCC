import dotenv from "dotenv"
import GroupModel from "../models/group.model"

dotenv.config()

class Group {
    constructor() {
        this.tokens = new Array()
    }

    async createGroup(req, res) {
        const { group_name } = req.body
        const { user_id } = res.locals

        const result = await GroupModel.create({ group_name: group_name, user_id: user_id})

        res.status(200).json(result)
    }

    async getGroups(req, res) {
        const { user_id } = res.locals

        const result = await GroupModel.getGroup({ user_id: user_id })

        res.status(200).json(result)
    }

    async updateGroup(req, res) {
        const { group_name, group_id } = req.body
        const { user_id } = res.locals

        const result = await GroupModel.update({
            user_id: user_id,
            group_id: group_id,
            group_name: group_name
        })

        res.status(200).json(result)
    }

    async deleteGroup(req, res) {
        const { group_id } = req.body
        const { user_id } = res.locals

        const result = await GroupModel.delete({ user_id: user_id, group_id: group_id})

        res.status(200).json(result)
    }

    async createToken(req, res) {
        const { group_id } = req.body
        const { user_id } = res.locals

        const result = await GroupModel.createToken({ user_id: user_id, group_id: group_id })
        
        this.tokens.push({ token: result, group_id: group_id })

        res.status(200).json(result)
    }

    async addUser(req, res) {
        const { token } = req.body
        const { user_id } = res.locals

        const { group_id } = this.tokens.find({ token: token })

        if (group_id) {
            const result = await GroupModel.addUser({user_id, group_id})

            res.status(200).json(result)
        }

        res.status(200).json({ message: 'This token is not exists'})
    }

    async removeUser(req, res) {
        const { group_id, user_to_remove_id } = req.body
        const { user_id } = res.locals

        const result = await GroupModel.removeUser({user_admin_id: user_id, user_id: user_to_remove_id, group_id})
        
        res.status(200).json(result)
    }

    async addCamera(req, res) {
        const { camera_id, group_id } = req.body
        const { user_id } = res.locals

        const result = await GroupModel.addCamera({group_id, camera_id, user_id})

        res.status(200).json(result)
    }

    async removeCamera(req, res) {
        const { camera_id, group_id } = req.body

        const result = await GroupModel.removeCamera({group_id, camera_id})

        res.status(200).json(result)
    }
}

export default new Group()