import { Router } from "express"
import Group from '../controllers/group.controller.js'
import auth from "../middlewares/auth.js"

const router = new Router()

router.get('/', auth)