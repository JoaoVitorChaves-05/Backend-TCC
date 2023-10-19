import dotenv from "dotenv"
import UserModel from "../models/user.model.js"
import Upload from "../middlewares/upload.js"

dotenv.config()

class User {
    constructor() {

    }

    async updateUser(req, res) {
        const user_id = res.locals.user_id
        const data = req.body

        const result = await UserModel.update({
            user_id: user_id,
            email: data.email,
            username: data.username,
            newPassword: (() => data.password ? data.password : null)()
        })

        res.status(200).json({
            message: result.message,
            token: null,
            auth: true
        })
    }

    async getUser(req, res) {
        const user_id = res.locals.user_id

        const result = await UserModel.getUser({user_id: user_id})

        res.status(200).json(result)
    }

    async createUser(req, res) {
        const {email, username, password} = req.body
        const currentPath = Upload.getCurrentPath()
        console.log(currentPath)
        console.log('create user:', req.body)

        const result = await UserModel.create({email, username, password})
        

        res.status(200).json({message: result.message, auth: null, token: null, success: result.success})
    }

    async deleteUser(req, res) {
        const {user_id} = res.locals

        const result = await UserModel.destroyUser({user_id: user_id})

        res.status(200).json({
            message: result.message,
            auth: null,
            token: null
        })
    }
}

export default new User()