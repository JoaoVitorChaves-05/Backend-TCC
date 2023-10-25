import { Router } from "express"
import User from '../controllers/user.controller.js'
import auth from "../middlewares/auth.js"
import Upload from "../middlewares/upload.js"
import hasFace from "../middlewares/hasFace.js"

const router = new Router()

router.get('/', auth.validateSession, User.getUser)
router.put('/', auth.validateSession, User.updateUser)
router.post('/', Upload.upload.single('file'), hasFace, User.createUser)
router.delete('/', auth.validateSession, auth.deleteSession, User.deleteUser)

router.post('/signIn', auth.createSession)

export default router