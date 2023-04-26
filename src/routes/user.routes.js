import { Router } from "express"
import User from '../controllers/user.controller.js'
import auth from "../middlewares/auth.js"

const router = new Router()

router.get('/', auth.validateSession, User.getUser)
router.put('/', auth.validateSession, User.updateUser)
router.post('/', auth.userExists, User.createUser)

router.get('/groups', auth.validateSession, )

router.post('/signIn', auth.createSession)

router.get('/teste', (req, res) => res.send('<h1>Hi</h1>'))

export default router