import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from "multer"


class Upload {

    constructor() {
        this.modulePath = this.getCurrentPath()
        this.upload = multer({ storage: this.createDiskStorage(this.modulePath)})
    }

    getCurrentPath() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        return __dirname
    }

    createDiskStorage(modulePath) {
        console.log()
        return multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(modulePath, '..', '..', 'uploads'))
                console.log('file saved successfully')
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
            }
        })
    }
}

export default new Upload()