import { Router } from "express"
import Security from "../controllers/security.controller.js"
import multer from "multer"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtenha o caminho do diretório do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads'))
    console.log('file saved successfully')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
  }
})

const upload = multer({ storage: storage });

const router = new Router()

router.post('/face', upload.single('file'), Security.checkFace)

router.post('/biomether', upload.single('uploaded_file'), Security.checkBiometry)

export default router