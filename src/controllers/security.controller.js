import dotenv from "dotenv"
import GroupModel from "../models/group.model.js"
import SecurityModel from "../models/security.model.js"
import axios from "axios"

dotenv.config()


class Security {
    constructor() {

    }

    async checkFace(req, res) {
        const { camera_id } = req.body
        console.log(req.file)
        console.log(req.files)
        const file = req.file.filename

        if (camera_id) {
            const group_id = await SecurityModel.selectGroup({ camera_id })
            const result = await axios.post('http://localhost:8080/face', { group_id: group_id, path: '../../uploads/' + file})
    
            res.status(200).json(result)
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