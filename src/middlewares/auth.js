import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcryptjs from 'bcryptjs'
import UserModel from '../models/user.model.js'

dotenv.config()

class Auth {
    constructor() {

    }

    validateSession(req, res, next) {
        const token = req.body.token ? req.body.token : req.query.token

        console.log(token)

        const result = jwt.verify(token, process.env.SECRET_KEY)
        //const session = this.sessions.find(session => session.token == token)

        if (!result) {
            res.status(200).json({message: 'Invalid session.', token: null, auth: false})
            return
        }

        res.locals.user_id = Number(result)
        next()
        return
    }

    async createSession(req, res, next) {
        const {username, password} = req.body
        
        console.log(req.body)

        const result = await UserModel.findUser({username})

        console.log('result', result)

        const match = bcryptjs.compareSync(password, result.password_hash)

        console.log('match', match)

        if (match && result) {
            const token = jwt.sign(result.user_id, process.env.SECRET_KEY)
            res.status(200).json({message: 'Session created.', token: token, auth: true})
            return
        }

        res.status(200).json({message: 'Username or password is incorrect.'})
    }

    deleteSession(req, res, next) {
        next()
    }
}

export default new Auth()