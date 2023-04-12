import databaseFake from "../database/databaseFake.js"
import bcryptjs from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()

class User {
    constructor() {

    }

    getUser(req, res) {
        const user_id = res.locals.user_id

        const result = databaseFake.users.find(user => user.id === user_id)

        res.status(200).json(result)
    }

    createUser(req, res) {
        const {cpf, password} = req.body

        const password_hash = bcryptjs.hash(password, process.env.SECRET_KEY)
        databaseFake.users.push({cpf, password_hash})

        res.status(200).json({message: 'User created successfully. Please enter your credentials to continue.', auth: null, token: null})
    }
}

export default new User()