import { Router } from "express"
import Group from '../controllers/group.controller.js'
import auth from "../middlewares/auth.js"

const router = new Router()

router.get('/', auth.validateSession, Group.getGroups)
router.post('/', auth.validateSession, Group.createGroup)
router.put('/', auth.validateSession, Group.updateGroup)
router.delete('/', auth.validateSession, Group.deleteGroup)

router.get('/key', auth.validateSession, Group.createKey)
router.post('/key', auth.validateSession, Group.addUser)

export default router