import databaseFake from "../database/databaseFake.js"
import dotenv from "dotenv"
import UserModel from "../models/user.model.js"

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

        // update without new password
        res.status(200).json({
            message: result.message,
            token: null,
            auth: true
        })
    }

    getUser(req, res) {
        const user_id = res.locals.user_id

        const result = databaseFake.users.find(user => user.id === user_id)

        res.status(200).json(result)
    }

    async createUser(req, res) {
        const {email, username, password} = req.body

        const result = await UserModel.create({email, username, password})

        res.status(200).json({message: result.message, auth: null, token: null})
    }
}

export default new User()