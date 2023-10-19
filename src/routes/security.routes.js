import { Router } from "express"
import Security from "../controllers/security.controller.js"
import Upload from "../middlewares/upload.js"

const router = new Router()

router.post('/face', Upload.upload.single('file'), Security.checkFace)

router.post('/biomether', Upload.upload .single('uploaded_file'), Security.checkBiometry)

export default router