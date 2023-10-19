import dotenv from "dotenv"
import GroupModel from "../models/group.model.js"
import SecurityModel from "../models/security.model.js"
import axios from "axios"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtenha o caminho do diretório do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config()


class Security {
    constructor() {

    }

    async checkFace(req, res) {
        const { camera_id } = req.body
        console.log(req.body)
        console.log(req.file)
        const file = req.file.filename

        if (camera_id) {
            const group_id = await SecurityModel.selectGroup({ camera_id })

            const formData = new FormData()
            formData.append('group_id', group_id)
            formData.append('path', path.join(__dirname, '..', '..', 'uploads', file))

            const result = await axios.post('http://127.0.0.1:8080/face', formData)
            .then(response => response)
            .catch(err => console.log('erro'))
    
            console.log(result.data)
            res.status(200).json(result.data)
            return
        }

        res.status(200).json({ authorized: false })
    }

    async checkBiometry(req, res) {
        const { camera_id } = req.body
        const file = req.file.filename

        if (camera_id) {
            const users = await SecurityModel.selectUsersForBiomether({ camera_id })
            const result = await axios.post('http://localhost:8080/biomether', { users: users, path: '../../images/compare/' + file })

            res.status(200).json(result)
            return
        }

        res.status(200).json({ authorized: false })
    }
}

export default new Security()