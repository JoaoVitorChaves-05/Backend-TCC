import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from "multer"
import fs from "fs"


class Upload {

    constructor() {
        this.modulePath = this.getCurrentPath()
        this.upload = multer({ storage: this.createDiskStorage(this.modulePath)})
        this.getCurrentPath = this.getCurrentPath.bind(this)
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

    createFolder(name) {
        let newPath = path.join(this.getCurrentPath(), '..', '..', 'images', name)

        if (!fs.existsSync(path.join(this.getCurrentPath(), '..', '..', 'images', name))) {
            fs.mkdirSync(newPath)
        }
        
        return newPath
    }

    moveFile(current_path, new_path, filename) {
        const dest = path.join(new_path, filename)
        fs.copyFileSync(current_path, dest)
        return dest
    }
}

export default new Upload()