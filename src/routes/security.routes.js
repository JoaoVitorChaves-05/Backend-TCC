import { Router } from "express"
import Security from "../controllers/security.controller.js"
import auth from "../middlewares/auth.js"

const router = new Router()

router.post('/face', Security.authorize)

export default router