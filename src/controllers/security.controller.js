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
        const file = req.file


        const users = await SecurityModel.selectUsers({ camera_id })
        const result = await axios.post('http://localhost:8080/file')
    }
}

export default new Security()