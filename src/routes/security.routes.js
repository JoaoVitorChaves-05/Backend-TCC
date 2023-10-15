import { Router } from "express"
import Security from "../controllers/security.controller.js"
import multer from "multer"
import fileUpload from "express-fileupload"
import fs from "fs"

const storage = multer.diskStorage({
  destination: '../../uploads/',
  filename: function (req, file, cb) {
    console.log('File:', file)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage });

const router = new Router()

router.post('/face', fileUpload(), (req, res, next) => {
  const file = req.files[0]
  let [filename, ext] = file.name.split('.')
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

  file.mv('../../uploads/' + filename + uniqueSuffix + '.' + ext)
}, Security.checkFace)

router.post('/biomether', upload.single('uploaded_file'), Security.checkBiometry)

export default router