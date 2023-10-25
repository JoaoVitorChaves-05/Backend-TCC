import axios from 'axios'
import path from 'path'
import upload from './upload.js'

export default async function hasFace(req, res, next) {
    if (req.file) {
        const current_path = upload.getCurrentPath()
        const photo_path = path.join(current_path, '..', '..', 'uploads', req.file.filename)

        const formData = new FormData()
        formData.append('photo_path', photo_path)

        const result = await axios.post('http://127.0.0.1:8080/hasFace', formData)
        .then(res => res.data)
        .catch(err => console.log(err))

        console.log(result.status)
        if (result.status) next()
        else res.status(200).json({ message: 'This photo has no face' })
        return
    }

    res.status(200).json({ message: 'Any file has been uploaded' })
}