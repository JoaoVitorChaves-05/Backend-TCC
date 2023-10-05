import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcryptjs from 'bcryptjs'
import UserModel from '../models/user.model.js'

dotenv.config()

class Auth {
    constructor() {
        this.sessions = []
        this.createSession = this.createSession.bind(this)
    }

    validateSession(req, res, next) {
        const token = req.body.token

        const session = this.sessions.find(session => session.token == token)

        if (!session) {
            res.status(200).json({message: 'Invalid session.', token: null, auth: false})
            return
        }

        res.locals.user_id = session.user_id
        next()
        return
    }

    createSession(req, res, next) {
        const {username, password} = req.body

        const result = UserModel.findUser({username})

        const match = bcryptjs.compareSync(password, result.password_hash)

        if (match && result) {
            const token = jwt.sign({id: result.user_id}, process.env.SECRET_KEY)
            this.sessions.push({user_id: result.user_id, token: token})
            res.status(200).json({message: 'Session created.', token: token, auth: true})
            return
        }

        res.status(200).json({message: 'Username or password is incorrect.'})
    }

    deleteSession(req, res, next) {
        this.sessions = this.sessions.filter(session => session.token != req.body.token)
        next()
    }
}

export default new Auth()