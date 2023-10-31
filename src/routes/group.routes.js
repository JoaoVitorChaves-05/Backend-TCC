import { Router } from "express"
import Group from '../controllers/group.controller.js'
import auth from "../middlewares/auth.js"

const router = new Router()

router.get('/', auth.validateSession, Group.getGroups) // OK
router.post('/', auth.validateSession, Group.createGroup) // OK
router.put('/', auth.validateSession, Group.updateGroup) // OK
router.delete('/', auth.validateSession, Group.deleteGroup) // OK

router.get('/user', auth.validateSession, Group.createKey) // OK
router.post('/user', auth.validateSession, Group.addUser) // OK
router.put('/user', auth.validateSession, Group.updatePermissions) // OK
router.delete('/user', auth.validateSession, Group.removeUser) // OK

router.post('/camera', auth.validateSession, Group.addCamera) // OK
router.delete('/camera', auth.validateSession, Group.removeCamera) // OK


export default router