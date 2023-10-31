import { Router } from "express"
import User from '../controllers/user.controller.js'
import auth from "../middlewares/auth.js"
import Upload from "../middlewares/upload.js"
import hasFace from "../middlewares/hasFace.js"

const router = new Router()

router.get('/', auth.validateSession, User.getUser) // OK
router.put('/', auth.validateSession, Upload.upload.single('file'), hasFace, User.updateUser) // OK
router.post('/', Upload.upload.single('file'), hasFace, User.createUser) // OK
router.delete('/', auth.validateSession, auth.deleteSession, User.deleteUser) // OK

router.post('/signIn', auth.createSession) // OK

export default router