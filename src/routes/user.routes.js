import { Router } from "express"
import User from '../controllers/user.controller.js'
import auth from "../middlewares/auth.js"
import Upload from "../middlewares/upload.js"

const router = new Router()

router.get('/', auth.validateSession, User.getUser)
router.put('/', auth.validateSession, User.updateUser)
router.post('/', Upload.upload.single('file'), User.createUser)
router.delete('/', auth.validateSession, auth.deleteSession, User.deleteUser)

//router.get('/groups', auth.validateSession, )

router.post('/signIn', auth.createSession)

export default router