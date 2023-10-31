import dotenv from "dotenv"
import GroupModel from "../models/group.model.js"
import axios from "axios"

dotenv.config()

class Group {
    constructor() {
        this.keys = new Array()
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

    async createKey(req, res) {
        const { group_id } = req.body
        const { user_id } = res.locals

        const result = await GroupModel.createKey({ user_id: user_id, group_id: group_id })
        
        this.keys.push({ key: result, group_id: group_id })

        res.status(200).json(result)
    }

    async addUser(req, res) {
        const { key } = req.body
        const { user_id } = res.locals

        const { group_id } = this.keys.find({ key: key })

        if (group_id) {

            const formData = new FormData()
            formData.append('user_id', user_id)
            formData.append('group_id', group_id)
            const processPhoto = await axios.post('http://localhost:8080/group/', formData)
            .then(res => res.data)
            .catch(err => console.log(err))


            if (processPhoto.status && user_id && group_id) {
                const result = await GroupModel.addUser({user_id, group_id})
                res.status(200).json(result)
                return
            }

            res.status(200).json({ message: 'The user has not been added', status: false})
            return
        }

        res.status(200).json({ message: 'This token is not exists', status: false})
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

    async updatePermissions(req, res) {
        const { user_id, group_id, changeToAdmin } = req.body
        const admin_id = res.locals.user_id

        if (user_id && group_id && admin_id && changeToAdmin) {
            const result = await GroupModel.updatePermissions({ admin_id: admin_id, user_id: user_id, group_id: group_id, changeToAdmin: changeToAdmin })
            res.status(200).json(result)
            return
        }

        res.status(200).json({ message: 'Some data is missing. Try again later.', status: false})
    }
}

export default new Group()