import { Router } from "express"
import Security from "../controllers/security.controller.js"
import auth from "../middlewares/auth.js"
import multer from "multer"

const upload = multer({ 
    dest: '../../uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const router = new Router()

router.post('/face', upload.single('file'), Security.checkFace)

export default router