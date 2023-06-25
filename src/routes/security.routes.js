import { Router } from "express"
import Security from "../controllers/security.controller.js"
import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../../uploads');
    },
    filename: function (req, file, cb) {
      // Gere um nome de arquivo único para evitar conflitos
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
})

const upload = multer({ storage: storage });

const router = new Router()

router.post('/face', upload.single('file'), Security.checkFace)
router.post('/biomether', upload.single('file'), Security.checkBiometry)

export default router