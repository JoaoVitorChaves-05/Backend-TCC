import databaseFake from "../database/databaseFake.js"
import bcryptjs from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()

class User {
    constructor() {

    }

    updateUser(req, res) {
        const user_id = res.locals.user_id
        const data = req.body

        if (data.newPassword) {
            // update with new password
            res.status(200).json({ 
                message: 'The credentials has changed with succesfully.',
                token: null,
                auth: true
            })
            return
        }

        // update without new password
        res.status(200).json({
            message: 'The credentials has changed with succesfully.',
            token: null,
            auth: true
        })
    }

    getUser(req, res) {
        const user_id = res.locals.user_id

        const result = databaseFake.users.find(user => user.id === user_id)

        res.status(200).json(result)
    }

    createUser(req, res) {
        const {cpf, password} = req.body

        const password_hash = bcryptjs.hashSync(password)
        databaseFake.users.push({id: databaseFake.users.length + 1, cpf, password_hash})
        console.log(databaseFake.users)

        res.status(200).json({message: 'User created successfully. Please enter your credentials to continue.', auth: null, token: null})
    }
}

export default new User()