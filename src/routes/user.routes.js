import { Router } from "express"
import auth from "../middlewares/auth"

const router = new Router()

router.get('/data', auth.validateSession, U)