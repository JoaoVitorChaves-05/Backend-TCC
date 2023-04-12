import { Router } from "express"
import User from '../controllers/user.controller.js'
import auth from "../middlewares/auth.js"

const router = new Router()

router.get('/data', auth.validateSession, User.getUser)

router.post('/signIn', auth.createSession)

router.post('/signUp', User.createUser)

router.get('/teste', (req, res) => res.send('<h1>Hi</h1>'))

export default router